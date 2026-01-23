# BE Creativity E-Commerce Website

A full-stack e-commerce platform featuring natural and custom products with an admin panel for management.

## Project Structure

```
BE-creativity/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts (Auth, Cart)
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB schemas
│   │   ├── middleware/    # Auth middleware
│   │   └── server.js      # Server entry point
│   ├── package.json
│   └── .env.example       # Environment variables
└── README.md
```

## Features

### Customer Features
- Browse **BE Natural** products (natural products category)
- Browse **BE Custom** products (custom products category)
- Shopping cart with add/remove/update functionality
- Product details and descriptions
- Responsive design

### Admin Features
- Secure login with password protection
- Product management (create, read, update, delete)
- Order management with status tracking
- **Payment link creation** - Generate Stripe payment links for credit card payments
- Dashboard with quick statistics
- JWT authentication

## Technology Stack

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js / Express.js
- MongoDB for database
- JWT for authentication
- Stripe for payment processing
- Mongoose for data modeling

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
copy .env.example .env
```

4. Update `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/be-creativity
JWT_SECRET=your_secure_secret_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
ADMIN_PASSWORD=your_admin_password
```

5. Start MongoDB (if running locally)

6. Run development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to localhost:5000):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

Application will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=BE Natural` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Payments
- `POST /api/payments/create-link` - Create Stripe payment link (admin)
- `GET /api/payments` - Get all payment links (admin)
- `DELETE /api/payments/:id` - Delete payment link (admin)

## Admin Panel

Access the admin panel at `/admin`

### Login
- Default path: `http://localhost:3000/admin`
- Enter admin password to login
- Password is set via `ADMIN_PASSWORD` env variable

### Admin Features
1. **Dashboard** - Overview of products, orders, and revenue
2. **Products** - Add, edit, and delete products
3. **Orders** - View and update order status
4. **Payment Links** - Create and manage Stripe payment links for credit card payments

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/be-creativity
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
ADMIN_PASSWORD=secure_password_here
NODE_ENV=development
STRIPE_WEBHOOK_SECRET=whsec_test_secret (optional)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

## Payment Integration

The admin can create payment links for customers to pay via credit card:

1. Go to Admin > Payment Links
2. Click "Create Link"
3. Enter product details and amount
4. Stripe payment link is generated
5. Copy the link and share with customers
6. Customers pay via the secure Stripe payment page

## Database Models

### Product
- name (String)
- description (String)
- price (Number)
- category (BE Natural | BE Custom)
- stock (Number)
- images (Array)
- featured (Boolean)

### Order
- orderNumber (String, unique)
- customer (Object with name, email, phone, address)
- items (Array of products with quantity)
- totalAmount (Number)
- status (pending | paid | shipped | delivered)
- stripePaymentId (String)

### PaymentLink
- name (String)
- description (String)
- amount (Number)
- currency (String)
- stripeLink (String)
- isActive (Boolean)

## Security Notes

- Passwords are sent in plain text in requests (use HTTPS in production)
- Store sensitive keys in environment variables
- Use strong JWT_SECRET and ADMIN_PASSWORD
- Add rate limiting in production
- Enable HTTPS
- Implement proper CORS policies

## Deployment

### Frontend
- Build: `npm run build`
- Deploy to Netlify, Vercel, or any static hosting

### Backend
- Deploy to Heroku, AWS, DigitalOcean, etc.
- Use production MongoDB Atlas or similar
- Set all environment variables on hosting platform

## Future Enhancements

- User registration and login
- Order history for customers
- Product reviews and ratings
- Wishlist functionality
- Multiple payment methods
- Email notifications
- Inventory management
- Analytics dashboard
- Coupon/discount system

## License

MIT

## Support

For issues or questions, please contact the development team.
