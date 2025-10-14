const express = require('express');
const router = express.Router();
const { protect, checkSubscription } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/status', (req, res) => {
  res.json({ 
    success: true, 
    data: req.user.subscription 
  });
});

router.post('/create', (req, res) => {
  res.json({ success: true, message: 'Create subscription' });
});

router.post('/cancel', (req, res) => {
  res.json({ success: true, message: 'Cancel subscription' });
});

// Protected content (requires active subscription)
router.get('/recipes', checkSubscription, (req, res) => {
  res.json({ success: true, message: 'Get all recipes - Subscription required' });
});

module.exports = router;
