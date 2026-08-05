// scripts/lib/writers/openrouter.js
const { buildPrompt } = require('../prompt-builder');
const { parseAIJson } = require('../json-parser');

const SYSTEM_PROMPT = `You are an expert Singapore resident guide writer. You output ONLY valid JSON objects, no markdown, no code fences, no explanations.`;

async function generate(researchData) {
  // Read env vars at call time, not module load time
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
  const SITE_NAME = process.env.SITE_NAME || 'SG Events Hub';

  console.log('🔑 OPENROUTER_API_KEY loaded:', OPENROUTER_API_KEY ? `Yes (length ${OPENROUTER_API_KEY.length})` : 'NO');
  console.log('📝 Using model:', OPENROUTER_MODEL);

  if (!OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY not set');

  const userPrompt = buildPrompt(researchData);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;
  return parseAIJson(raw);
}

module.exports = { generate };
