import express from 'express';
import { subcategoryDB } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all subcategories for a category
router.get('/:category', async (req, res) => {
  try {
    const subcategories = await subcategoryDB.getByCategory(req.params.category);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await subcategoryDB.getAll();
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create subcategory (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const subcategory = await subcategoryDB.create({ name, category });
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update subcategory (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const subcategory = await subcategoryDB.update(req.params.id, { name });
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete subcategory (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const subcategory = await subcategoryDB.delete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

