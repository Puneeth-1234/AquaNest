const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public catalog listing & admin-only creation
router.route('/')
  .get(getProducts)
  .post(authenticate, requireAdmin, createProduct);

// Public single product details & admin-only update/delete
router.route('/:id')
  .get(getProductById)
  .put(authenticate, requireAdmin, updateProduct)
  .delete(authenticate, requireAdmin, deleteProduct);

module.exports = router;
