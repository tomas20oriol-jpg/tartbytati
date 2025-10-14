const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.post('/create-payment-intent', (req, res) => {
  res.json({ success: true, message: 'Create Stripe payment intent' });
});

router.post('/webhook', (req, res) => {
  res.json({ success: true, message: 'Stripe webhook handler' });
});

router.get('/history', (req, res) => {
  res.json({ success: true, message: 'Get payment history' });
});

module.exports = router;
