import { callAgent, parseJSON } from '../utils/claude.js';

const SYSTEM = `You are a creative brief specialist for a US e-commerce email marketing agency.
Convert raw client input into a structured creative brief.
Return ONLY a JSON object — no extra text, no markdown.

JSON structure:
{
  "brandName": "string",
  "websiteUrl": "string",
  "productFocus": "string",
  "campaignGoal": "string",
  "emailType": "promotional | welcome | abandoned_cart | winback | announcement",
  "targetAudience": "string (US audience description)",
  "keyBenefit": "string (the #1 thing this email should communicate)",
  "tone": "string",
  "urgency": "high | medium | low",
  "offer": "string (discount, free shipping, bonus, etc)",
  "callToAction": "string",
  "constraints": "string (brand rules, things to avoid)",
  "metaAdsInsights": "string (key angles from winning Meta ads if provided)",
  "additionalContext": "string"
}`;

export async function createBrief(input) {
  console.log('📋 Brief Agent running...');

  const result = await callAgent({
    systemPrompt: SYSTEM,
    userMessage: `Create a creative brief from this input:\n\n${JSON.stringify(input, null, 2)}`,
    maxTokens: 1000
  });

  const brief = parseJSON(result);
  console.log('✅ Brief created:', brief.brandName);
  return brief;
}