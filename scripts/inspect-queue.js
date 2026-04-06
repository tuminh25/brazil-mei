// Inspect all JSON files in content-queue to map their field structure
const fs = require('fs');
const path = require('path');

const QUEUE_DIR = path.join(__dirname, '../content-queue');
const files = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.json')).sort((a, b) => parseInt(a) - parseInt(b));

console.log(`Found ${files.length} files\n`);

for (const file of files) {
  const raw = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8');
  let data = JSON.parse(raw);
  if (Array.isArray(data)) data = data[0];

  const keys = Object.keys(data);
  const name = data.name || data.title || '(no title)';
  const slug = data.slug || '(no slug)';
  const imageUrl = data.imageUrl || '(none)';
  const hasPrice = keys.includes('price') || keys.includes('insiderPrice');
  const hasTiming = keys.includes('timing') || keys.includes('bestTime') || keys.includes('openingHours');
  const hasTips = keys.includes('tips') || keys.includes('secretTip') || keys.includes('aiSmartTips');
  const category = data.category || '(none)';
  const status = data.status || '(none)';

  console.log(`[${file}] "${name.substring(0, 60)}"`);
  console.log(`  slug: ${slug}`);
  console.log(`  category: "${category}" | status: "${status}"`);
  console.log(`  imageUrl: ${imageUrl.substring(0, 60)}...`);
  console.log(`  price fields: ${hasPrice} (keys: ${keys.filter(k => k.toLowerCase().includes('price')).join(', ') || 'none'})`);
  console.log(`  timing fields: ${hasTiming} (keys: ${keys.filter(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('timing') || k.toLowerCase().includes('opening') || k.toLowerCase().includes('hours')).join(', ') || 'none'})`);
  console.log(`  tips fields: ${hasTips} (keys: ${keys.filter(k => k.toLowerCase().includes('tip') || k.toLowerCase().includes('smart') || k.toLowerCase().includes('hack')).join(', ') || 'none'})`);
  console.log(`  ALL KEYS: [${keys.join(', ')}]`);
  console.log();
}
