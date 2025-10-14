const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get user orders' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create order' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Get single order' });
});

// Admin routes
router.get('/admin/all', authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Get all orders - Admin only' });
});

module.exports = router;
