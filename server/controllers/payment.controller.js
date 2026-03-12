const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { AppError } = require("../middleware/errorHandler");
const { sendSuccess } = require("../utils/helpers");

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new AppError("Razorpay credentials not configured", 500);
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Razorpay order and pending order in database
const createPaymentOrder = async (req, res, next) => {
  try {
    const { shippingAddress, billingInfo, notes, giftWrap } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address) {
      throw new AppError("Complete shipping address is required", 400);
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }
    }

    // Calculate total from cart (server-side calculation for security)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = cart.tax || 0;
    const shipping = cart.shipping || 0;
    const discount = cart.discount || 0;
    const total = subtotal + tax + shipping - discount;

    // Amount in paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(total * 100);

    // Create Razorpay order
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.userId,
        cartId: cart._id.toString(),
      },
    });

    // Create pending order in database
    const orderData = {
      user: req.userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      shippingInfo: shippingAddress,
      billingInfo: billingInfo || shippingAddress,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      notes,
      giftWrap: giftWrap || false,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      timeline: [
        {
          status: "pending",
          description: "Order initiated, awaiting payment",
        },
      ],
    };

    const order = await Order.create(orderData);

    sendSuccess(
      res,
      201,
      {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      "Payment order created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Verify payment signature and complete order
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError("Missing payment verification data", 400);
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.userId) {
      throw new AppError("Unauthorized", 403);
    }

    // Verify order hasn't already been processed
    if (order.paymentStatus === "completed") {
      throw new AppError("Payment already verified", 400);
    }

    // Verify Razorpay order ID matches
    if (order.razorpayOrderId !== razorpay_order_id) {
      throw new AppError("Order ID mismatch", 400);
    }

    // Generate signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Compare signatures
    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isAuthentic) {
      // Mark payment as failed
      order.paymentStatus = "failed";
      order.timeline.push({
        status: "failed",
        description: "Payment verification failed - invalid signature",
      });
      await order.save();
      throw new AppError("Payment verification failed", 400);
    }

    // Payment is verified - update order
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "completed";
    order.status = "confirmed";
    order.timeline.push({
      status: "confirmed",
      description: "Payment successful, order confirmed",
    });
    await order.save();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Add order to user
    await User.findByIdAndUpdate(req.userId, { $push: { orders: order._id } });

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.userId },
      { $set: { items: [], subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 } }
    );

    const populatedOrder = await order.populate("items.product");
    sendSuccess(res, 200, populatedOrder, "Payment verified successfully");
  } catch (error) {
    next(error);
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res, next) => {
  try {
    const { orderId, error: paymentError } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.userId) {
      throw new AppError("Unauthorized", 403);
    }

    // Update order status
    order.paymentStatus = "failed";
    order.timeline.push({
      status: "failed",
      description: paymentError?.description || "Payment failed",
    });
    await order.save();

    sendSuccess(res, 200, { orderId: order._id }, "Payment failure recorded");
  } catch (error) {
    next(error);
  }
};

// Webhook handler for Razorpay events (for server-to-server verification)
const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // If webhook secret is not configured, skip verification
    if (!webhookSecret) {
      console.warn("Razorpay webhook secret not configured");
      return res.status(200).json({ received: true });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      throw new AppError("Missing webhook signature", 400);
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      throw new AppError("Invalid webhook signature", 400);
    }

    const event = req.body.event;
    const payload = req.body.payload;

    switch (event) {
      case "payment.captured": {
        const razorpayOrderId = payload.payment.entity.order_id;
        const razorpayPaymentId = payload.payment.entity.id;

        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== "completed") {
          order.razorpayPaymentId = razorpayPaymentId;
          order.paymentStatus = "completed";
          order.status = "confirmed";
          order.timeline.push({
            status: "confirmed",
            description: "Payment captured via webhook",
          });
          await order.save();

          // Update stock and user
          for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity },
            });
          }
          await User.findByIdAndUpdate(order.user, {
            $push: { orders: order._id },
          });
          await Cart.findOneAndUpdate(
            { user: order.user },
            { $set: { items: [] } }
          );
        }
        break;
      }

      case "payment.failed": {
        const razorpayOrderId = payload.payment.entity.order_id;
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus === "pending") {
          order.paymentStatus = "failed";
          order.timeline.push({
            status: "failed",
            description: "Payment failed via webhook",
          });
          await order.save();
        }
        break;
      }

      case "refund.created": {
        const razorpayPaymentId = payload.refund.entity.payment_id;
        const order = await Order.findOne({ razorpayPaymentId });
        if (order) {
          order.paymentStatus = "refunded";
          order.timeline.push({
            status: "refunded",
            description: "Payment refunded",
          });
          await order.save();
        }
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// Get Razorpay key for frontend
const getPaymentConfig = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      throw new AppError("Payment gateway not configured", 500);
    }
    sendSuccess(
      res,
      200,
      { keyId: process.env.RAZORPAY_KEY_ID },
      "Payment config fetched"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  handleWebhook,
  getPaymentConfig,
};
