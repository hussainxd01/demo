const User = require("../models/User");
const Cart = require("../models/Cart");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { AppError } = require("../middleware/errorHandler");
const {
  comparePassword,
  generateTokens,
  verifyToken,
  hashPassword,
} = require("../utils/helpers");
const { sendSuccess } = require("../utils/helpers");

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Create empty cart for user
    await Cart.create({ user: user._id, items: [] });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Return user data with tokens
    sendSuccess(
      res,
      201,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      "User registered successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new AppError(
        "Your account has been deactivated. Please contact support.",
        403,
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    sendSuccess(
      res,
      200,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      "Logged in successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Refresh access token
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.isActive) {
      throw new AppError("User account is deactivated", 403);
    }

    // Generate new tokens (both access and refresh for rotation)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(user._id);

    sendSuccess(
      res,
      200,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Token refreshed successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("wishlist")
      .populate("reviews");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    sendSuccess(res, 200, { user: user.toJSON() }, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

// Logout (client-side action, just for reference)
const logout = async (req, res, next) => {
  try {
    sendSuccess(res, 200, {}, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Prevent user enumeration by acting like success
      return sendSuccess(res, 200, {}, "If an account exists, an OTP has been sent");
    }

    // Generate random 6 digit secure OTP
    const resetOtp = crypto.randomInt(100000, 1000000).toString();

    // Hash it and store in user
    user.resetPasswordOtp = crypto
      .createHash("sha256")
      .update(resetOtp)
      .digest("hex");

    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send email
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following code to complete the process:\n\nOTP Code: ${resetOtp}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset OTP",
        message,
      });

      sendSuccess(res, 200, {}, "Email sent");
    } catch (err) {
      console.error("SEND EMAIL ERROR:", err);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      throw new AppError("Email could not be sent", 500);
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new AppError("Please provide email, otp and new password", 400);
    }

    // Get hashed version of the submitted otp
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("OTP is invalid or has expired", 400);
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    sendSuccess(
      res,
      200,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      "Password reset successful",
    );
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
  forgotPassword,
  resetPassword,
};
