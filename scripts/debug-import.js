const fs = require('fs');

let rawContent = fs.readFileSync('scripts/new_events.txt', 'utf8').replace(/^\uFEFF/, '');
console.log('File length:', rawContent.length);

// Show first 500 chars plainly
console.log('\n--- First 500 chars ---');
console.log(rawContent.substring(0, 500));

// Check what the split produces
const rawEvents = rawContent.split(/===.*===/);
console.log('\n--- Number of blocks:', rawEvents.length);
for (let i = 0; i < rawEvents.length; i++) {
    console.log(`\nBlock[${i}] (length: ${rawEvents[i].length}):`);
    console.log(rawEvents[i].substring(0, 300));
}
