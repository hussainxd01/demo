const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');
const { validate, userValidation } = require('../utils/validation');
const userController = require('../controllers/user.controller');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, userController.getUserProfile);

/**
 * @route   PATCH /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/profile', protect, validate(userValidation.update), userController.updateUserProfile);

/**
 * @route   PATCH /api/v1/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.patch('/avatar', protect, uploadAvatar.single('avatar'), userController.updateAvatar);

/**
 * @route   POST /api/v1/users/wishlist
 * @desc    Add product to wishlist
 * @access  Private
 */
router.post('/wishlist/add', protect, userController.addToWishlist);

/**
 * @route   DELETE /api/v1/users/wishlist
 * @desc    Remove product from wishlist
 * @access  Private
 */
router.post('/wishlist/remove', protect, userController.removeFromWishlist);

/**
 * @route   GET /api/v1/users/wishlist
 * @desc    Get user wishlist
 * @access  Private
 */
router.get('/wishlist', protect, userController.getWishlist);

/**
 * @route   GET /api/v1/users/orders
 * @desc    Get user orders
 * @access  Private
 */
router.get('/orders', protect, userController.getUserOrders);

module.exports = router;
