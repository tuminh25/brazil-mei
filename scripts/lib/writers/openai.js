const { buildPrompt } = require('../prompt-builder');
const { parseAIJson } = require('../json-parser');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

async function generate(researchData) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  const prompt = buildPrompt(researchData);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;
  return parseAIJson(raw);
}

module.exports = { generate };