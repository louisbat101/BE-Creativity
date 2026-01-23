# BE Creativity - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Stripe account (for payment links)

### Step 1: Clone/Navigate to Project
```bash
cd "c:\Users\Louis Botha\iCloudDrive\develop\BE creativity"
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

### Step 3: Configure Backend Environment

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/be-creativity
JWT_SECRET=your_super_secret_key_here_123456
STRIPE_SECRET_KEY=sk_test_51234567890
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**Get Stripe Keys:**
1. Go to https://dashboard.stripe.com
2. Get test keys from API section
3. Add `sk_test_xxx` and `pk_test_xxx` to .env

### Step 4: Start Both Servers
```bash
npm run dev
```

Or start separately:
```bash
# Terminal 1
npm run backend:dev

# Terminal 2
npm run frontend:start
```

### Step 5: Access Application

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Customer site |
| http://localhost:3000/admin | Admin login |
| http://localhost:5000/api/health | API health check |

## 🔐 First Time Login

1. Go to http://localhost:3000/admin
2. Enter password: `admin123` (or your `ADMIN_PASSWORD`)
3. You're logged in! 🎉

## 📝 Create Your First Product

1. Go to Admin Dashboard
2. Click "Products"
3. Click "Add Product"
4. Fill in:
   - Name: "My Product"
   - Category: "BE Natural" or "BE Custom"
   - Price: "29.99"
   - Stock: "10"
   - Description: "Product details"
5. Click "Create Product"

## 💳 Create Payment Link

1. In Admin Dashboard, go to "Payment Links"
2. Click "Create Link"
3. Fill in:
   - Name: "Product Payment"
   - Amount: "29.99"
   - Description: "Payment for my product"
4. Click "Create Payment Link"
5. Copy the Stripe link to share with customers

## 🛒 Test Shopping Cart

1. Go to http://localhost:3000
2. Browse "BE Natural" or "BE Custom"
3. Click "Add to Cart" on any product
4. Go to Cart page
5. Adjust quantities as needed

## 📋 Common Commands

```bash
# Install dependencies
npm run install:all

# Start development (both servers)
npm run dev

# Start just backend
npm run backend:dev

# Start just frontend
npm run frontend:start

# Build frontend for production
npm run frontend:build
```

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Windows - Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env to cloud URL
```

### "Admin login fails"
- Check `ADMIN_PASSWORD` in `.env`
- Make sure backend is running on port 5000
- Clear browser cookies/cache

### "Payment link creation fails"
- Verify Stripe keys are correct in `.env`
- Use test keys (start with `sk_test_` and `pk_test_`)
- Check backend logs for errors

### "Frontend can't connect to API"
- Backend must be running on port 5000
- Check if CORS is working
- Look at browser Network tab for actual errors

### "Port already in use"
```bash
# Change PORT in backend .env
PORT=5001

# Or kill process using port 3000/5000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [SETUP.md](./SETUP.md) - Detailed setup guide

## 🎯 What You Can Do Now

✅ Create and manage products
✅ Browse products by category
✅ Add products to shopping cart
✅ Create Stripe payment links
✅ View and manage orders
✅ Update order status

## 🔄 Next Steps

1. Add more products to test
2. Create payment links for products
3. Test the customer checkout flow
4. Review orders in admin panel
5. Customize colors/branding (Tailwind CSS)
6. Add product images
7. Deploy to production

## 🌐 Categories

- **BE Natural** - Natural/organic products
- **BE Custom** - Customizable/made-to-order products
- **Admin** - Password-protected management area

## 💡 Pro Tips

- Use Stripe test cards: `4242 4242 4242 4242` (any future date, any CVC)
- Products persist in MongoDB after creation
- Cart data saved in browser localStorage
- Admin token stored securely in localStorage
- Use Chrome DevTools to monitor API calls

---

**Ready to start?** Run `npm run dev` and visit http://localhost:3000! 🚀
