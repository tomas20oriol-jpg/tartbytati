const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
exports.protect = async (req, res, next) => {
  let token;
  
  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Check if user is deleted
    if (req.user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Esta cuenta ha sido eliminada'
      });
    }
    
    // Check if account is locked
    if (req.user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos'
      });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no está autorizado para acceder a esta ruta`
      });
    }
    next();
  };
};

// Check if user owns the resource
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }
      
      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }
      
      // Check if user owns the resource
      if (resource.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a este recurso'
        });
      }
      
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Error del servidor'
      });
    }
  };
};

// Verify email is confirmed
exports.verifyEmail = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Por favor verifica tu email antes de continuar'
    });
  }
  next();
};

// Check subscription status
exports.checkSubscription = (req, res, next) => {
  if (!req.user.subscription.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Se requiere una suscripción activa para acceder a este contenido'
    });
  }
  
  // Check if subscription has expired
  if (req.user.subscription.endDate && req.user.subscription.endDate < Date.now()) {
    return res.status(403).json({
      success: false,
      message: 'Tu suscripción ha expirado'
    });
  }
  
  next();
};
