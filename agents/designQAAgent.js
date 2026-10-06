import { callAgent, parseJSON } from '../utils/claude.js';

const SYSTEM = `You are an email deliverability and design QA specialist.
You review HTML email code and flag every issue before it goes to a client.
Be thorough — a missed issue costs a client campaign performance.`;

export async function evaluateDesign(html, brief) {
  console.log('🔍 Design QA Agent checking design...');

  const result = await callAgent({
    systemPrompt: SYSTEM,
    userMessage: `Review this HTML email design for quality and deliverability.

BRAND: ${brief.brandName}
PRODUCT: ${brief.productFocus}
CAMPAIGN GOAL: ${brief.campaignGoal}

HTML EMAIL:
${html.substring(0, 8000)}

Check for:
1. Mobile responsiveness (max-width, media queries or table-based layout)
2. CTA button visibility and prominence
3. Inline CSS only (no style blocks)
4. Unsubscribe link present ({{unsubscribe_link}})
5. Klaviyo merge tags used correctly
6. Subject line matches email content
7. Spam trigger words in copy
8. Image alt text (if any images referenced)
9. Brand consistency
10. Overall conversion potential

Return JSON:
{
  "overallScore": number (1-10),
  "approved": boolean,
  "issues": ["string", "string"],
  "warnings": ["string"],
  "positives": ["string"],
  "spamRisk": "low | medium | high",
  "mobileReady": boolean,
  "klaviyoReady": boolean,
  "fixesRequired": ["string"],
  "summary": "string"
}`,
    maxTokens: 1500
  });

  const qa = parseJSON(result);
  console.log(`✅ Design QA done. Score: ${qa.overallScore}/10. Approved: ${qa.approved}`);
  return qa;
}