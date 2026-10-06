import express from 'express';
import { Campaign, Revision }                     from '../db/models.js';
import { requireAuth }                            from '../middleware/auth.js';
import { runWorkflow, runDesignPhase, runRevision } from '../agents/orchestrator.js';

const router = express.Router();

// GET single campaign
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const camp = await Campaign.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: 'Campaign not found' });
    res.json(camp.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST run full copy workflow (SSE)
router.post('/run', requireAuth, async (req, res) => {
  const { project_id, input } = req.body;
  if (!project_id || !input) return res.status(400).json({ error: 'project_id and input required' });

  // Create campaign record
  const campaign = await Campaign.create({
    project:   project_id,
    name:      input.productFocus || 'New Campaign',
    inputData: input,
    status:    'running',
  });
  const campaignId = campaign._id.toString();

  // SSE setup
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify({ campaignId, ...data })}\n\n`);

  const save = (field, value) =>
    Campaign.findByIdAndUpdate(campaignId, { [field]: value });

  try {
    await runWorkflow(input, campaignId, async (progress) => {
      send(progress);
      const { step, status, data } = progress;

      if (status === 'done' && data) {
        const map = {
          brief:    'briefData',
          research: 'researchData',
          synthesis:'synthesisData',
          copy:     'copiesData',
          copyQA:   'copyEvaluation',
          design:   'designData',
          designQA: 'designQA',
        };
        if (map[step]) await save(map[step], data);
      }

      if (step === 'checkpoint1') {
        await Campaign.findByIdAndUpdate(campaignId, {
          status:         'checkpoint1',
          initialCopy:    data?.initialCopy,
          copiesData:     data?.top2,
          copyEvaluation: data?.evaluation,
        });
      }
    });

    send({ step: 'stream_complete', status: 'done' });
  } catch (err) {
    await Campaign.findByIdAndUpdate(campaignId, { status: 'error', errorMessage: err.message });
    send({ step: 'error', status: 'error', message: err.message });
  }
  res.end();
});

// POST run design phase (SSE)
router.post('/design', requireAuth, async (req, res) => {
  const { campaign_id, brief, selected_copy } = req.body;
  if (!campaign_id) return res.status(400).json({ error: 'campaign_id required' });

  await Campaign.findByIdAndUpdate(campaign_id, {
    selectedCopy: selected_copy,
    status:       'designing',
  });

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify({ campaign_id, ...data })}\n\n`);

  try {
    await runDesignPhase(brief, selected_copy, async (progress) => {
      send(progress);
      const { step, status, data } = progress;
      if (status === 'done' && data) {
        if (step === 'design')   await Campaign.findByIdAndUpdate(campaign_id, { designData: data });
        if (step === 'designQA') await Campaign.findByIdAndUpdate(campaign_id, { designQA:   data });
      }
      if (step === 'checkpoint2') {
        await Campaign.findByIdAndUpdate(campaign_id, { status: 'checkpoint2' });
      }
    });
    send({ step: 'stream_complete', status: 'done' });
  } catch (err) {
    send({ step: 'error', status: 'error', message: err.message });
  }
  res.end();
});

// POST approve and save final HTML
router.post('/:id/approve', requireAuth, async (req, res) => {
  try {
    const { html } = req.body;
    await Campaign.findByIdAndUpdate(req.params.id, {
      finalHtml: html,
      status:    'complete',
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST request revision (SSE)
router.post('/:id/revision', requireAuth, async (req, res) => {
  const { type, feedback } = req.body;
  const campaignId = req.params.id;

  const camp = await Campaign.findById(campaignId);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });

  // Log revision
  await Revision.create({
    campaign:     campaignId,
    type,
    feedback,
    previousData: type === 'copy' ? camp.copiesData : camp.designData,
  });

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    await runRevision(camp.toJSON(), type, feedback, async (progress) => {
      send(progress);
      if (progress.status === 'done' && progress.data) {
        if (type === 'copy') {
          await Campaign.findByIdAndUpdate(campaignId, {
            copiesData:     progress.data.copies,
            copyEvaluation: progress.data.evaluation,
            status:         'checkpoint1',
          });
        } else {
          await Campaign.findByIdAndUpdate(campaignId, {
            designData: progress.data.design,
            designQA:   progress.data.designQA,
            status:     'checkpoint2',
          });
        }
      }
    });
    send({ step: 'revision_complete', status: 'done' });
  } catch (err) {
    send({ step: 'error', status: 'error', message: err.message });
  }
  res.end();
});

export default router;