# E-Commerce Backend API

A modular, scalable Express.js backend for a full-featured e-commerce platform with MongoDB, Cloudinary integration, and JWT authentication.

## Features

- **Authentication**: JWT-based auth with access and refresh tokens, bcryptjs password hashing
- **User Management**: User profiles, wishlist, avatar uploads, order tracking
- **Product Management**: Full CRUD operations, image uploads via Cloudinary, filtering, search, pagination
- **Shopping Cart**: Add/update/remove items, calculate totals with tax and discounts
- **Orders**: Create orders, track status, cancel orders, payment status management
- **Reviews**: Create/update/delete reviews, helpful/unhelpful voting, image uploads
- **Admin Features**: Product management, order management, review moderation
- **Image Storage**: Cloudinary integration for product images, avatars, and review images
- **Error Handling**: Comprehensive error handling with custom AppError class
- **Validation**: Input validation using Joi

## Project Structure

```
server/
├── config/              # Configuration files
│   ├── database.js     # MongoDB connection
│   └── cloudinary.js   # Cloudinary setup
├── controllers/         # Business logic
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   └── review.controller.js
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── review.routes.js
│   └── upload.routes.js
├── middleware/         # Custom middleware
│   ├── errorHandler.js # Error handling
│   ├── auth.js        # Authentication
│   └── requestLogger.js
├── utils/             # Utility functions
│   ├── helpers.js     # Helper functions
│   └── validation.js  # Joi schemas
├── server.js          # Main server file
├── package.json       # Dependencies
└── .env.example       # Environment variables template
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `CLOUDINARY_*`: Cloudinary credentials
   - `PORT`: Server port (default: 5000)

3. **Start the server**:
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Body: { name, email, password, confirmPassword }
Response: { user, accessToken, refreshToken }
```

#### Login
```
POST /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

#### Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken }
```

#### Get Current User
```
GET /auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user }
```

### Product Endpoints

#### Get All Products
```
GET /products?page=1&limit=12&sort=newest&category=SKINCARE&brand=DrBarbara&search=cream
Response: { data: [...], pagination: {...} }
```

#### Get Product Details
```
GET /products/:id
Response: { product with reviews }
```

#### Create Product (Admin)
```
POST /products
Headers: { Authorization: "Bearer <adminToken>" }
Form: { name, description, price, category, brand, stock, sku, images, specifications }
Response: { product }
```

#### Update Product (Admin)
```
PATCH /products/:id
Headers: { Authorization: "Bearer <adminToken>" }
Form: { ...fields to update }
Response: { product }
```

#### Delete Product (Admin)
```
DELETE /products/:id
Headers: { Authorization: "Bearer <adminToken>" }
Response: { success message }
```

### Cart Endpoints

#### Get Cart
```
GET /cart
Headers: { Authorization: "Bearer <token>" }
Response: { cart with items and totals }
```

#### Add to Cart
```
POST /cart/add
Headers: { Authorization: "Bearer <token>" }
Body: { productId, quantity }
Response: { updated cart }
```

#### Update Cart Item
```
PATCH /cart/update
Headers: { Authorization: "Bearer <token>" }
Body: { productId, quantity }
Response: { updated cart }
```

#### Remove from Cart
```
POST /cart/remove
Headers: { Authorization: "Bearer <token>" }
Body: { productId }
Response: { updated cart }
```

#### Clear Cart
```
DELETE /cart/clear
Headers: { Authorization: "Bearer <token>" }
Response: { empty cart }
```

### Order Endpoints

#### Create Order
```
POST /orders
Headers: { Authorization: "Bearer <token>" }
Body: { 
  shippingAddress: { name, phone, address, city, state, country, postalCode },
  paymentMethod: "card|paypal|cod",
  notes: ""
}
Response: { order }
```

#### Get User Orders
```
GET /orders/my-orders?page=1&limit=10
Headers: { Authorization: "Bearer <token>" }
Response: { data: [...], pagination: {...} }
```

#### Get Order Details
```
GET /orders/:id
Headers: { Authorization: "Bearer <token>" }
Response: { order with items and timeline }
```

#### Cancel Order
```
POST /orders/:id/cancel
Headers: { Authorization: "Bearer <token>" }
Response: { updated order }
```

#### Update Order Status (Admin)
```
PATCH /orders/:id/status
Headers: { Authorization: "Bearer <adminToken>" }
Body: { status: "pending|confirmed|shipped|delivered|cancelled", trackingNumber: "" }
Response: { updated order }
```

### Review Endpoints

#### Get Product Reviews
```
GET /reviews/product/:productId?page=1&limit=5
Response: { data: [...], pagination: {...} }
```

#### Create Review
```
POST /reviews/product/:productId
Headers: { Authorization: "Bearer <token>" }
Form: { rating, title, comment, images[] }
Response: { review }
```

#### Update Review
```
PATCH /reviews/:reviewId
Headers: { Authorization: "Bearer <token>" }
Form: { rating, title, comment, images[] }
Response: { review }
```

#### Delete Review
```
DELETE /reviews/:reviewId
Headers: { Authorization: "Bearer <token>" }
Response: { success message }
```

#### Mark Helpful/Unhelpful
```
POST /reviews/:reviewId/helpful
POST /reviews/:reviewId/unhelpful
Response: { review with updated counts }
```

## Best Practices Implemented

- **Modular Architecture**: Separation of concerns with controllers, routes, models, and utilities
- **Error Handling**: Custom AppError class with middleware handling
- **Input Validation**: Joi schemas for all request validation
- **Security**: Password hashing, JWT tokens, role-based access control
- **Database Indexing**: Optimized MongoDB indexes for performance
- **Pagination**: Built-in pagination support for list endpoints
- **Async Handling**: Express async errors middleware for cleaner async/await handling
- **Image Management**: Cloudinary integration with public ID extraction for easy deletion
- **Scalability**: Easy to add new routes, controllers, and models following existing patterns

## Environment Variables

```
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Pagination
ITEMS_PER_PAGE=12
```

## Adding New Features

### To add a new endpoint:

1. **Create Model** (`models/Feature.js`) - Define MongoDB schema
2. **Create Controller** (`controllers/feature.controller.js`) - Implement business logic
3. **Create Routes** (`routes/feature.routes.js`) - Define API endpoints
4. **Add Validation** (`utils/validation.js`) - Add Joi schemas if needed
5. **Register Routes** (`server.js`) - Import and use routes

### Example: Adding a new "Coupon" feature

```javascript
// models/Coupon.js
const couponSchema = new Schema({
  code: String,
  discount: Number,
  expiresAt: Date,
  // ... other fields
});

// controllers/coupon.controller.js
const createCoupon = async (req, res, next) => {
  // Logic here
};

// routes/coupon.routes.js
router.post('/', protect, restrictTo('admin'), createCoupon);

// server.js
app.use(`${apiPrefix}/coupons`, require('./routes/coupon.routes'));
```

## License

ISC
