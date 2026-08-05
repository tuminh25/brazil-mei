#!/usr/bin/env node
require('dotenv').config();
const { writeArticle } = require('./write_article');
const { publishArticle } = require('./publish_article');

async function runPipeline(researchFilePath) {
  console.log(`🚀 Starting pipeline for: ${researchFilePath}`);
  // Step 1 & 2: research already validated inside writeArticle
  const article = await writeArticle(researchFilePath);
  // Step 3: publish
  await publishArticle(article);
  console.log('🎉 Pipeline complete');
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node run_pipeline.js <research.json>');
  process.exit(1);
}

runPipeline(file)
  .catch(e => {
    console.error('💥 Pipeline failed:', e.message);
    process.exit(1);
  });