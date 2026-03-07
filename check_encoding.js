const fs = require('fs');
const path = 'scripts/new_events.txt';
if (fs.existsSync(path)) {
    console.log('--- UTF-8 ---');
    console.log(fs.readFileSync(path, 'utf8').substring(0, 500));
    console.log('\n--- UTF-16LE ---');
    try {
        console.log(fs.readFileSync(path, 'utf16le').substring(0, 500));
    } catch (e) {
        console.log('UTF-16LE read failed');
    }
} else {
    console.log('File not found at ' + path);
}
