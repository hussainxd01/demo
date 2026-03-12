require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const uploadRoutes = require("./routes/upload.routes");
const categoryRoutes = require("./routes/category.routes");
const paymentRoutes = require("./routes/payment.routes");

// Import middleware
const { errorHandler } = require("./middleware/errorHandler");
const { requestLogger } = require("./middleware/requestLogger");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(requestLogger);

// Connect to database
connectDB();

// API Routes - v1
const apiPrefix = "/api/v1";

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/cart`, cartRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/reviews`, reviewRoutes);
app.use(`${apiPrefix}/upload`, uploadRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
