# BE Creativity Environment Variables Reference

## Backend Environment Variables (.env)

### Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/be-creativity

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_PASSWORD=admin123

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL (for payment redirects)
FRONTEND_URL=http://localhost:3000

# Optional: Stripe Webhook
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
```

### Environment Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` or `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | Any random string (minimum 32 characters recommended) |
| `ADMIN_PASSWORD` | Admin panel password | Your chosen password |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_test_...` (test) or `sk_live_...` (production) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` (test) or `pk_live_...` (production) |
| `FRONTEND_URL` | Frontend domain for redirects | `http://localhost:3000` or your domain |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | From Stripe dashboard |

---

## Frontend Environment Variables (.env)

### Optional Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Stripe Public Key
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Frontend Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` |

---

## How to Get Stripe Keys

### For Development (Test Mode)

1. Go to https://dashboard.stripe.com
2. Sign in or create account
3. Make sure "Test mode" is enabled (toggle in top left)
4. Go to API keys section
5. Find:
   - **Secret key** (starts with `sk_test_`) → Use for `STRIPE_SECRET_KEY`
   - **Publishable key** (starts with `pk_test_`) → Use for `STRIPE_PUBLISHABLE_KEY`

### For Production

1. Enable "Live mode" in Stripe dashboard
2. Get live keys (start with `sk_live_` and `pk_live_`)
3. Use these in production `.env`
4. **IMPORTANT:** Never commit live keys to version control

---

## MongoDB Connection Strings

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/be-creativity
```

Requires MongoDB running locally (use `mongod` command)

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add username and password

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/be-creativity
```

---

## JWT Secret Generator

Generate a secure JWT secret:

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using openssl
```bash
openssl rand -hex 32
```

### Using Python
```bash
python -c "import os; print(os.urandom(32).hex())"
```

---

## Sample Complete .env Files

### Development (Local)

```env
# Server
PORT=5000
NODE_ENV=development

# Database (local)
MONGODB_URI=mongodb://localhost:27017/be-creativity

# Auth
JWT_SECRET=5f7e3d8a9c2b1f6e4a9d3c8b2f1e5a7d9c4b6e8f1a3d5c7e9b2f4a6c8e0d2f
ADMIN_PASSWORD=testadmin123

# Stripe (test keys)
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnop
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Production (Cloud)

```env
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://prod_user:SecurePassword123@be-creativity.xxxxx.mongodb.net/be-creativity

# Auth
JWT_SECRET=your_very_secure_random_key_min_32_chars
ADMIN_PASSWORD=SuperSecurePasswordChange123!

# Stripe (live keys)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Frontend
FRONTEND_URL=https://www.becreativity.com
```

---

## Security Best Practices

### ✅ Do This

1. **Generate random JWT secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use strong admin password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Example: `MySecure@Pass123`

3. **Keep .env files private**
   - Add `.env` to `.gitignore`
   - Never commit to version control
   - Don't share keys in emails

4. **Use test keys in development**
   - Keys starting with `test_` are safe to share
   - Only use for testing

5. **Rotate production keys regularly**
   - Change admin password occasionally
   - Generate new Stripe keys if needed

### ❌ Don't Do This

1. **Use default/simple passwords**
   - ❌ `admin123`, `password`, `12345`
   - ✅ Use: `MySecure@Pass123`

2. **Commit .env files**
   - ❌ Never push `.env` to GitHub
   - ✅ Use `.env.example` template

3. **Hardcode secrets in code**
   - ❌ `const password = "admin123"`
   - ✅ `const password = process.env.ADMIN_PASSWORD`

4. **Share keys publicly**
   - ❌ Post keys in issues/chat
   - ✅ Keep test keys safe too

5. **Use same password everywhere**
   - ❌ Same password for admin, database, etc.
   - ✅ Different strong passwords for each

---

## Environment Variables by Deployment Platform

### Heroku

```bash
# Set variables
heroku config:set PORT=5000
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
heroku config:set ADMIN_PASSWORD=password
heroku config:set STRIPE_SECRET_KEY=sk_test_...
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_...

# View all
heroku config

# View specific
heroku config:get MONGODB_URI
```

### Vercel (Frontend)

Create `.env.local`:
```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### AWS/EC2

Set environment variables before running:
```bash
export PORT=5000
export MONGODB_URI=mongodb+srv://...
export JWT_SECRET=...

npm start
```

### Docker

In `docker-compose.yml`:
```yaml
environment:
  - PORT=5000
  - MONGODB_URI=mongodb://mongo:27017/be-creativity
  - JWT_SECRET=your_secret
  - ADMIN_PASSWORD=password
```

### Docker .env file

In `.env` for docker-compose:
```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/be-creativity
JWT_SECRET=your_secret
ADMIN_PASSWORD=password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Troubleshooting Environment Variables

### Issue: "Cannot find module dotenv"

```bash
cd backend
npm install dotenv
```

### Issue: Variables not loading

Check:
1. File is named `.env` (not `.env.txt` or `.env.example`)
2. File is in `backend/` directory
3. Restart server after changing `.env`
4. No spaces around `=`: `KEY=value` (not `KEY = value`)

### Issue: Stripe keys not working

1. Verify test mode is enabled (for test keys)
2. Check key format: `sk_test_` or `pk_test_`
3. No extra spaces in keys
4. Restart backend after adding keys

### Issue: MongoDB connection fails

1. Check MongoDB is running (`mongod` command)
2. Verify connection string format
3. For Atlas, allow IP access in firewall
4. Check username/password in connection string

---

## Quick Reference

### Minimum Required for Dev

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/be-creativity
JWT_SECRET=any_random_string_here
ADMIN_PASSWORD=admin123
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Check Environment Loaded

In Node.js:
```javascript
console.log(process.env.PORT);        // 5000
console.log(process.env.ADMIN_PASSWORD);  // admin123
```

### Template

```bash
# Copy template
cp backend/.env.example backend/.env

# Edit with your editor
code backend/.env

# Start server
npm run backend:dev
```

---

**Remember:** Always secure your environment variables and never commit them to version control!
