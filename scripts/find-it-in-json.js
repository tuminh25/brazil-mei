const fs = require('fs');
const content = fs.readFileSync('content-queue/1.json', 'utf8');
const index = content.toLowerCase().indexOf('it show');
if (index !== -1) {
    console.log(`Found IT Show at index ${index}`);
    console.log('Context:', content.substring(index - 50, index + 50));
} else {
    console.log('IT Show not found in 1.json');
}
