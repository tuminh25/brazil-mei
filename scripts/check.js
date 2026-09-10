const XLSX = require('xlsx');
const w = XLSX.readFile('digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx');
const ws = w.Sheets['COST CALCULATOR'];
let crossSheet = 0;
for (const a of Object.keys(ws)) { const cell=ws[a]; if (cell=a[1] && cell.f) { const f=cell.f; if(f.includes("\${IN}'")||f.includes("COST CALCULATOR")||f.includes("MONTHLY YEARLY TCO")) { crossSheet++; } } }
console.log('MDW cross-sheet formula cells in COST CALCULATOR: ' + crossSheet);

const ws2 = w.Sheets['MONTHLY YEARLY TCO'];
let crossSheet2 = 0;
for (const a of Object.keys(ws2)) { const cell=ws2[a]; if (cell && cell.f) { const f=cell.f; if(f.includes("\${IN}'")||f.includes("COST CALCULATOR")||f.includes("MONTHLY YEARLY TCO")) { crossSheet2++; } } }
console.log('MDW MONTHLY YEARLY TCO cross-sheet formula cells: ' + crossSheet2);