const XLSX = require('xlsx');
const w = XLSX.readFile('digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx');
const ws = w.Sheets["COST CALCULATOR"];
console.log("COST CALCULATOR all formula cells:");
for (const a of Object.keys(ws)) {
  const c = ws[a];
  if (c && c.f) {
    console.log('  ' + a + ' = ' + c.f);
  }
}