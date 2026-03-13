const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Password hashing
const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

// JWT Token generation
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

const generateTokens = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

// Pagination helper
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(
    100,
    parseInt(query.limit) || parseInt(process.env.ITEMS_PER_PAGE) || 12,
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Escape regex special characters to prevent ReDoS attacks
const escapeRegex = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Sanitize MongoDB ObjectId to prevent injection
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Filter helper
const buildFilter = (query) => {
  const filter = {};

  if (query.search && typeof query.search === "string") {
    // Escape regex special characters and limit length
    const sanitizedSearch = escapeRegex(query.search.slice(0, 100));
    filter.$or = [
      { name: { $regex: sanitizedSearch, $options: "i" } },
      { description: { $regex: sanitizedSearch, $options: "i" } },
    ];
  }

  if (query.category && typeof query.category === "string") {
    // Validate ObjectId format
    if (isValidObjectId(query.category)) {
      filter.category = query.category;
    }
  }

  if (query.brand && typeof query.brand === "string") {
    // Sanitize brand input
    filter.brand = query.brand.slice(0, 100);
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    const minPrice = Number(query.minPrice);
    const maxPrice = Number(query.maxPrice);
    if (!isNaN(minPrice) && minPrice >= 0) filter.price.$gte = minPrice;
    if (!isNaN(maxPrice) && maxPrice >= 0) filter.price.$lte = maxPrice;
  }

  if (query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

// Sort helper
const buildSort = (query) => {
  if (!query.sort) return { createdAt: -1 };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    "name-asc": { name: 1 },
    "name-desc": { name: -1 },
  };

  return sortMap[query.sort] || { createdAt: -1 };
};

// Response formatter
const sendSuccess = (res, statusCode, data, message = "Success") => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Pagination response formatter
const sendPaginatedResponse = (
  res,
  statusCode,
  data,
  pagination,
  message = "Success",
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

// Extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const nameWithExtension = parts[parts.length - 1];
  const publicId = nameWithExtension.split(".")[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${publicId}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  getPaginationParams,
  buildFilter,
  buildSort,
  sendSuccess,
  sendPaginatedResponse,
  extractPublicIdFromUrl,
  escapeRegex,
  isValidObjectId,
};
