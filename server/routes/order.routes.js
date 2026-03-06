const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { validate, orderValidation } = require('../utils/validation');
const orderController = require('../controllers/order.controller');

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order from cart
 * @access  Private
 */
router.post('/', protect, validate(orderValidation.create), orderController.createOrder);

/**
 * @route   GET /api/v1/orders/admin/all
 * @desc    Get all orders (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/all', protect, restrictTo('admin'), orderController.getAllOrders);

/**
 * @route   GET /api/v1/orders/admin/analytics
 * @desc    Get order analytics (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/analytics', protect, restrictTo('admin'), orderController.getOrderAnalytics);

/**
 * @route   GET /api/v1/orders/my-orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/my-orders', protect, orderController.getUserOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get('/:id', protect, orderController.getOrderById);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/status', protect, restrictTo('admin'), orderController.updateOrderStatus);

/**
 * @route   PATCH /api/v1/orders/:id/payment
 * @desc    Update payment status (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/payment', protect, restrictTo('admin'), orderController.updatePaymentStatus);

/**
 * @route   POST /api/v1/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.post('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
