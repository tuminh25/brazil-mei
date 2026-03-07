const fs = require('fs');
const content = fs.readFileSync('scripts/db_events_list.txt', 'utf16le');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('it show')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
