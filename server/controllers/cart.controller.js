const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/helpers');

// Get user cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    sendSuccess(res, 200, cart, 'Cart fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      throw new AppError('Invalid product ID or quantity', 400);
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    sendSuccess(res, 200, populatedCart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      throw new AppError('Invalid product ID or quantity', 400);
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      const item = cart.items.find(item => item.product.toString() === productId);
      if (!item) {
        throw new AppError('Product not in cart', 404);
      }

      // Check stock
      const product = await Product.findById(productId);
      if (product.stock < quantity) {
        throw new AppError('Insufficient stock', 400);
      }

      item.quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    sendSuccess(res, 200, populatedCart, 'Cart updated successfully');
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    sendSuccess(res, 200, populatedCart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

// Clear cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = [];
    cart.discount = 0;
    cart.notes = '';
    cart.giftWrap.enabled = false;

    await cart.save();
    sendSuccess(res, 200, cart, 'Cart cleared successfully');
  } catch (error) {
    next(error);
  }
};

// Update cart totals and notes
const updateCart = async (req, res, next) => {
  try {
    const { discount = 0, notes = '', giftWrap = false } = req.body;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.discount = Math.max(0, discount);
    cart.notes = notes;
    cart.giftWrap.enabled = giftWrap;

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    sendSuccess(res, 200, populatedCart, 'Cart updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateCart,
};
