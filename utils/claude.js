import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new Anthropic();

// Standard agent call — for most agents
export async function callAgent({ systemPrompt, userMessage, model = 'claude-sonnet-4-6', maxTokens = 3000 }) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  });
  return response.content[0].text;
}

// Research agent call — has web search built in
export async function callResearchAgent({ systemPrompt, userMessage, maxTokens = 4000 }) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    tools: [{ type: 'web_search_20250305', name: 'web_search' }]
  });

  // Web search returns multiple content blocks — join the text ones
  return response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');
}

// Parse JSON safely from agent output
export function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
    if (match) return JSON.parse(match[1]);
    throw new Error('Agent did not return valid JSON');
  }
}