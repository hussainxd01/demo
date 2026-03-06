const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');
const { sendSuccess, sendPaginatedResponse, getPaginationParams } = require('../utils/helpers');

// Create order from cart
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address) {
      throw new AppError('Complete shipping address is required', 400);
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }
    }

    // Create order
    const orderData = {
      user: req.userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentMethod,
      notes,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      timeline: [{
        status: 'pending',
        description: 'Order placed',
      }],
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Add order to user
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { orders: order._id } }
    );

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    const populatedOrder = await order.populate('items.product');
    sendSuccess(res, 201, populatedOrder, 'Order created successfully');
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { limit, page, skip } = getPaginationParams(req.query);

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments();

    sendPaginatedResponse(res, 200, orders, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }, 'Orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    const { limit, page, skip } = getPaginationParams(req.query);

    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({ user: req.userId });

    sendPaginatedResponse(res, 200, orders, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }, 'User orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Get single order
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.userId && req.user.role !== 'admin') {
      throw new AppError('Not authorized to view this order', 403);
    }

    sendSuccess(res, 200, order, 'Order fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      throw new AppError('Invalid order status', 400);
    }

    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    // Add to timeline
    order.timeline.push({
      status,
      description: `Order ${status}`,
    });

    await order.save();
    sendSuccess(res, 200, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

// Update payment status (Admin only)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
      throw new AppError('Invalid payment status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    sendSuccess(res, 200, order, 'Payment status updated successfully');
  } catch (error) {
    next(error);
  }
};

// Cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      throw new AppError('Order cannot be cancelled', 400);
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      description: 'Order cancelled by user',
    });

    await order.save();
    sendSuccess(res, 200, order, 'Order cancelled successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
};
