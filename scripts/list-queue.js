const fs = require('fs');
const path = require('path');

const dir = 'content-queue';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.json')) {
        const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        console.log(`${file}: [${content.slug}] ${content.name}`);
    }
});
