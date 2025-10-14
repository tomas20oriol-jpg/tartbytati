const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers (to be created)
// const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users');

// All routes require authentication
router.use(protect);

// User routes
router.get('/profile', (req, res) => {
  res.json({ success: true, data: req.user });
});

// Admin only routes
router.get('/', authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Get all users - Admin only' });
});

module.exports = router;
