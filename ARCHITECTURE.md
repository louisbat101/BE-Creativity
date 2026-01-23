# BE Creativity Architecture

## System Overview

BE Creativity is a full-stack e-commerce platform with three main sections:

1. **BE Natural** - Natural products marketplace
2. **BE Custom** - Custom products marketplace  
3. **Admin Panel** - Password-protected management system

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ BE Natural   │  │ BE Custom    │  │ Admin Dashboard │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘   │
│         │                 │                    │            │
│         └─────────────────┴────────────────────┘            │
│                      │                                      │
│         ┌────────────┴──────────────┐                       │
│         ▼                           ▼                       │
│    ┌─────────────┐         ┌────────────────┐             │
│    │CartContext  │         │AuthContext     │             │
│    │(local state)│         │(admin token)   │             │
│    └─────────────┘         └────────────────┘             │
│         │                           │                      │
│         └───────────────┬───────────┘                      │
│                         │                                  │
│         ┌───────────────▼───────────────┐                 │
│         │   API Service Layer           │                 │
│         │  (axios + endpoint calls)     │                 │
│         └───────────────┬───────────────┘                 │
└─────────────────────────┼──────────────────────────────────┘
                          │
                    HTTP/REST API
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                 Backend (Node.js/Express)                  │
│  ┌────────────┬──────────────┬──────────────┬────────────┐ │
│  │ Auth Route │ Product Route│ Order Route  │Payment Route
│  │            │              │              │            │ │
│  └──────┬─────┴──────┬───────┴──────┬───────┴────┬───────┘ │
│         │            │              │            │         │
│  ┌──────▼────────────▼──────────────▼────────────▼──────┐  │
│  │        Authentication Middleware                     │  │
│  │  (JWT verification & admin validation)             │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────▼────────────────────────────┐   │
│  │              MongoDB Models                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │ Product  │  │ Order    │  │ PaymentLink      │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └────────────────────────┬────────────────────────────┘   │
└─────────────────────────┬─────────────────────────────────┘
                          │
                       MongoDB
                          │
                    ┌─────▼─────┐
                    │  Database  │
                    │ be-creatv  │
                    └────────────┘
```

## Component Architecture

### Frontend Components

#### Pages
- **Home** - Hero section and featured products
- **BENatural** - Natural products listing
- **BECustom** - Custom products listing
- **Cart** - Shopping cart with order summary
- **AdminLogin** - Secure admin login
- **AdminDashboard** - Admin overview and quick actions
- **AdminProducts** - CRUD operations for products
- **AdminOrders** - Order management and status updates
- **AdminPayments** - Stripe payment link creation

#### Components
- **Navbar** - Navigation with links to all sections
- **ProductCard** - Individual product display with "Add to Cart"
- **ProductList** - Grid of products with filtering by category
- **ProtectedRoute** - Route wrapper for admin pages

#### Context
- **AuthContext** - Admin authentication state (token, login/logout)
- **CartContext** - Shopping cart state (add, remove, update)

#### Services
- **api.js** - Centralized API calls using Axios

### Backend Routes

```
/api/auth
  POST   /admin-login     - Authenticate admin
  GET    /verify          - Verify JWT token

/api/products
  GET    /                - List all products (optionally filtered by category)
  GET    /:id             - Get single product
  POST   /                - Create product (admin only)
  PUT    /:id             - Update product (admin only)
  DELETE /:id             - Delete product (admin only)

/api/orders
  POST   /                - Create new order
  GET    /                - List all orders (admin only)
  GET    /:id             - Get order details
  PUT    /:id/status      - Update order status (admin only)

/api/payments
  POST   /create-link     - Generate Stripe payment link (admin only)
  GET    /                - List payment links (admin only)
  DELETE /:id             - Delete payment link (admin only)
  POST   /webhook         - Stripe webhook handler
```

### Database Schema

#### Product
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: 'BE Natural' | 'BE Custom',
  images: [String],
  stock: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Order
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: 'pending' | 'paid' | 'shipped' | 'delivered',
  paymentMethod: String,
  stripePaymentId: String,
  createdAt: Date
}
```

