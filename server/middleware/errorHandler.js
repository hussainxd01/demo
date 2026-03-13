class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational errors from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log error for debugging (but don't expose to client)
  if (statusCode === 500) {
    console.error("Server Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    message = "Invalid resource ID format";
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `This ${field} is already in use. Please use another value.`;
    statusCode = 400;
  }

  // JWT Token error
  if (err.name === "JsonWebTokenError") {
    message = "Invalid authentication token";
    statusCode = 401;
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    message = "Your session has expired. Please log in again.";
    statusCode = 401;
  }

  // Joi validation error
  if (err.isJoi) {
    // Sanitize validation messages to not expose internal details
    const details = err.details.map((d) => {
      // Remove quotes and path details from message
      return d.message.replace(/"/g, "");
    });
    message = details.join(", ");
    statusCode = 400;
  }

  // Multer file upload error
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum size allowed is 10MB.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded.";
    } else {
      message = "File upload failed. Please try again.";
    }
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = errors.join(", ") || "Validation failed";
    statusCode = 400;
  }

  // Generic 500 errors should not expose internal details
  if (statusCode === 500 && !err.isOperational) {
    message = "Something went wrong. Please try again later.";
  }

  const response = {
    success: false,
    message,
  };

  // Only include stack trace in development and for non-500 errors
  if (process.env.NODE_ENV === "development" && statusCode !== 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  errorHandler,
};
