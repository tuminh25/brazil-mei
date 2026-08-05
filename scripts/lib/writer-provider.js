// scripts/lib/writer-provider.js
require('dotenv').config();
const { parseAIJson } = require('./json-parser');
const { buildPrompt } = require('./prompt-builder');

const PROVIDERS = {
  openrouter: './writers/openrouter',
  gemini: './writers/gemini',
  deepseek: './writers/deepseek',
  claude: './writers/claude',
  openai: './writers/openai',
  perplexity: './writers/perplexity',
};

async function generateArticle(researchData) {
  const provider = process.env.WRITER_PROVIDER || 'openrouter';
  const modulePath = PROVIDERS[provider];
  if (!modulePath) throw new Error(`Unknown WRITER_PROVIDER: ${provider}`);

  const writer = require(modulePath);
  return writer.generate(researchData);
}

module.exports = { generateArticle };