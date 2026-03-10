const express = require('express');
const categoryController = require('../controllers/category.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  categoryController.deleteCategory
);

module.exports = router;
