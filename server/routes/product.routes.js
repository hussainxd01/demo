const express = require('express');
const router = express.Router();
const { protect, restrictTo, optional } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');
const { validate, productValidation } = require('../utils/validation');
const productController = require('../controllers/product.controller');

function maybeParseJson(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function parseProductBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body.specifications = maybeParseJson(req.body.specifications);
    req.body.shipping = maybeParseJson(req.body.shipping);
    req.body.tags = maybeParseJson(req.body.tags);

    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (req.body.specifications && typeof req.body.specifications === 'object') {
      req.body.specifications.ingredients = maybeParseJson(
        req.body.specifications.ingredients
      );

      if (typeof req.body.specifications.ingredients === 'string') {
        req.body.specifications.ingredients = req.body.specifications.ingredients
          .split(/\r?\n|,/)
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }
  }
  next();
}

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
 * @route   GET /api/v1/products/brands
 * @desc    Get distinct active brands
 * @access  Public
 */
router.get('/brands', productController.getBrands);

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
  parseProductBody,
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
  parseProductBody,
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
