const fs = require('fs');
const path = 'scripts/db_events_list.txt';
if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf16le');
    console.log(content);
} else {
    console.log('File not found');
}
