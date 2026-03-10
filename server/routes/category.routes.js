const express = require('express');
const categoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), categoryController.createCategory);
router.patch(
  '/:id',
  protect,
  authorize('admin'),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  categoryController.deleteCategory
);

module.exports = router;
