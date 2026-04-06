const fs = require('fs');
const path = require('path');

const QUEUE_DIR = path.join(__dirname, '../content-queue');
const files = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.json'));

function generateSlug(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 100);
}

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8'));
  const item = Array.isArray(data) ? data[0] : data;
  const name = item.name || item.title;
  const slug = item.slug || generateSlug(name);
  console.log(`[${file}] ${slug} | ${name.substring(0, 50)}`);
});
