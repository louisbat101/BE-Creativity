import express from 'express';
import { orderDB } from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create order (public)
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentData } = req.body;
    
    const order = orderDB.create({
      customer,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: paymentData ? 'processing' : 'pending',
      paymentMethod: paymentData ? 'credit_card' : null,
      cardLast4: paymentData ? paymentData.cardLast4 : null
    });

    // Simulate payment processing (in real implementation, call Stripe API)
    if (paymentData) {
      // Mock payment processing - in production, integrate with Stripe
      setTimeout(() => {
        orderDB.updatePaymentStatus(order._id, 'completed', 'credit_card', paymentData.cardLast4);
      }, 1000);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = orderDB.getAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const order = orderDB.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = orderDB.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status (admin only)
router.put('/:id/payment-status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = orderDB.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updated = orderDB.updatePaymentStatus(req.params.id, paymentStatus, order.paymentMethod, order.cardLast4);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

export default router;
