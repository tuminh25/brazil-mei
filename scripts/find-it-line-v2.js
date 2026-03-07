const fs = require('fs');
const content = fs.readFileSync('scripts/new_guides.json', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('it-show')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
