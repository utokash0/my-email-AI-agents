import express from 'express';
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';
import { User, Field } from '../db/models.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim(), active: true });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Get accessible fields
    let fields = [];
    if (user.role === 'admin') {
      fields = await Field.find({ status: { $ne: 'inactive' } }).sort({ sortOrder: 1 });
    } else {
      fields = await Field.find({
        _id:    { $in: user.fieldAccess },
        status: { $ne: 'inactive' }
      }).sort({ sortOrder: 1 });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user:   { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      fields: fields.map(f => f.toJSON()),
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;