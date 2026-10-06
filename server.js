import './db/connection.js'; // connects MongoDB on startup
import express        from 'express';
import cors           from 'cors';
import dotenv         from 'dotenv';
import authRoutes     from './routes/auth.js';
import projectRoutes  from './routes/projects.js';
import campaignRoutes from './routes/campaigns.js';
import userRoutes     from './routes/users.js';
import { requireAuth }  from './middleware/auth.js';
import { requireAdmin } from './middleware/auth.js';
import { Field }      from './db/models.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ── PUBLIC ────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);

// ── PROTECTED ─────────────────────────────────────────────────────
app.use('/api/projects',  requireAuth, projectRoutes);
app.use('/api/campaigns', requireAuth, campaignRoutes);
app.use('/api/users',     userRoutes);  // requireAdmin handled per route inside

// ── FIELDS (returns fields the logged-in user can access) ─────────
app.get('/api/fields', requireAuth, async (req, res) => {
  try {
    let fields;
    if (req.user.role === 'admin') {
      fields = await Field.find({ status: { $ne: 'inactive' } }).sort({ sortOrder: 1 });
    } else {
      // member: re-fetch user to get fieldAccess list
      const { User } = await import('./db/models.js');
      const user = await User.findById(req.user.id).populate('fieldAccess');
      fields = (user?.fieldAccess || []).filter(f => f.status !== 'inactive');
    }
    res.json(fields.map(f => f.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── CATCH-ALL (serve frontend) ────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀  Server running at http://localhost:${PORT}`);
  console.log(`📧  Admin: ${process.env.ADMIN_EMAIL || 'set in .env'}\n`);
});