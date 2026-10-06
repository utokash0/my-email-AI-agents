import express from 'express';
import bcrypt  from 'bcryptjs';
import { User, Field } from '../db/models.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .populate('fieldAccess', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json(users.map(u => ({
      ...u.toJSON(),
      fields: u.fieldAccess.map(f => f.toJSON()),
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all fields for field assignment selector
router.get('/fields', requireAdmin, async (req, res) => {
  try {
    const fields = await Field.find({ status: { $ne: 'inactive' } }).sort({ sortOrder: 1 });
    res.json(fields.map(f => f.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create member (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, field_ids = [] } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({
      name,
      email,
      password:    hashed,
      role:        'member',
      fieldAccess: field_ids,
    });

    res.json({ ...user.toJSON(), field_ids });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update member field access
router.put('/:id/fields', requireAdmin, async (req, res) => {
  try {
    const { field_ids = [] } = req.body;
    await User.findByIdAndUpdate(req.params.id, { fieldAccess: field_ids });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT toggle user active / inactive
router.put('/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: { $ne: 'admin' } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await User.findByIdAndUpdate(req.params.id, { active: !user.active });
    res.json({ success: true, active: !user.active });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE user
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id, role: { $ne: 'admin' } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;