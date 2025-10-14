const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `El ${field} ya existe`;
    error = { message, statusCode: 400 };
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message, statusCode: 401 };
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message, statusCode: 401 };
  }
  
  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const message = 'El archivo es demasiado grande';
      error = { message, statusCode: 400 };
    }
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
