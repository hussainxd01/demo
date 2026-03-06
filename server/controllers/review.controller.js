const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const { AppError } = require("../middleware/errorHandler");
const {
  sendSuccess,
  sendPaginatedResponse,
  getPaginationParams,
  extractPublicIdFromUrl,
} = require("../utils/helpers");
const { deleteImageFromCloudinary } = require("../config/cloudinary");

// Get reviews for a product
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { limit, page, skip } = getPaginationParams(req.query);

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const reviews = await Review.find({
      product: productId,
      status: "approved",
    })
      .populate("user", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      product: productId,
      status: "approved",
    });

    sendPaginatedResponse(
      res,
      200,
      reviews,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Reviews fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Create review
const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.userId,
    });
    if (existingReview) {
      throw new AppError("You have already reviewed this product", 400);
    }

    const reviewData = {
      product: productId,
      user: req.userId,
      rating,
      title,
      comment,
      status: "approved", // Auto-approve for now, can be changed to 'pending'
    };

    // Handle review images if uploaded
    if (req.files && req.files.length > 0) {
      reviewData.images = req.files.map((file) => {
        const url = file.secure_url || file.path;
        const publicId =
          file.public_id || file.filename || extractPublicIdFromUrl(url);
        return { url, publicId };
      });
    }

    const review = await Review.create(reviewData);

    // Add review to user
    await User.findByIdAndUpdate(req.userId, {
      $push: { reviews: review._id },
    });

    // Add review to product and update rating (this is done in Review post hook)
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    const populatedReview = await review.populate("user", "name avatar");
    sendSuccess(res, 201, populatedReview, "Review created successfully");
  } catch (error) {
    next(error);
  }
};

// Update review
const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Check if user is review owner
    if (review.user.toString() !== req.userId) {
      throw new AppError("Not authorized to update this review", 403);
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    // Handle new images
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (review.images && review.images.length > 0) {
        for (const image of review.images) {
          await deleteImageFromCloudinary(image.publicId);
        }
      }

      review.images = req.files.map((file) => {
        const url = file.secure_url || file.path;
        const publicId =
          file.public_id || file.filename || extractPublicIdFromUrl(url);
        return { url, publicId };
      });
    }

    await review.save();
    const populatedReview = await review.populate("user", "name avatar");
    sendSuccess(res, 200, populatedReview, "Review updated successfully");
  } catch (error) {
    next(error);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Check if user is review owner or admin
    if (review.user.toString() !== req.userId && req.user.role !== "admin") {
      throw new AppError("Not authorized to delete this review", 403);
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
      for (const image of review.images) {
        await deleteImageFromCloudinary(image.publicId);
      }
    }

    // Remove from user
    await User.findByIdAndUpdate(review.user, {
      $pull: { reviews: review._id },
    });

    // Remove from product
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);
    sendSuccess(res, 200, {}, "Review deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
const markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true },
    ).populate("user", "name avatar");

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    sendSuccess(res, 200, review, "Review marked as helpful");
  } catch (error) {
    next(error);
  }
};

// Mark review as unhelpful
const markUnhelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { unhelpful: 1 } },
      { new: true },
    ).populate("user", "name avatar");

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    sendSuccess(res, 200, review, "Review marked as unhelpful");
  } catch (error) {
    next(error);
  }
};

// Get pending reviews (Admin)
const getPendingReviews = async (req, res, next) => {
  try {
    const { limit, page, skip } = getPaginationParams(req.query);

    const reviews = await Review.find({ status: "pending" })
      .populate("user", "name email")
      .populate("product", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ status: "pending" });

    sendPaginatedResponse(
      res,
      200,
      reviews,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "Pending reviews fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Approve review (Admin)
const approveReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "approved" },
      { new: true },
    ).populate("user", "name avatar");

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    sendSuccess(res, 200, review, "Review approved successfully");
  } catch (error) {
    next(error);
  }
};

// Reject review (Admin)
const rejectReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: "rejected", rejectionReason: reason || "Rejected by admin" },
      { new: true },
    ).populate("user", "name avatar");

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    sendSuccess(res, 200, review, "Review rejected successfully");
  } catch (error) {
    next(error);
  }
};

// Get all reviews (Admin)
const getAllReviews = async (req, res, next) => {
  try {
    const { limit, page, skip } = getPaginationParams(req.query);

    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments();

    sendPaginatedResponse(
      res,
      200,
      reviews,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      "All reviews fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// Delete review (Admin)
const deleteReviewAdmin = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
      for (const image of review.images) {
        await deleteImageFromCloudinary(image.publicId);
      }
    }

    // Remove from user
    await User.findByIdAndUpdate(review.user, {
      $pull: { reviews: review._id },
    });

    // Remove from product
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);
    sendSuccess(res, 200, {}, "Review deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  markUnhelpful,
  getPendingReviews,
  approveReview,
  rejectReview,
  getAllReviews,
  deleteReviewAdmin,
};
