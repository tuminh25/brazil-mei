const XLSX = require('xlsx');
const files = [
  'digital-products/pr-readiness-audit/singapore-pr-readiness-document-audit-2026.xlsx',
  'digital-products/p1-phase-mapper/singapore-p1-phase-priority-strategy-mapper-2026.xlsx'
];
for (const f of files) {
  const w = XLSX.readFile(f);
  let total = 0;
  console.log(f.split('/').pop() + ':');
  for (const sn of w.SheetNames) {
    const ws = w.Sheets[sn];
    let c = 0;
    for (const a of Object.keys(ws)) {
      if (ws[a] && ws[a].f) c++;
    }
    total += c;
    console.log('  ' + sn + ': ' + c);
  }
  console.log('  Total: ' + total);
}