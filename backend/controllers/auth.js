const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, email, password, phone, gdprConsent } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gdprConsent: {
        marketing: gdprConsent?.marketing || false,
        analytics: gdprConsent?.analytics || false,
        consentDate: Date.now()
      },
      dataProcessingConsent: true
    });
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    
    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const message = `
      <h1>Bienvenida a tartbytati</h1>
      <p>Por favor verifica tu email haciendo clic en el siguiente enlace:</p>
      <a href="${verificationUrl}" target="_blank">Verificar Email</a>
      <p>Este enlace expira en 24 horas.</p>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verifica tu email - tartbytati',
        html: message
      });
    } catch (err) {
      console.error('Error sending email:', err);
      // Continue even if email fails
    }
    
    // Send token response
    sendTokenResponse(user, 201, res, 'Usuario registrado exitosamente. Por favor verifica tu email.');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta bloqueada temporalmente. Intenta de nuevo más tarde.'
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Log IP address
    const ip = req.ip || req.connection.remoteAddress;
    user.ipAddresses.push({ ip, date: Date.now() });
    await user.save();
    
    // Send token response
    sendTokenResponse(user, 200, res, 'Inicio de sesión exitoso');
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();
    
    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
      <h1>Restablecer Contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}" target="_blank">Restablecer Contraseña</a>
      <p>Este enlace expira en 10 minutos.</p>
      <p>Si no solicitaste esto, ignora este email.</p>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecer contraseña - tartbytati',
        html: message
      });
      
      res.status(200).json({
        success: true,
        message: 'Email enviado'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el email'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendTokenResponse(user, 200, res, 'Contraseña restablecida exitosamente');
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }
    
    user.password = req.body.newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res, 'Contraseña actualizada exitosamente');
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Email verificado exitosamente'
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'strict'
  };
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
};
