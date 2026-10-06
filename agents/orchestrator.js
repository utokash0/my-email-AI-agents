import { createBrief }                     from './briefAgent.js';
import { runParallelResearch }              from './researchAgents.js';
import { synthesizeResearch }              from './synthesisAgent.js';
import { writeInitialCopy, writeFinalCopies } from './copywritingAgent.js';
import { evaluateCopy }                    from './copyQAAgent.js';
import { createDesign }                    from './designerAgent.js';
import { evaluateDesign }                  from './designQAAgent.js';

// ── MAIN WORKFLOW ─────────────────────────────────────────────────
export async function runWorkflow(input, campaignId, onProgress = () => {}) {
  const progress = async (step, status, message = '', data = null) => {
    await onProgress({ step, status, message, data });
  };

  try {
    // 1. BRIEF
    await progress('brief', 'running', 'Creating creative brief...');
    const brief = await createBrief(input);
    await progress('brief', 'done', '', brief);

    // 2. INITIAL COPY (before research — for comparison)
    await progress('initial_copy', 'running', 'Writing initial draft...');
    const initialCopy = await writeInitialCopy(brief);
    await progress('initial_copy', 'done', '', initialCopy);

    // 3. RESEARCH (3 parallel agents)
    await progress('research', 'running', 'Running 3 deep-research agents in parallel...');
    const research = await runParallelResearch(brief);
    await progress('research', 'done', '', research);

    // 4. SYNTHESIS
    await progress('synthesis', 'running', 'Synthesizing research...');
    const synthesis = await synthesizeResearch(brief, research);
    await progress('synthesis', 'done', '', synthesis);

    // 5. FINAL COPY WITH COMPARISON
    await progress('copy', 'running', 'Writing 5 final variations with research comparison...');
    const copyResult = await writeFinalCopies(brief, synthesis, initialCopy);
    await progress('copy', 'done', '', copyResult);

    // 6. COPY QA
    await progress('copyQA', 'running', 'Scoring and selecting top 2...');
    const evaluation = await evaluateCopy(copyResult.variations, brief);
    await progress('copyQA', 'done', '', evaluation);

    // 7. CHECKPOINT 1 — send to user
    const top2 = evaluation.top2.map(id => copyResult.variations.find(c => c.id === id));
    await progress('checkpoint1', 'waiting', 'Waiting for your copy review...', {
      initialCopy,
      comparison:  copyResult.comparison,
      top2,
      evaluation,
      brief,
      synthesis,
    });

  } catch (err) {
    await progress('error', 'error', err.message);
    throw err;
  }
}

// ── DESIGN PHASE ──────────────────────────────────────────────────
export async function runDesignPhase(brief, selectedCopy, onProgress = () => {}) {
  const progress = async (step, status, message = '', data = null) => {
    await onProgress({ step, status, message, data });
  };

  try {
    await progress('design', 'running', 'Creating email design...');
    const design = await createDesign(selectedCopy, brief);
    await progress('design', 'done', '', design);

    await progress('designQA', 'running', 'Running design quality check...');
    const designQA = await evaluateDesign(design.html, brief);
    await progress('designQA', 'done', '', designQA);

    await progress('checkpoint2', 'waiting', 'Design ready for your review.', { design, designQA });
  } catch (err) {
    await progress('error', 'error', err.message);
    throw err;
  }
}

// ── REVISION PHASE ────────────────────────────────────────────────
export async function runRevision(campaign, type, feedback, onProgress = () => {}) {
  const progress = async (step, status, message = '', data = null) => {
    await onProgress({ step, status, message, data });
  };

  const brief = campaign.brief_data;

  if (type === 'copy') {
    await progress('copy_revision', 'running', 'Re-writing copy with your feedback...');
    const { callAgent, parseJSON } = await import('../utils/claude.js');
    const result = await callAgent({
      systemPrompt: 'You are a world-class email copywriter. Apply the specific feedback to improve the copy.',
      userMessage: `Original copies: ${campaign.copies_data}
Feedback: ${feedback}
Brief: ${JSON.stringify(brief)}

Rewrite the top 2 variations applying the feedback exactly. Return same JSON structure as before with just 2 variations.`,
      maxTokens: 3000,
    });
    const copies     = parseJSON(result);
    const evaluation = await evaluateCopy(copies.variations || copies, brief);
    await progress('copy_revision', 'done', '', { copies: copies.variations || copies, evaluation });

  } else {
    await progress('design_revision', 'running', 'Updating design with your feedback...');
    const selectedCopy = campaign.selected_copy;
    const modifiedCopy = { ...selectedCopy, designFeedback: feedback };
    const design   = await createDesign(modifiedCopy, brief);
    const designQA = await evaluateDesign(design.html, brief);
    await progress('design_revision', 'done', '', { design, designQA });
  }
}