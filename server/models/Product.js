const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a category"],
    },
    subcategory: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    specifications: {
      size: String,
      volume: String,
      weight: String,
      ingredients: [String],
    },
    instructions: String,
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      estimatedDays: String,
      info: String,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true },
);

// Index for better search performance
productSchema.index({ name: "text", description: "text", brand: "text" });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
