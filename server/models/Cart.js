const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    giftWrap: {
      enabled: {
        type: Boolean,
        default: false,
      },
      price: {
        type: Number,
        default: 100,
      },
    },
    notes: String,
  },
  { timestamps: true }
);

// Calculate totals before saving
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.tax = Math.round(this.subtotal * 0.18); // 18% tax
  this.discount = this.discount || 0;
  let giftWrapPrice = 0;
  if (this.giftWrap && this.giftWrap.enabled) {
    giftWrapPrice = this.giftWrap.price || 100;
  }
  this.total = this.subtotal + this.tax + this.shipping + giftWrapPrice - this.discount;
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
