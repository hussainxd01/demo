class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new AppError(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists. Please use another value.`;
    err = new AppError(message, 400);
  }

  // JWT Token error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please try again!';
    err = new AppError(message, 400);
  }

  // JWT Expire error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired. Please try again!';
    err = new AppError(message, 400);
  }

  // Joi validation error
  if (err.isJoi) {
    const message = err.details.map(d => d.message).join(', ');
    err = new AppError(message, 400);
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    const message = 'File upload error. Please try again.';
    err = new AppError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  AppError,
  errorHandler,
};
