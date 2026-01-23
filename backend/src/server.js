import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { orderDB } from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

console.log('✅ Initializing BE Creative SD Backend');

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

// In-memory database
const products = [
  {
    _id: '1',
    name: 'Organic Coffee',
    description: 'Premium organic coffee beans from Ethiopia',
    price: 14.99,
    category: 'BE Natural',
    stock: 50,
    featured: true
  },
  {
    _id: '2',
    name: 'Natural Honey',
    description: 'Raw honey from local bees',
    price: 12.99,
    category: 'BE Natural',
    stock: 30,
    featured: true
  },
  {
    _id: '3',
    name: 'Custom T-Shirt',
    description: 'Design your own t-shirt with custom print',
    price: 24.99,
    category: 'BE Custom',
    stock: 100,
    featured: false
  }
];

let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const category = req.query.category;
    const filtered = category ? products.filter(p => p.category === category) : products;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
app.post('/api/products', (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = {
      _id: String(Date.now()),
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || 'BE Natural',
      stock: parseInt(stock) || 0,
      featured: false,
      images: Array.isArray(images) ? images : [],
      createdAt: new Date()
    };

    products.push(newProduct);

    // Sync to Stripe asynchronously (don't wait for it)
    syncProductToStripe(newProduct).then(stripeResult => {
      newProduct.stripeProductId = stripeResult.stripeProductId;
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
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const product = products.find(p => p._id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (images !== undefined) product.images = Array.isArray(images) ? images : [];
    product.updatedAt = new Date();

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted successfully', product: deleted[0] });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============ ORDERS ROUTES ============

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = orderDB.getAll();
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orderDB.getById(req.params.id);
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
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items, totalAmount, paymentData } = req.body;

    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: 'Customer, items, and totalAmount are required' });
    }

    const order = orderDB.create({
      customer,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: paymentData?.status === 'succeeded' ? 'completed' : 'pending',
      paymentMethod: paymentData ? 'credit_card' : null,
      paymentIntentId: paymentData?.paymentIntentId || null
    });

    console.log(`✅ Order created: ${order._id} for $${totalAmount}`);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = orderDB.updateStatus(req.params.id, status);
    
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
app.put('/api/orders/:id/payment-status', (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = orderDB.updatePaymentStatus(req.params.id, paymentStatus);
    
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
  console.log(`📊 Products: ${products.length} available`);
});
