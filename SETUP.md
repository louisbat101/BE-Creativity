# BE Creativity - Development Setup

Welcome to BE Creativity! This is a full-stack e-commerce platform with natural and custom products.

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This will install both backend and frontend dependencies.

### 2. Setup Environment Variables

#### Backend (.env)
```bash
cd backend
copy .env.example .env
```

Edit `.env` with your values:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secure random string for JWT
- `STRIPE_SECRET_KEY`: Your Stripe test key
- `ADMIN_PASSWORD`: Your admin password

#### Frontend (.env optional)
```bash
cd frontend
# Create .env if needed (defaults to localhost:5000)
```

### 3. Start Servers

**Option 1: Both servers with single command**
```bash
npm run dev
```

**Option 2: Start separately**
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run frontend:start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Backend API**: http://localhost:5000/api

## File Structure

```
BE-creativity/
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/       # Navbar, ProductCard, ProductList
│   │   ├── pages/            # Home, BENatural, BECustom, Cart, Admin pages
│   │   ├── context/          # AuthContext, CartContext
│   │   ├── services/         # API service functions
│   │   ├── App.js            # Main routing
│   │   └── index.js
│   └── public/
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/           # auth, products, orders, payments
│   │   ├── models/           # Product, Order, PaymentLink
│   │   ├── middleware/       # Authentication middleware
│   │   └── server.js
│   └── package.json
├── README.md                 # Full documentation
└── package.json              # Root package with scripts
```

## Key Features

### Customer Side
✅ Browse BE Natural products
✅ Browse BE Custom products  
✅ Shopping cart
✅ Responsive design

### Admin Side
✅ Secure login (password protected)
✅ Product management (CRUD)
✅ Order management
✅ Payment link creation (Stripe)
✅ JWT authentication

## Default Admin Password

- Change the `ADMIN_PASSWORD` in `.env`
- Used for accessing `/admin` panel

## API Quick Reference

### Auth
- POST `/api/auth/admin-login` - Login with password
- GET `/api/auth/verify` - Verify token

### Products
- GET `/api/products` - List all
- GET `/api/products?category=BE Natural` - By category
- POST `/api/products` - Create (admin)
- PUT `/api/products/:id` - Update (admin)
- DELETE `/api/products/:id` - Delete (admin)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - List (admin only)
- PUT `/api/orders/:id/status` - Update status (admin)

### Payments
- POST `/api/payments/create-link` - Create Stripe link (admin)
- GET `/api/payments` - List links (admin)
- DELETE `/api/payments/:id` - Delete link (admin)

## Stripe Integration

To enable payment links:

1. Get Stripe test keys from https://dashboard.stripe.com
2. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   ```
3. In Admin > Payment Links, create a payment link
4. Share the generated Stripe link with customers

## MongoDB Setup

If using local MongoDB:
```bash
# Windows
mongod

# macOS (via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud):
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/be-creativity
```

## Common Issues

### Can't connect to MongoDB
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`

### Admin login fails
- Check `ADMIN_PASSWORD` in `.env`
- Ensure backend is running

### Frontend can't reach backend
- Verify backend runs on port 5000
- Check firewall settings
- Frontend `proxy` setting in package.json points to 5000

### Payment link creation fails
- Verify Stripe keys are correct
- Check they are in `.env`
- Use test keys for development

## Next Steps

1. Create sample products in admin
2. Test shopping cart
3. Create payment links
4. Test checkout flow
5. Monitor orders in admin

## Documentation

Full documentation is in [README.md](./README.md)

Happy coding! 🚀
