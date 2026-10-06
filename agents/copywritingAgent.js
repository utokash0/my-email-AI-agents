import { callAgent, parseJSON } from '../utils/claude.js';
import { loadKnowledge }        from '../utils/knowledge.js';

const BASE_SYSTEM = `You are a world-class email copywriter for US e-commerce.
You write copy that converts — short sentences, human tone, one big idea per email.
Always: benefits over features, specific social proof, one CTA.
Never: corporate speak, fake urgency, jargon, or openings that start with "We" or "My name is".`;

// ── STEP 1: INITIAL DRAFT (brief only — no research yet) ──────────
export async function writeInitialCopy(brief) {
  console.log('✍️  Writing initial draft (pre-research)...');
  const knowledge = loadKnowledge('copywriting');

  const result = await callAgent({
    systemPrompt: BASE_SYSTEM + (knowledge ? `\n\nCOPYWRITING PRINCIPLES:\n${knowledge}` : ''),
    userMessage: `Write ONE email based only on this brief. No research — just your instincts.

BRIEF:
${JSON.stringify(brief, null, 2)}

Write a single complete email variation:
- Subject line
- Preview text (under 90 chars)
- Full email body
- CTA button text

Return JSON:
{
  "subjectLine":   "string",
  "previewText":   "string",
  "body":          "string",
  "cta":           "string",
  "angle":         "instinct-based initial draft"
}`,
    maxTokens: 1500,
  });

  return parseJSON(result);
}

// ── STEP 2: COMPARE + WRITE 5 FINAL VARIATIONS ───────────────────
export async function writeFinalCopies(brief, synthesis, initialCopy) {
  console.log('✍️  Writing 5 final variations with research comparison...');
  const knowledge  = loadKnowledge('copywriting');
  const swipeFile  = loadKnowledge('swipeFile');
  const designKnow = loadKnowledge('design');

  const result = await callAgent({
    systemPrompt: BASE_SYSTEM + (knowledge ? `\n\nCOPYWRITING PRINCIPLES:\n${knowledge}` : ''),
    userMessage: `You wrote an initial draft BEFORE seeing the research.
Now you have full research. Compare, learn, and write 5 better variations.

INITIAL DRAFT (written before research):
${JSON.stringify(initialCopy, null, 2)}

CREATIVE BRIEF:
${JSON.stringify(brief, null, 2)}

RESEARCH SYNTHESIS (deep customer + market intelligence):
${JSON.stringify(synthesis, null, 2)}

${swipeFile ? `SWIPE FILE REFERENCE:\n${swipeFile.slice(0, 3000)}` : ''}

TASK:
1. First, compare: what did the initial draft get wrong or miss based on the research?
2. Then, write 5 final email variations using research insights — each with a DIFFERENT angle:
   - Angle 1: Pain-led (lead with the research-validated pain point)
   - Angle 2: Benefit-led (lead with the transformation customers want)
   - Angle 3: Social proof-led (use specific credibility signals from research)
   - Angle 4: Urgency/scarcity-led (use the real purchase triggers found)
   - Angle 5: Curiosity/story-led (use real customer language from research)

Use the EXACT CUSTOMER LANGUAGE found in research. Real words people use.

Return JSON:
{
  "comparison": {
    "whatInitialMissed":  "string — what the first draft got wrong",
    "keyResearchInsight": "string — the biggest finding that changes the copy",
    "languageUpgrades":   "string — specific words from research to use"
  },
  "variations": [
    {
      "id":          1,
      "angle":       "string",
      "subjectLine": "string (under 9 words)",
      "previewText": "string (under 90 chars)",
      "body":        "string (full email body, line breaks as \\n)",
      "cta":         "string (verb + outcome)",
      "whyItWorks":  "string (1 sentence — what research fact powers this)"
    }
  ]
}`,
    maxTokens: 5000,
  });

  return parseJSON(result);
}