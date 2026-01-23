import express from 'express';
import { paymentLinkDB } from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create payment link (admin only)
router.post('/create-link', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount required' });
    }

    const paymentLink = paymentLinkDB.create({
      name,
      description,
      amount
    });

    res.json(paymentLink);
  } catch (err) {
    console.error('Payment link creation error:', err);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

// Get all payment links (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const links = paymentLinkDB.getAll();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment links' });
  }
});

// Delete payment link (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const link = paymentLinkDB.delete(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'Payment link not found' });
    }
    res.json({ message: 'Payment link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment link' });
  }
});

export default router;
