const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, '../scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js'));

console.log('Scripts missing prisma.$disconnect():');
files.forEach(file => {
  const content = fs.readFileSync(path.join(scriptsDir, file), 'utf8');
  if (!content.includes('prisma.$disconnect')) {
    console.log(`- ${file}`);
  }
});
