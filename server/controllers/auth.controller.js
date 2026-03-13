const User = require('../models/User');
const Cart = require('../models/Cart');
const { AppError } = require('../middleware/errorHandler');
const { comparePassword, generateTokens, verifyToken } = require('../utils/helpers');
const { sendSuccess } = require('../utils/helpers');

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Create empty cart for user
    await Cart.create({ user: user._id, items: [] });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Return user data with tokens
    sendSuccess(res, 201, {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    sendSuccess(res, 200, {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// Refresh access token
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 403);
    }

    // Generate new tokens (both access and refresh for rotation)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    sendSuccess(res, 200, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate('wishlist')
      .populate('reviews');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendSuccess(res, 200, { user: user.toJSON() }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Logout (client-side action, just for reference)
const logout = async (req, res, next) => {
  try {
    sendSuccess(res, 200, {}, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
};
