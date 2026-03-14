const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    subcategories: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((sub) => sub.length >= 1 && sub.length <= 50);
        },
        message: "Each subcategory must be between 1 and 50 characters",
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to generate slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
  next();
});

// Index for performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

module.exports = mongoose.model("Category", categorySchema);
