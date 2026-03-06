const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating when review is saved
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const reviews = await mongoose.model('Review').find({ product: this.product });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
