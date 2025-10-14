const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('dataProcessingConsent').equals('true').withMessage('Debes aceptar el procesamiento de datos')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify/:token', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
