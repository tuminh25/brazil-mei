const XLSX = require('xlsx');
const w = XLSX.readFile('digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx');
console.log('MDW Sheets:', w.SheetNames);
for (const sn of w.SheetNames) {
  const ws = w.Sheets[sn];
  let formulas = [];
  for (const a of Object.keys(ws)) {
    const c = ws[a];
    if (c && c.f) formulas.push({addr: a, formula: c.f});
  }
  console.log(sn + ': ' + formulas.length + ' formulas');
  if (formulas.length > 0 && sn !== 'START HERE' && sn !== 'ACTION PLAN') {
    formulas.slice(0, 5).forEach(f => console.log('  ' + f.addr + ' = ' + f.formula));
  }
}