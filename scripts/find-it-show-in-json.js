const fs = require('fs');
const content = fs.readFileSync('scripts/new_guides.json', 'utf8');
const index = content.toLowerCase().indexOf('it-show');
if (index !== -1) {
    console.log(`Found it-show at index ${index}`);
    console.log('Context:', content.substring(index - 100, index + 100));
} else {
    console.log('it-show NOT found in new_guides.json');
}
