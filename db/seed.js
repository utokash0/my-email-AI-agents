// Run ONCE to set up your database:
//   node db/seed.js

import '../db/connection.js';
import { User, Field } from './models.js';
import bcrypt           from 'bcryptjs';
import dotenv           from 'dotenv';
dotenv.config();

// ── DEFAULT FIELDS ─────────────────────────────────────────────────
const defaultFields = [
  {
    name:        'Email Marketing',
    slug:        'email-marketing',
    description: 'Research, write, and design Klaviyo email campaigns for US e-commerce brands',
    icon:        '✉️',
    color:       '#7c3aed',
    status:      'active',
    sortOrder:   1,
  },
  {
    name:        'Website Design',
    slug:        'website-design',
    description: 'Design and build high-converting websites for e-commerce brands',
    icon:        '🌐',
    color:       '#2563eb',
    status:      'coming_soon',
    sortOrder:   2,
  },
];

// ── SEED ───────────────────────────────────────────────────────────
async function seed() {
  try {
    // Create fields (skip if already exist)
    for (const f of defaultFields) {
      const exists = await Field.findOne({ slug: f.slug });
      if (!exists) {
        await Field.create(f);
        console.log(`✅ Field created: ${f.name}`);
      } else {
        console.log(`ℹ️  Field exists: ${f.name}`);
      }
    }

    // Create admin user (skip if already exists)
    const email    = process.env.ADMIN_EMAIL    || 'admin@youragency.com';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';
    const name     = process.env.ADMIN_NAME     || 'Admin';

    const exists = await User.findOne({ email });
    if (!exists) {
      const hashed = await bcrypt.hash(password, 12);
      await User.create({ name, email, password: hashed, role: 'admin' });
      console.log('\n✅ Admin created!');
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}`);
      console.log('\n⚠️  Change your password after first login.\n');
    } else {
      console.log(`ℹ️  Admin already exists: ${email}`);
    }

  } catch (err) {
    console.error('Seed error:', err.message);
  }
  process.exit(0);
}

seed();