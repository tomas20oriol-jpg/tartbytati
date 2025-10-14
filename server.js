require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// Importar rutas
const authRoutes = require('./backend/routes/auth');

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Seguridad
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Limitar peticiones
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100 // límite de 100 peticiones por ventana
});
app.use(limiter);

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Tart by Tati funcionando correctamente');
});

// Puerto
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB y arrancar el servidor
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB establecida');
    
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

startServer();
