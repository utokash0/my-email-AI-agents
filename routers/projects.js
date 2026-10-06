import express from 'express';
import { Project, Campaign } from '../db/models.js';
import { requireAuth }       from '../middleware/auth.js';

const router = express.Router();

// GET all projects for a field (with optional search)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { field_id, search } = req.query;
    if (!field_id) return res.status(400).json({ error: 'field_id required' });

    const query = { field: field_id };
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 });

    // Get campaign counts for each project
    const result = await Promise.all(projects.map(async (p) => {
      const count = await Campaign.countDocuments({ project: p._id });
      return { ...p.toJSON(), campaign_count: count, creator_name: p.createdBy?.name };
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single project with campaign history
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const campaigns = await Campaign.find({ project: req.params.id })
      .select('name status createdAt updatedAt inputData')
      .sort({ createdAt: -1 });

    const camps = campaigns.map(c => ({
      ...c.toJSON(),
      product_focus: c.inputData?.productFocus || c.name,
    }));

    res.json({ ...project.toJSON(), campaigns: camps, campaign_count: camps.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create project
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, brand, niche, goals, field_id } = req.body;
    if (!name || !brand || !field_id) return res.status(400).json({ error: 'name, brand, field_id required' });

    const project = await Project.create({
      name, brand,
      niche:     niche  || '',
      goals:     goals  || '',
      field:     field_id,
      createdBy: req.user.id,
    });

    res.json({ ...project.toJSON(), campaign_count: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Campaign.deleteMany({ project: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;