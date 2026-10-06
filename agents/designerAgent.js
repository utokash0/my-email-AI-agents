import { callAgent } from '../utils/claude.js';

const SYSTEM = `You are an expert email designer who writes clean MJML and HTML email code.
You create professional, mobile-responsive email designs that work in Klaviyo.
Your HTML must be self-contained, inline-styled, and render perfectly in all email clients.`;

export async function createDesign(selectedCopy, brief) {
  console.log('🎨 Designer Agent creating email design...');

  const result = await callAgent({
    systemPrompt: SYSTEM,
    userMessage: `Create a complete HTML email design for Klaviyo using this copy.

COPY TO USE:
Subject: ${selectedCopy.subjectLine}
Preview: ${selectedCopy.previewText}
Body: ${selectedCopy.body}
CTA: ${selectedCopy.cta}

BRAND INFO:
Brand: ${brief.brandName}
Tone: ${brief.tone}
Product: ${brief.productFocus}

DESIGN REQUIREMENTS:
- Max width: 600px (Klaviyo standard)
- Mobile responsive
- Inline CSS only (no style blocks — email clients strip them)
- Clean, modern e-commerce style
- Prominent CTA button (brand color — use #000000 as default if no color given)
- Header with brand name
- Footer with unsubscribe placeholder: {{unsubscribe_link}}
- Use Klaviyo merge tags where appropriate: {{ first_name|default:'there' }}

Return the complete HTML email code between these exact markers:
===HTML_START===
[complete HTML here]
===HTML_END===

Also return a brief design summary after the HTML.`,
    maxTokens: 4000
  });

  // Extract HTML between markers
  const htmlMatch = result.match(/===HTML_START===\n?([\s\S]*?)\n?===HTML_END===/);
  const html = htmlMatch ? htmlMatch[1].trim() : result;

  console.log('✅ Email design created');
  return { html, raw: result };
}