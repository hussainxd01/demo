# Frontend-Backend Integration Guide

This guide explains how to connect the frontend with the backend API and configure everything for optimal performance.

## Setup Instructions

### 1. Frontend Environment Configuration

Create a `.env.local` file in the root of your frontend project:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, replace with your deployed API URL:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 2. Start the Backend Server

```bash
cd server
npm install
cp .env.example .env  # Configure with your credentials
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Start the Frontend

```bash
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Features Overview

### Authentication

- User registration with email and password
- Login with JWT token management
- Automatic token refresh
- Protected routes for authenticated users
- Admin-only dashboard access

**Pages:**

- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Forgot password

### User Account

- Profile management (`/account/profile`)
- Order history (`/account/orders`)
- Favorites management (`/account/favorites`)
- Account settings (`/account/settings`)

**Features:**

- JWT tokens stored in localStorage
- Automatic login on page refresh
- Cart persistence for authenticated users
- Favorites sync with backend

### Admin Dashboard

- **Access:** `/admin` (admin users only)
- **Features:**
  - Dashboard with analytics
  - Product CRUD operations
  - Order management with status updates
  - User management
  - Review moderation

### Shopping Features

- Product search and filtering
- Add to cart with real-time sync
- Favorites/Wishlist
- Shopping cart with persistent state
- Category and brand filtering

## API Architecture

### Services Layer

All API calls are handled through service files in `/lib/services/`:

```
authService.js      - Authentication operations
productService.js   - Product management
cartService.js      - Cart and favorites
orderService.js     - Order operations
reviewService.js    - Review management
userService.js      - User profile operations
```

### API Client

The `apiClient.js` handles:

- Request/response interception
- JWT token management
- Automatic token refresh
- Retry logic for failed requests
- Error handling

## Performance Optimizations

### 1. Cart & Favorites

The frontend maintains both local state and backend sync:

- **Local state:** Instant UI updates via ShopContext
- **Backend sync:** Asynchronous API calls with AuthContext
- **Caching:** Cart/favorites loaded on auth and refresh

### 2. API Calls

- **Request debouncing:** Search queries are debounced
- **Pagination:** Products use pagination to reduce load
- **Lazy loading:** Images use native lazy loading
- **Optimistic updates:** UI updates before API confirmation

### 3. State Management

- **AuthContext:** Manages user auth state and persistence
- **ShopContext:** Manages cart and UI state with backend sync
- **Smart loading states:** Loading indicators prevent repeated requests

## Important API Endpoints

### Authentication

```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
GET /auth/me
```

### Products

```
GET /products
GET /products/:id
GET /products/search?q=query
GET /products?category=name
GET /products?brand=name
POST /products (admin)
PUT /products/:id (admin)
DELETE /products/:id (admin)
```

### Cart

```
GET /cart
POST /cart/items
PATCH /cart/items/:productId
DELETE /cart/items/:productId
DELETE /cart
```

### Favorites

```
GET /users/favorites
POST /users/favorites
DELETE /users/favorites/:productId
```

### Orders

```
POST /orders
GET /orders
GET /orders/:id
PATCH /orders/:id/status (admin)
```

### Reviews

```
GET /reviews/product/:productId
POST /reviews
PATCH /reviews/:id
DELETE /reviews/:id
GET /reviews/admin/all (admin)
PATCH /reviews/:id/approve (admin)
PATCH /reviews/:id/reject (admin)
```

## Common Tasks

### Adding a New Admin Page

1. Create page in `/app/admin/newfeature/page.js`
2. Import required services from `/lib/services/`
3. Use DataTable component for data display
4. Implement CRUD operations using service methods

Example:

```javascript
"use client";

import React, { useState, useEffect } from "react";
import myService from "@/lib/services/myService";
import DataTable from "@/components/admin/DataTable";

export default function NewFeaturePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, limit: 10 });

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await myService.getAll(page, 10);
      setData(response.items || []);
      setPagination({ total: response.total, limit: 10 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Feature Name</h1>
      <DataTable
        columns={columns}
        data={data}
        pagination={{ ...pagination, page }}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Adding Cart Functionality to a Component

```javascript
import { useShop } from "@/context/ShopContext";

export default function MyComponent() {
  const { cart, addToCart, removeFromCart, toggleFavorite, favorites } =
    useShop();

  return <button onClick={() => addToCart(product, 1)}>Add to Cart</button>;
}
```

### Protecting Routes for Authenticated Users

Use the AuthContext to protect routes:

```javascript
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return <div>Protected content</div>;
}
```

## Troubleshooting

### CORS Issues

If you get CORS errors, ensure:

1. Backend has proper CORS configuration
2. `NEXT_PUBLIC_API_URL` is correctly set
3. API is running on correct port

### Token Expired

The system automatically refreshes tokens. If issues persist:

1. Clear localStorage
2. Delete `.env.local` and reconfigure
3. Restart both frontend and backend

### API Calls Not Working

1. Check if backend is running: `http://localhost:5000/api/health`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser Network tab for request details
4. Review server logs for errors

## Best Practices

1. **Always use services:** Don't make direct API calls from components
2. **Handle errors gracefully:** Show user-friendly error messages
3. **Use loading states:** Show loading indicators during API calls
4. **Validate input:** Validate user input before sending to API
5. **Monitor performance:** Check Network tab for slow requests
6. **Test authentication:** Verify tokens work correctly
7. **Use admin panel wisely:** Only expose to admin users

## Next Steps

1. Deploy backend to production server
2. Update `NEXT_PUBLIC_API_URL` in production build
3. Configure environment variables on hosting platform
4. Set up proper error logging and monitoring
5. Implement rate limiting on backend
6. Add payment integration for orders
7. Set up email notifications

For more details, refer to individual README files in the project.
