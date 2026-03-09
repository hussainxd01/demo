const Joi = require("joi");

const authValidation = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  }).unknown(false),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(false),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }).unknown(false),
};

const productValidation = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    price: Joi.number().required().positive(),
    category: Joi.string()
      .required()
      .valid("SKINCARE", "BODY CARE", "BABY & KIDS", "HAIR CARE"),
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
    category: Joi.string(),
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
      email: Joi.string().email().optional(), // ✅ add this
      phone: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      postalCode: Joi.string().required(),
    }).required(),

    paymentMethod: Joi.string().valid("card", "paypal", "cod").required(),

    notes: Joi.string().allow(""),
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
  userValidation,
  orderValidation,
  reviewValidation,
  validate,
};
