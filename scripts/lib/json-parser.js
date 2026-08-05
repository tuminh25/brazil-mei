// scripts/lib/json-parser.js
function parseAIJson(raw) {
  let text = raw.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in AI response');
  text = text.substring(start, end + 1);
  // Xử lý trailing commas
  text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  return JSON.parse(text);
}

module.exports = { parseAIJson };