const { buildPrompt } = require('../prompt-builder');
const { parseAIJson } = require('../json-parser');
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL || 'sonar-pro';

async function generate(researchData) {
  if (!PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY not set');
  const prompt = buildPrompt(researchData);

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: PERPLEXITY_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Perplexity API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;
  return parseAIJson(raw);
}

module.exports = { generate };