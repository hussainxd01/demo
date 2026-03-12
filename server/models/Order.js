const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        // Support both 'product' (ObjectId ref) and 'productId' (sent from frontend)
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    // Frontend sends as 'shippingAddress' — keeping both names supported
    shippingAddress: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
      email: { type: String },
    },

    // Frontend also sends shippingInfo — alias stored here
    shippingInfo: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
      email: { type: String },
    },

    // Frontend sends billingInfo
    billingInfo: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
      email: { type: String },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cod", "razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Razorpay payment fields
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },

    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    // Support both 'shipping' and 'shippingCost' from frontend
    shipping: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // Frontend sends giftWrap
    giftWrap: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
    notes: String,
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],
  },
  { timestamps: true },
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Normalize: if frontend sent shippingInfo but not shippingAddress, copy it over
    if (!this.shippingAddress?.name && this.shippingInfo?.name) {
      this.shippingAddress = this.shippingInfo;
    }
    // Normalize: if frontend sent shippingAddress but not shippingInfo, copy it over
    if (!this.shippingInfo?.name && this.shippingAddress?.name) {
      this.shippingInfo = this.shippingAddress;
    }
    // Normalize shippingCost → shipping
    if (!this.shipping && this.shippingCost) {
      this.shipping = this.shippingCost;
    }

    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
