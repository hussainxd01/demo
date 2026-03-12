const express = require("express");
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  handleWebhook,
  getPaymentConfig,
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/config", getPaymentConfig);

// Webhook route (must be before protect middleware, uses raw body)
router.post("/webhook", handleWebhook);

// Protected routes
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.post("/failure", protect, handlePaymentFailure);

module.exports = router;
