// scripts/lib/writer-provider.js
require('dotenv').config();

const PROVIDERS = {
  openrouter: './writers/openrouter',
  gemini: './writers/gemini',
  deepseek: './writers/deepseek',
  claude: './writers/claude',
  openai: './writers/openai',
  perplexity: './writers/perplexity',
};

/**
 * Generates a full article JSON from a research data object.
 * @param {object} researchData – normalised research object
 * @returns {Promise<object>} article data matching Post fields
 */
async function generateArticle(researchData) {
  const provider = process.env.WRITER_PROVIDER || 'openrouter';
  const modulePath = PROVIDERS[provider];
  if (!modulePath) {
    throw new Error(`Unknown WRITER_PROVIDER: ${provider}`);
  }
  const writer = require(modulePath);
  return writer.generate(researchData);
}

module.exports = { generateArticle };