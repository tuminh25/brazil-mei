const fs = require('fs');
const content = fs.readFileSync('scripts/db_events_list.txt', 'utf16le');
if (content.toLowerCase().includes('paw-patrol')) {
    console.log('PAW Patrol found in db_events_list.txt');
} else {
    console.log('PAW Patrol NOT found in db_events_list.txt');
}
if (content.toLowerCase().includes('it-show')) {
    console.log('IT Show found in db_events_list.txt');
} else {
    console.log('IT Show NOT found in db_events_list.txt');
}
