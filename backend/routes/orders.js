const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getMyOrders
} = require('../controllers/orderController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

// Authenticated customer personal orders
router.get('/my-orders', authenticate, getMyOrders);

// Orders collection: Admin view all / Public & Guest & Customer can place orders
router.route('/')
  .get(authenticate, requireAdmin, getOrders)
  .post(optionalAuth, createOrder);

// Single order: Admin view / Admin status update
router.route('/:id')
  .get(authenticate, requireAdmin, getOrderById)
  .put(authenticate, requireAdmin, updateOrder);

module.exports = router;
