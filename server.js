require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importar rutas
const authRoutes = require('./backend/routes/auth');

// Inicializar la aplicación Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'https://tomas20oriol-jpg.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(hpp());

// Limitar peticiones
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // límite de 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Rutas de la API
app.use('/api/auth', authRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
} else {
  // Ruta de prueba para desarrollo
  app.get('/', (req, res) => {
    res.send('API de Tart by Tati funcionando correctamente');
  });
}

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Algo salió mal en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB y arrancar el servidor
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    console.log('✅ Servidor listo para usar con Firebase');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`🌍 Accede a la API en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();