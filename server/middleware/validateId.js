const mongoose = require("mongoose");
const { AppError } = require("./errorHandler");

/**
 * Middleware to validate MongoDB ObjectId parameters
 * Prevents NoSQL injection through malformed IDs
 */
const validateObjectId = (...paramNames) => {
  return (req, res, next) => {
    for (const paramName of paramNames) {
      const id = req.params[paramName];
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(
          `Invalid ${paramName.replace("Id", "")} ID format`,
          400,
        );
      }
    }
    next();
  };
};

/**
 * Validate common ID parameters
 */
const validateId = validateObjectId("id");
const validateUserId = validateObjectId("userId");
const validateProductId = validateObjectId("productId");
const validateOrderId = validateObjectId("orderId");
const validateReviewId = validateObjectId("reviewId");

module.exports = {
  validateObjectId,
  validateId,
  validateUserId,
  validateProductId,
  validateOrderId,
  validateReviewId,
};
