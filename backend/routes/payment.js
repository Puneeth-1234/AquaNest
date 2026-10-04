const express = require('express');
const router = express.Router();
const {
  getRazorpayKey,
  createPaymentOrder,
  verifyPayment,
  testSimulateSignature
} = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');

router.get('/key', getRazorpayKey);
router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.post('/test-simulate-signature', testSimulateSignature);

module.exports = router;
