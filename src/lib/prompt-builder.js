// scripts/lib/prompt-builder.js
function buildPrompt(research) {
  const { topic, category, neighborhood, targetKeywords, keyDataPoints, sources } = research;
  return `You are an expert Singapore resident guide writer. Write a comprehensive HTML article based on the research data below.

REQUIREMENTS:
- Output ONLY a JSON object, no markdown, no code fences.
- The JSON must have exactly these fields:
  "title", "slug", "excerpt", "content", "category", "neighborhood", "tags", "insiderPrice", "bestTime", "secretTip", "metaTitle", "metaDescription", "tripUrl", "klookUrl"
- "content" must be valid HTML using ONLY the following tags: h2, h3, p, ul, ol, li, strong, em, a, blockquote, table (with thead, tbody, tr, th, td).
- Every paragraph (<p>) must start with the character "✦ " (diamond + space). Do not add extra diamond characters elsewhere.
- Include an FAQ section as a separate h2, each question as h3, answer as p.
- The article must be fact-based, with inline citations referencing the provided sources where appropriate.
- Use Singapore-specific context: mention MRT stations, HDB, CPF, SGD amounts, etc.
- "category" must be one of: HOUSING, TRANSPORT, MONEY, STUDY, HEALTHCARE, FOOD, WORK, LIFESTYLE, NEIGHBORHOOD, TOOLS, TRAVEL_GUIDE.
- "neighborhood" should be the given neighbourhood name (if any), else null.
- "insiderPrice", "bestTime", "secretTip" should contain practical, resident-first tips. At least one of them must be filled.
- "tripUrl" and "klookUrl" can be null, but if the topic has a relevant booking option, suggest a valid URL (leave null if none).
- Word count for the main content (excluding JSON metadata) should be between 1500 and 2500 words.
- Be factual; do not hallucinate numbers. Use the provided key data points and sources.

RESEARCH DATA:
Topic: ${topic}
Category: ${category}
Neighborhood: ${neighborhood || 'N/A'}
Target Keywords: ${Array.isArray(targetKeywords) ? targetKeywords.join(', ') : targetKeywords}
Key Data Points: ${JSON.stringify(keyDataPoints, null, 2)}
Sources (use for citations): ${Array.isArray(sources) ? sources.join('\n') : sources}`;
}

module.exports = { buildPrompt };