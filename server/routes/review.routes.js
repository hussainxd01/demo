const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');
const { validate, reviewValidation } = require('../utils/validation');
const reviewController = require('../controllers/review.controller');

/**
 * @route   GET /api/v1/reviews/product/:productId
 * @desc    Get reviews for a product
 * @access  Public
 */
router.get('/product/:productId', reviewController.getProductReviews);

/**
 * @route   POST /api/v1/reviews/product/:productId
 * @desc    Create review for a product
 * @access  Private
 */
router.post(
  '/product/:productId',
  protect,
  uploadProduct.array('images', 3),
  validate(reviewValidation.create),
  reviewController.createReview
);

/**
 * @route   PATCH /api/v1/reviews/:reviewId
 * @desc    Update review
 * @access  Private
 */
router.patch(
  '/:reviewId',
  protect,
  uploadProduct.array('images', 3),
  validate(reviewValidation.update),
  reviewController.updateReview
);

/**
 * @route   DELETE /api/v1/reviews/:reviewId
 * @desc    Delete review
 * @access  Private
 */
router.delete('/:reviewId', protect, reviewController.deleteReview);

/**
 * @route   POST /api/v1/reviews/:reviewId/helpful
 * @desc    Mark review as helpful
 * @access  Public
 */
router.post('/:reviewId/helpful', reviewController.markHelpful);

/**
 * @route   POST /api/v1/reviews/:reviewId/unhelpful
 * @desc    Mark review as unhelpful
 * @access  Public
 */
router.post('/:reviewId/unhelpful', reviewController.markUnhelpful);

/**
 * @route   GET /api/v1/reviews/admin/pending
 * @desc    Get pending reviews (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/pending', protect, restrictTo('admin'), reviewController.getPendingReviews);

/**
 * @route   PATCH /api/v1/reviews/admin/:reviewId/approve
 * @desc    Approve review (Admin only)
 * @access  Private (Admin)
 */
router.patch('/admin/:reviewId/approve', protect, restrictTo('admin'), reviewController.approveReview);

module.exports = router;