#### PaymentLink
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  amount: Number,
  currency: 'USD',
  stripeLink: String,
  isActive: Boolean,
  createdAt: Date
}
```

## Authentication Flow

### Admin Login
1. User enters password on `/admin`
2. Frontend sends POST to `/api/auth/admin-login`
3. Backend verifies password against `ADMIN_PASSWORD` env var
4. Server returns JWT token
5. Frontend stores token in localStorage
6. Token included in Authorization header for protected routes

### Protected Routes
1. Before accessing admin pages, ProtectedRoute checks `isAuthenticated`
2. If not authenticated, redirects to `/admin` login
3. Each admin API call includes JWT in Authorization header
4. Backend middleware validates token and admin role
5. Request proceedes if valid, returns 401 if invalid

## Payment Flow

### Creating Payment Link
1. Admin goes to Payment Links section
2. Fills in product details (name, description, amount)
3. Frontend sends POST to `/api/payments/create-link` with JWT
4. Backend creates Stripe payment link
5. Stripe link URL saved to database
6. Admin can copy link and share with customers

### Customer Paying
1. Customer receives payment link
2. Clicks link to Stripe payment page
3. Enters credit card information
4. Payment processed by Stripe
5. Customer redirected to success page
6. Optional: Webhook notifies backend of payment completion

## Data Flow Example: Add Product

```
User (Admin)
    │
    ├─ Fills product form
    │
    ▼
AdminProducts Component
    │
    ├─ Validates input
    │
    ▼
API Service
    │
    ├─ axios.post('/api/products', data, {
    │    headers: { Authorization: `Bearer ${token}` }
    │  })
    │
    ▼
Backend /api/products POST Route
    │
    ├─ authMiddleware (validates JWT)
    │
    ├─ adminOnly (checks isAdmin flag)
    │
    ├─ Creates Product document
    │
    ▼
MongoDB
    │
    ├─ Saves product
    │
    ▼
Response sent back
    │
    ▼
Frontend updates state
    │
    ├─ Clears form
    │
    ├─ Fetches updated products list
    │
    ▼
UI Updates with new product
```

## Security Considerations

1. **Authentication**: JWT tokens expire after 24 hours
2. **Password**: Admin password stored in environment variables
3. **API Protection**: All admin endpoints require valid JWT
4. **HTTPS**: Use in production only (HTTPS required)
5. **CORS**: Configured to allow frontend requests
6. **Stripe**: All sensitive operations handled server-side
7. **Database**: MongoDB credentials in env variables

## Performance Optimization

1. **Frontend**:
   - Context API for state (no prop drilling)
   - Local storage for cart persistence
   - Component code splitting (lazy loading)

2. **Backend**:
   - Mongoose indexes on frequently queried fields
   - Request validation middleware
   - Error handling middleware

3. **Database**:
   - MongoDB indexes on `category` and `orderNumber`
   - Proper query optimization

## Error Handling

### Frontend
- Try-catch blocks in API calls
- User-friendly error messages
- State management for error states

### Backend
- Express error middleware
- HTTP status codes (400, 401, 404, 500)
- Descriptive error messages
- Validation before database operations

## Future Enhancements

1. **User Accounts** - Customer registration and login
2. **Product Search** - Full-text search functionality
3. **Reviews** - Customer product reviews and ratings
4. **Email Notifications** - Order confirmations and shipping updates
5. **Inventory Tracking** - Real-time stock updates
6. **Admin Analytics** - Sales charts and reports
7. **Multiple Payment Methods** - PayPal, Apple Pay, etc.
8. **Product Variants** - Sizes, colors, options
9. **Coupon System** - Discount codes and promotions
10. **Wishlist** - Save products for later

## Deployment Checklist

- [ ] Update all environment variables
- [ ] Use production MongoDB connection
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure Stripe production keys
- [ ] Set up error logging
- [ ] Configure backup strategy
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up automated tests
- [ ] Configure CI/CD pipeline
