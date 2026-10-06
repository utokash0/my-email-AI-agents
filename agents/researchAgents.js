import { callResearchAgent } from '../utils/claude.js';

// ── US AUDIENCE AGENT ─────────────────────────────────────────────
async function runAudienceResearch(brief) {
  console.log('🔍 US Audience Agent — deep research starting...');
  const result = await callResearchAgent({
    systemPrompt: `You are a deep-dive US consumer psychology researcher.
You search EXTENSIVELY across many sources to understand real buyers.
Search at minimum 8-12 different queries covering:
- Reddit communities (r/[niche], r/femalefashionadvice, r/SkincareAddiction, etc.)
- Amazon product reviews for competing products (look for verified purchase reviews)
- Quora discussions about the problem this product solves
- Facebook group discussions
- TikTok/YouTube comments on related content
- Trustpilot and review sites
- Forum discussions on niche-specific communities

EXTRACT: The EXACT WORDS real customers use. Not summaries — actual phrases, complaints, desires, and slang.
Your output must include verbatim-style language that real US buyers use, not polished marketing copy.`,

    userMessage: `Deep-dive research on US buyers for:
Brand: ${brief.brandName}
Product: ${brief.productFocus}
Audience: ${brief.targetAudience}
Email type: ${brief.emailType}

Search in this order (run ALL of these, not just some):
1. Reddit: "${brief.productFocus} review reddit" — find real buyer discussions
2. Reddit: "${brief.targetAudience} [problem this product solves]" — find the pain
3. Amazon reviews: search for top competitor products in this category
4. Quora: "best [product category] for [audience]"
5. YouTube: "[product type] honest review" — read top comments
6. Facebook groups: "[niche] community" discussions about this problem
7. TikTok/Instagram: "[product type]" trending content comments
8. Trustpilot/G2: competitor product reviews
9. Reddit: "[niche] recommendations" threads
10. Google: "[audience] problems with [product category]" forums
11. Pinterest: "[product type] before after" to see what appeals visually
12. "[brand name] review" to see what real customers say about THIS brand

Return a structured report with:
1. TOP 5 PAIN POINTS (with actual customer quotes/phrases)
2. TOP 3 PURCHASE TRIGGERS (what made them finally buy)
3. REAL CUSTOMER LANGUAGE (exact words they use — 15-20 phrases)
4. TOP OBJECTIONS (what stops them buying — with real quotes)
5. WHO IS THIS PERSON (specific demographics, lifestyle, values)
6. WHAT THEY COMPARE (what other options they consider)
7. EMOTIONAL DRIVERS (the deep desire underneath the product)
8. TRUST SIGNALS that matter most to this audience`,
    maxTokens: 5000,
  });

  return { type: 'audience', data: result };
}

// ── COMPETITOR AGENT ──────────────────────────────────────────────
async function runCompetitorResearch(brief) {
  console.log('🔍 Competitor Agent — deep research starting...');
  const result = await callResearchAgent({
    systemPrompt: `You are a competitive intelligence specialist for email marketing.
You search deeply across paid ads, email examples, and marketing campaigns.
Search at minimum 8-10 different sources.
You extract WORKING STRATEGIES — not what competitors say about themselves, but what customers respond to.`,

    userMessage: `Deep competitive research for:
Brand: ${brief.brandName}
Product: ${brief.productFocus}
Website: ${brief.websiteUrl || 'search for this brand'}

Search ALL of these:
1. Facebook Ad Library: search "[competitor brand name]" ads — what angles are they running?
2. Google: "[product category] email examples site:reallygoodemails.com"
3. Google: "[niche] email marketing examples best"
4. Google: "[competitor brand] email" — find any published email campaigns
5. Twitter/X: "[product category]" + "email" — brand announcements
6. LinkedIn: "[brand name]" — press releases and campaign announcements
7. Milled.com: "[brand name] email" — real email archive
8. Google: "[niche] Black Friday email examples"
9. Google: "[niche] welcome email examples"
10. Reddit: "[brand name]" — what do customers say about their marketing?

Report must include:
1. TOP COMPETITOR EMAIL ANGLES (what hooks they use most)
2. OFFERS THAT ARE WORKING (discounts, free shipping, bundles, guarantees)
3. SUBJECT LINE PATTERNS (what formulas competitors repeat = they work)
4. POSITIONING GAPS (what no one is saying that creates an opening)
5. VISUAL PATTERNS (color schemes, layout styles that dominate this niche)
6. CTA PATTERNS (button copy, urgency phrases)
7. SOCIAL PROOF TYPES (reviews, UGC, press, certifications they feature)
8. BEST OPPORTUNITY (the ONE angle no competitor owns yet)`,
    maxTokens: 5000,
  });

  return { type: 'competitor', data: result };
}

// ── TREND AGENT ───────────────────────────────────────────────────
async function runTrendResearch(brief) {
  console.log('🔍 Trend Agent — deep research starting...');
  const result = await callResearchAgent({
    systemPrompt: `You are a US e-commerce trend analyst and cultural intelligence researcher.
You track what is working RIGHT NOW — viral content, cultural moments, trending formats.
Search across 8-10 sources minimum, focusing on recent content (last 3-6 months).`,

    userMessage: `Trend and cultural intelligence research for:
Product: ${brief.productFocus}
Audience: ${brief.targetAudience}
Campaign goal: ${brief.campaignGoal}
Urgency: ${brief.urgency}

Search ALL of these:
1. TikTok (via Google): "site:tiktok.com [product type]" — what formats are going viral?
2. Google Trends: "[product category]" — is interest rising or falling?
3. Pinterest Trends: "[niche]" — what visual trends are up?
4. Reddit r/[niche]: "trending" and "rising" posts this month
5. Instagram (via Google): "[product type] site:instagram.com" viral posts
6. BuzzSumo or similar: most shared content in "[niche]" past 3 months
7. Google: "[niche] trends 2025 2026" — industry reports
8. YouTube trending: "[product category] reviews" latest videos
9. Twitter/X trending: "[product type]" discussions
10. Klaviyo blog and email marketing industry: email trends 2025 2026

Report must include:
1. TOP TRENDING HOOKS in this niche right now (with examples)
2. CULTURAL MOMENTS that connect (holidays, events, viral moments)
3. CONTENT FORMATS getting most engagement (listicles, stories, before/after)
4. POWER WORDS trending in this space (what language is hot right now)
5. SEASONAL ANGLE (what's relevant for the current time of year)
6. VIRAL FORMULA (the content structure getting most shares in this niche)
7. AUDIENCE MOOD RIGHT NOW (what is US [audience] feeling/worried about)
8. ONE TREND no one in email has used yet for this product type`,
    maxTokens: 5000,
  });

  return { type: 'trends', data: result };
}

// ── RUN ALL 3 IN PARALLEL ─────────────────────────────────────────
export async function runParallelResearch(brief) {
  console.log('\n⚡ Running 3 deep-research agents in parallel...\n');
  const [audience, competitor, trends] = await Promise.all([
    runAudienceResearch(brief),
    runCompetitorResearch(brief),
    runTrendResearch(brief),
  ]);
  console.log('\n✅ All 3 research agents complete.\n');
  return { audience, competitor, trends };
}