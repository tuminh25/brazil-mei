// scripts/research_import.js
require('dotenv').config();
const fs = require('fs');

function validateCategory(cat) {
  const valid = ['HOUSING', 'TRANSPORT', 'MONEY', 'STUDY', 'HEALTHCARE', 'FOOD', 'WORK', 'LIFESTYLE', 'NEIGHBORHOOD', 'TOOLS', 'TRAVEL_GUIDE'];
  if (!valid.includes(cat)) throw new Error(`Invalid category: ${cat}. Must be one of ${valid.join(', ')}`);
  return cat;
}

/**
 * Reads and validates a Perplexity research report JSON.
 * @param {string} filePath
 * @returns {object} normalised research data
 */
function importResearch(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Research file not found: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  const { topic, category, neighborhood, targetKeywords, keyDataPoints, sources } = data;
  if (!topic || !category) throw new Error('Missing required fields: topic, category');

  return {
    topic,
    category: validateCategory(category.toUpperCase()),
    neighborhood: neighborhood || null,
    targetKeywords: targetKeywords || [],
    keyDataPoints: keyDataPoints || {},
    sources: sources || [],
  };
}

// If run directly (for testing)
if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node research_import.js <research.json>');
    process.exit(1);
  }
  try {
    const research = importResearch(file);
    console.log(JSON.stringify(research, null, 2));
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}

module.exports = { importResearch };