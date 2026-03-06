const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cart.controller');

/**
 * @route   GET /api/v1/cart
 * @desc    Get user cart
 * @access  Private
 */
router.get('/', protect, cartController.getCart);

/**
 * @route   POST /api/v1/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/add', protect, cartController.addToCart);

/**
 * @route   PATCH /api/v1/cart/update
 * @desc    Update cart item quantity
 * @access  Private
 */
router.patch('/update', protect, cartController.updateCartItem);

/**
 * @route   POST /api/v1/cart/remove
 * @desc    Remove item from cart
 * @access  Private
 */
router.post('/remove', protect, cartController.removeFromCart);

/**
 * @route   DELETE /api/v1/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/clear', protect, cartController.clearCart);

/**
 * @route   PATCH /api/v1/cart
 * @desc    Update cart (discount, notes, gift wrap)
 * @access  Private
 */
router.patch('/', protect, cartController.updateCart);

module.exports = router;
