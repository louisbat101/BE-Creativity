import express from 'express';
import { productDB } from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const products = productDB.getAll(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = productDB.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = productDB.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images: images || [null, null, null]
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, images } = req.body;
    
    const product = productDB.update(req.params.id, {
      name,
      description,
      price,
      category,
      stock,
      featured,
      images: images || undefined
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const product = productDB.delete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
