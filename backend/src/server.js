import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, orderDB, productDB, Product, Order } from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

console.log('✅ Initializing BE Creative SD Backend');

// Initialize MongoDB
let dbConnected = false;
connectDB().then(() => {
  dbConnected = true;
  console.log('✅ Database initialized successfully');
}).catch(err => {
  console.error('❌ Failed to initialize database:', err.message);
  process.exit(1);
});

// Stripe initialization (lazy loaded, won't block startup)
let stripe = null;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Load Stripe asynchronously after server starts
if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
  import('stripe').then(({ default: Stripe }) => {
    try {
      stripe = new Stripe(stripeSecretKey);
      console.log('✅ Stripe connected successfully');
    } catch (err) {
      console.warn('⚠️  Stripe connection failed:', err.message);
    }
  }).catch(err => {
    console.warn('⚠️  Stripe package not available:', err.message);
  });
} else {
  console.log('⚠️  No Stripe API key configured');
}

// Helper function to sync product to Stripe
async function syncProductToStripe(product) {
  if (!stripe) {
    console.warn('⚠️  Stripe not configured, skipping sync for:', product.name);
    return { stripeProductId: null, stripePriceId: null };
  }

  try {
    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description || product.name,
      metadata: {
        category: product.category,
        localProductId: product._id
      }
    });
    
    console.log(`✅ Product synced to Stripe: ${product.name} (${stripeProduct.id})`);

    // Create price in Stripe (convert dollars to cents)
    const priceInCents = Math.round(product.price * 100);
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: priceInCents,
      currency: 'usd'
    });

    console.log(`✅ Price created for ${product.name}: $${product.price} (${stripePrice.id})`);
    
    return { 
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id 
    };
  } catch (err) {
    console.error('⚠️  Failed to sync product to Stripe:', err.message);
    return { stripeProductId: null, stripePriceId: null };
  }
}

let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    database: dbConnected ? 'connected' : 'connecting',
    stripe: stripe ? 'configured' : 'not configured'
  });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    const filtered = await productDB.getAll(category);
    res.json(filtered);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productDB.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Failed to fetch product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = await productDB.create({
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || 'BE Natural',
      stock: parseInt(stock) || 0,
      featured: false,
      images: Array.isArray(images) ? images : []
    });

    // Sync to Stripe asynchronously (don't wait for it)
    syncProductToStripe(newProduct).then(stripeResult => {
      if (stripeResult.stripeProductId) {
        newProduct.stripeProductId = stripeResult.stripeProductId;
        newProduct.save();
      }
    }).catch(err => {
      console.error('Error syncing to Stripe:', err);
    });

    res.status(201).json({ 
      message: 'Product created successfully and syncing to Stripe...', 
      product: newProduct 
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    updateData.updatedAt = new Date();

    const product = await productDB.update(req.params.id, updateData);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await productDB.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deleted });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============ ORDERS ROUTES ============

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await orderDB.getAll();
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await orderDB.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentData } = req.body;

    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: 'Customer, items, and totalAmount are required' });
    }

    const order = await orderDB.create({
      customer,
      items,
      totalAmount,
      status: 'pending',
      paymentMethod: paymentData ? 'credit_card' : null,
      stripePaymentId: paymentData?.paymentIntentId || null
    });

    console.log(`✅ Order created: ${order._id} for $${totalAmount}`);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderDB.updateStatus(req.params.id, status);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status
app.put('/api/orders/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await orderDB.updatePaymentStatus(req.params.id, paymentStatus);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update payment status error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Admin login
app.post('/api/auth/admin-login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.json({ token: 'demo-token-' + Date.now(), message: 'Login successful' });
});

// Verify token
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true });
});

// Set Stripe API key (called from frontend settings)
app.post('/api/settings/stripe-key', (req, res) => {
  const { secretKey } = req.body;
  
  if (!secretKey || !secretKey.startsWith('sk_')) {
    return res.status(400).json({ error: 'Invalid Stripe secret key' });
  }

  try {
    import('stripe').then(({ default: Stripe }) => {
      try {
        stripe = new Stripe(secretKey);
        console.log('✅ Stripe API key updated successfully');
        res.json({ message: 'Stripe API key configured', connected: true });
      } catch (err) {
        console.error('Failed to initialize Stripe:', err.message);
        res.status(400).json({ error: 'Failed to initialize Stripe: ' + err.message });
      }
    }).catch(err => {
      res.status(500).json({ error: 'Stripe package error: ' + err.message });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Payment Intent
app.post('/api/charges', async (req, res) => {
  try {
    const { amount, items, customerEmail, customerName } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!stripe) {
      return res.status(400).json({ error: 'Stripe not configured. Please set API keys in Admin Settings.' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      receipt_email: customerEmail || undefined,
      description: `BE Creative SD Order - ${customerName || 'Guest'}`,
      metadata: {
        itemCount: items ? items.length : 0,
        customerName: customerName || 'Guest',
        timestamp: new Date().toISOString()
      }
    });

    console.log(`✅ Payment intent created: ${paymentIntent.id} for $${amount}`);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      status: paymentIntent.status
    });
  } catch (err) {
    console.error('Payment intent error:', err.message);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: err.message 
    });
  }
});

// Confirm Payment
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId || !stripe) {
      return res.status(400).json({ error: 'Payment intent ID required and Stripe must be configured' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      console.log(`✅ Payment confirmed: ${paymentIntentId}`);
      res.json({
        success: true,
        status: 'completed',
        message: 'Payment successful',
        paymentIntentId: paymentIntentId,
        amount: paymentIntent.amount / 100
      });
    } else {
      res.json({
        success: false,
        status: paymentIntent.status,
        message: `Payment status: ${paymentIntent.status}`
      });
    }
  } catch (err) {
    console.error('Payment confirmation error:', err.message);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      message: err.message 
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 API Base: http://localhost:${PORT}/api`);
  console.log(`�️  Database: ${dbConnected ? 'MongoDB Connected' : 'Connecting...'}`);
});

export default app;
