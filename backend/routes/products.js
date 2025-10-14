const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get all products' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Get single product' });
});

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Create product - Admin only' });
});

router.put('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Update product - Admin only' });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Delete product - Admin only' });
});

module.exports = router;
