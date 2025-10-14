const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware
// ===================

// 1. Helmet - Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.API_URL]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 2. CORS - Configure allowed origins
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Stricter rate limit for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde.',
  skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. Data Sanitization against NoSQL injection
app.use(mongoSanitize());

// 7. Data Sanitization against XSS
app.use(xss());

// 8. Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'category', 'rating'] // Allow these params to be duplicated
}));

// 9. Compression
app.use(compression());

// 10. Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database Connection
// ===================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB conectado correctamente');
})
.catch((err) => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  process.exit(1);
});

// Routes
// ======
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Legal endpoints (GDPR compliance)
app.get('/api/legal/privacy-policy', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Política de Privacidad',
      lastUpdated: '2025-01-01',
      content: 'Contenido de la política de privacidad...'
    }
  });
});

app.get('/api/legal/terms', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Términos y Condiciones',
      lastUpdated: '2025-01-01',
      content: 'Contenido de términos y condiciones...'
    }
  });
});

app.get('/api/legal/cookies', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Política de Cookies',
      lastUpdated: '2025-01-01',
      content: 'Contenido de política de cookies...'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('💤 Proceso terminado');
    mongoose.connection.close();
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en puerto ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
