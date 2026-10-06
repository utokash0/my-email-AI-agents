import { callAgent, parseJSON } from '../utils/claude.js';

const SYSTEM = `You are a senior email marketing strategist and copy editor.
You evaluate email copy with a critical eye — your job is to pick what will actually convert.
Score ruthlessly. Be specific about what to improve.`;

export async function evaluateCopy(variations, brief) {
  console.log('⭐ Copy QA Agent scoring variations...');

  const result = await callAgent({
    systemPrompt: SYSTEM,
    userMessage: `Evaluate these ${variations.length} email copy variations and pick the top 2.

CAMPAIGN BRIEF:
Brand: ${brief.brandName}
Goal: ${brief.campaignGoal}
Email Type: ${brief.emailType}
Target: ${brief.targetAudience}

COPY VARIATIONS:
${JSON.stringify(variations, null, 2)}

Score each on (1-10):
- Subject line open rate potential
- First line hook strength
- Clarity of value proposition
- CTA effectiveness
- Brand tone match
- US audience resonance

Return JSON:
{
  "scores": [
    {
      "id": number,
      "totalScore": number,
      "subjectScore": number,
      "hookScore": number,
      "clarityScore": number,
      "ctaScore": number,
      "strengths": "string",
      "improvements": "string"
    }
  ],
  "top2": [number, number],
  "recommendation": "string (which to use and why)",
  "winnerReason": "string"
}`,
    maxTokens: 2000
  });

  const evaluation = parseJSON(result);
  console.log('✅ Top 2 copies selected:', evaluation.top2);
  return evaluation;
}