import { callAgent, parseJSON } from '../utils/claude.js';

const SYSTEM = `You are a research synthesis specialist for an email marketing agency.
You receive 3 separate research reports and merge them into one master insight document.
Your job: validate the research, remove contradictions, identify the strongest angles.
Return a JSON object — no extra text.`;

export async function synthesizeResearch(brief, research) {
  console.log('🔀 Synthesis Agent merging research...');

  const result = await callAgent({
    systemPrompt: SYSTEM,
    userMessage: `Synthesize this research into a master brief for the Copywriting Agent.

CREATIVE BRIEF:
${JSON.stringify(brief, null, 2)}

AUDIENCE RESEARCH:
${research.audience.data}

COMPETITOR RESEARCH:
${research.competitor.data}

TREND RESEARCH:
${research.trends.data}

Return JSON:
{
  "topAudiencePainPoints": ["string", "string", "string"],
  "primaryPurchaseTrigger": "string",
  "strongestAngle": "string (the best hook/angle for this email)",
  "competitorGaps": "string (what no one else is saying that we can own)",
  "recommendedTone": "string",
  "powerWords": ["string", "string", "string"],
  "socialProofToMention": "string",
  "urgencyTactic": "string",
  "uniqueHook": "string (one sentence that makes this email different from all competitors)",
  "subjectLineDirection": "string (guidance for writing the subject line)",
  "researchSummary": "string (2-3 sentences summarizing key insight)"
}`,
    maxTokens: 1500
  });

  const synthesis = parseJSON(result);
  console.log('✅ Research synthesized. Strongest angle:', synthesis.strongestAngle);
  return synthesis;
}