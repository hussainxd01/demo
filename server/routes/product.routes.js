const express = require('express');
const router = express.Router();
const { protect, restrictTo, optional } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');
const { validate, productValidation } = require('../utils/validation');
const productController = require('../controllers/product.controller');

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filtering, search, and pagination
 * @access  Public
 * @query   page, limit, sort, search, category, brand, minPrice, maxPrice, inStock
 */
router.get('/', optional, productController.getProducts);

/**
 * @route   GET /api/v1/products/featured
 * @desc    Get featured products (top rated)
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/v1/products/search
 * @desc    Search products
 * @access  Public
 * @query   query, page, limit
 */
router.get('/search', productController.searchProducts);

/**
 * @route   GET /api/v1/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @route   GET /api/v1/products/brand/:brand
 * @desc    Get products by brand
 * @access  Public
 */
router.get('/brand/:brand', productController.getProductsByBrand);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/',
  protect,
  restrictTo('admin'),
  uploadProduct.array('images', 5),
  validate(productValidation.create),
  productController.createProduct
);

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Update product (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  uploadProduct.array('images', 5),
  validate(productValidation.update),
  productController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  productController.deleteProduct
);

module.exports = router;
