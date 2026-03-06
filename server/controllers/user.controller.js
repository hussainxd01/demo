const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/helpers');
const { deleteImageFromCloudinary, extractPublicIdFromUrl } = require('../utils/helpers');

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate('wishlist')
      .populate('reviews');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 200, user.toJSON(), 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address, city, state, country, postalCode } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address || city || state || country || postalCode) {
      updateData.address = {
        street: address,
        city,
        state,
        country,
        postalCode,
      };
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, 200, user.toJSON(), 'User profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// Update avatar
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an image', 400);
    }

    const user = await User.findById(req.userId);

    // Delete old avatar if exists
    if (user.avatar && user.avatar.publicId) {
      await deleteImageFromCloudinary(user.avatar.publicId);
    }

    user.avatar = {
      url: req.file.secure_url,
      publicId: extractPublicIdFromUrl(req.file.secure_url),
    };

    await user.save();
    sendSuccess(res, 200, user.toJSON(), 'Avatar updated successfully');
  } catch (error) {
    next(error);
  }
};

// Add to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const user = await User.findById(req.userId);

    if (user.wishlist.includes(productId)) {
      throw new AppError('Product already in wishlist', 400);
    }

    user.wishlist.push(productId);
    await user.save();

    sendSuccess(res, 200, { wishlist: user.wishlist }, 'Product added to wishlist');
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const user = await User.findById(req.userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    sendSuccess(res, 200, { wishlist: user.wishlist }, 'Product removed from wishlist');
  } catch (error) {
    next(error);
  }
};

// Get wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 200, { wishlist: user.wishlist }, 'Wishlist fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Get user orders
const getUserOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('orders');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 200, { orders: user.orders }, 'Orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { limit, page, skip } = require('../utils/helpers').getPaginationParams(req.query);
    const { sendPaginatedResponse } = require('../utils/helpers');

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    sendPaginatedResponse(res, 200, users, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Toggle user status (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      throw new AppError('isActive must be a boolean', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 200, user, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete user avatar if exists
    if (user.avatar && user.avatar.publicId) {
      await deleteImageFromCloudinary(user.avatar.publicId);
    }

    await User.findByIdAndDelete(userId);
    sendSuccess(res, 200, {}, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get user analytics (Admin only)
const getUserAnalytics = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const totalProducts = await Product.countDocuments();

    const analytics = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalProducts,
    };

    sendSuccess(res, 200, analytics, 'User analytics fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUserOrders,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getUserAnalytics,
};
