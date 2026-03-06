const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { uploadProduct, uploadAvatar } = require('../config/cloudinary');
const { sendSuccess } = require('../utils/helpers');

/**
 * @route   POST /api/v1/upload/product-image
 * @desc    Upload product image (Admin only)
 * @access  Private (Admin)
 */
router.post('/product-image', protect, restrictTo('admin'), uploadProduct.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = req.file.secure_url || req.file.path;
    const publicId = req.file.public_id || req.file.filename;

    sendSuccess(res, 200, {
      url,
      publicId,
    }, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/upload/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', protect, uploadAvatar.single('avatar'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const url = req.file.secure_url || req.file.path;
    const publicId = req.file.public_id || req.file.filename;

    sendSuccess(res, 200, {
      url,
      publicId,
    }, 'Avatar uploaded successfully');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/upload/multiple
 * @desc    Upload multiple product images (Admin only)
 * @access  Private (Admin)
 */
router.post('/multiple', protect, restrictTo('admin'), uploadProduct.array('images', 10), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.secure_url || file.path,
      publicId: file.public_id || file.filename,
    }));

    sendSuccess(res, 200, { images }, 'Images uploaded successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
