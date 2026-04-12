const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, authValidation } = require('../utils/validation');
const authController = require('../controllers/auth.controller');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(authValidation.register), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', validate(authValidation.refreshToken), authController.refreshAccessToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, authController.getCurrentUser);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
