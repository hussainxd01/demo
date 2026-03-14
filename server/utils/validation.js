const Joi = require("joi");

// Custom sanitizer extension for XSS prevention
const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  // Remove potential XSS vectors while keeping safe content
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

// Custom Joi extension with sanitization
const JoiSanitized = Joi.extend((joi) => ({
  type: "string",
  base: joi.string(),
  coerce: (value, helpers) => {
    if (typeof value === "string") {
      return { value: sanitizeString(value) };
    }
    return { value };
  },
}));

// Password pattern: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

const authValidation = {
  register: Joi.object({
    name: JoiSanitized.string()
      .required()
      .min(2)
      .max(50)
      .messages({ "string.min": "Name must be at least 2 characters" }),
    email: JoiSanitized.string()
      .email()
      .required()
      .lowercase()
      .messages({ "string.email": "Please provide a valid email address" }),
    password: JoiSanitized.string()
      .required()
      .min(8)
      .pattern(passwordPattern)
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: JoiSanitized.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" }),
  }).unknown(false),

  login: Joi.object({
    email: JoiSanitized.string().email().required().lowercase(),
    password: JoiSanitized.string().required(),
  }).unknown(false),

  refreshToken: Joi.object({
    refreshToken: JoiSanitized.string().required(),
  }).unknown(false),
};

const productValidation = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    price: Joi.number().required().positive(),
    category: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    brand: Joi.string().required(),
    stock: Joi.number().required().min(0),
    sku: Joi.string().required(),
    specifications: Joi.object({
      size: Joi.string(),
      volume: Joi.string(),
      weight: Joi.string(),
      ingredients: Joi.array().items(Joi.string()),
    }),
    instructions: Joi.string(),
    shipping: Joi.object({
      weight: Joi.number(),
      dimensions: Joi.object({
        length: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      }),
      estimatedDays: Joi.string(),
      info: Joi.string(),
    }),
    tags: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
  }).unknown(false),

  update: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    brand: Joi.string(),
    stock: Joi.number().min(0),
    sku: Joi.string(),
    specifications: Joi.object({
      size: Joi.string(),
      volume: Joi.string(),
      weight: Joi.string(),
      ingredients: Joi.array().items(Joi.string()),
    }),
    instructions: Joi.string(),
    shipping: Joi.object({
      weight: Joi.number(),
      dimensions: Joi.object({
        length: Joi.number(),
        width: Joi.number(),
        height: Joi.number(),
      }),
      estimatedDays: Joi.string(),
      info: Joi.string(),
    }),
    tags: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    existingImages: Joi.string(), // JSON stringified array of existing images to keep
    imagesToRemove: Joi.string(), // JSON stringified array of image URLs to remove
  }).unknown(false),
};

const userValidation = {
  update: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postalCode: Joi.string(),
  }).unknown(false),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
  }).unknown(false),
};

const orderValidation = {
  create: Joi.object({
    shippingAddress: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().optional(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      postalCode: Joi.string().required(),
    }).required(),

    paymentMethod: Joi.string().valid("card", "paypal", "cod").required(),

    notes: Joi.string().allow(""),

    giftWrap: Joi.boolean().optional(),
  }).unknown(false),
};
const categoryValidation = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(50),
    subcategories: Joi.array().items(Joi.string().min(1).max(50)).default([]),
    isActive: Joi.boolean().default(true),
  }).unknown(false),

  update: Joi.object({
    name: Joi.string().min(2).max(50),
    subcategories: Joi.array().items(Joi.string().min(1).max(50)),
    isActive: Joi.boolean(),
  }).unknown(false),
};

const reviewValidation = {
  create: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    title: Joi.string().required().min(5).max(100),
    comment: Joi.string().required().min(10),
  }).unknown(false),

  update: Joi.object({
    rating: Joi.number().min(1).max(5),
    title: Joi.string().min(5).max(100),
    comment: Joi.string().min(10),
  }).unknown(false),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      req.validationError = error;
      return next(error);
    }
    req.body = value;
    next();
  };
};

module.exports = {
  authValidation,
  productValidation,
  categoryValidation,
  userValidation,
  orderValidation,
  reviewValidation,
  validate,
};
