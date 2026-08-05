const { buildPrompt } = require('../prompt-builder');
const { parseAIJson } = require('../json-parser');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

async function generate(researchData) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const prompt = buildPrompt(researchData);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4000 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const raw = data.candidates[0].content.parts[0].text;
  return parseAIJson(raw);
}

module.exports = { generate };