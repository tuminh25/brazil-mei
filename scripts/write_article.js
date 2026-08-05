// scripts/write_article.js
require('dotenv').config();
const { generateArticle } = require('./lib/writer-provider');
const { importResearch } = require('./research_import');

/**
 * Takes a research file path and returns the generated article JSON.
 */
async function writeArticle(researchFilePath) {
  const researchData = importResearch(researchFilePath);
  console.log(`🧠 Generating article for: ${researchData.topic}`);
  const article = await generateArticle(researchData);
  // Basic validation of output fields
  const required = ['title', 'slug', 'content', 'category'];
  for (const f of required) {
    if (!article[f]) throw new Error(`Generated article missing field: ${f}`);
  }
  return article;
}

// CLI usage
if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node write_article.js <research.json>');
    process.exit(1);
  }
  writeArticle(file)
    .then(article => {
      console.log(JSON.stringify(article, null, 2));
    })
    .catch(e => {
      console.error('❌', e.message);
      process.exit(1);
    });
}

module.exports = { writeArticle };