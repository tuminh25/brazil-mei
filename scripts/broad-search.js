const fs = require('fs');
const files = fs.readdirSync('scripts');
for (const file of files) {
    if (file.endsWith('.txt') || file.endsWith('.json')) {
        const content = fs.readFileSync('scripts/' + file, 'utf8');
        if (content.toLowerCase().includes('it show')) {
            console.log(`FOUND "IT Show" in scripts/${file}`);
        }
        if (content.toLowerCase().includes('it-show')) {
            console.log(`FOUND "it-show" in scripts/${file}`);
        }
    }
}
