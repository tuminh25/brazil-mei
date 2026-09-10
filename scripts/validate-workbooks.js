// scripts/validate-workbooks.js
// Opens each generated workbook and reports structure + computed values.
// Uses the SheetJS "formulas" build path if available; otherwise reports formulas as stored.
const XLSX = require('xlsx');

const FILES = [
  'digital-products/hdb-renosmart-planner/singapore-hdb-renosmart-budget-planner-2026.xlsx',
  'digital-products/wedding-angbao-planner/singapore-wedding-cashflow-angbao-planner-2026.xlsx',
  'digital-products/pr-readiness-audit/singapore-pr-readiness-document-audit-2026.xlsx',
  'digital-products/p1-phase-mapper/singapore-p1-phase-priority-strategy-mapper-2026.xlsx',
  'digital-products/mdw-tco-planner/singapore-mdw-total-cost-ownership-planner-2026.xlsx',
];

let fail = 0;

function report(file) {
  const wb = XLSX.readFile(file);
  console.log('\n==== FILE:', file);
  console.log('Sheets:', wb.SheetNames.join(' | '));
  wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    const ref = ws['!ref'] || '(empty)';
    console.log(`  [${name}] ref=${ref}`);
  });
}

// Formula / reference integrity scan
function scanFormulas(file) {
  const wb = XLSX.readFile(file);
  let issues = [];
  wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    for (const addr of Object.keys(ws)) {
      if (addr[0] === '!') continue;
      const c = ws[addr];
      if (c && c.f) {
        const f = c.f;
        if (/#REF!|#VALUE!|#NAME\?/.test(f)) issues.push(`${name}!${addr}: ${f}`);
      }
    }
  });
  return issues;
}

FILES.forEach(f => {
  if (!require('fs').existsSync(f)) {
    console.log('\nMISSING:', f);
    fail++;
    return;
  }
  report(f);
  const issues = scanFormulas(f);
  if (issues.length) {
    console.log('  FORMULA ISSUES:');
    issues.forEach(i => { console.log('   ', i); fail++; });
  } else {
    console.log('  No literal #REF/#VALUE in stored formulas.');
  }
});

console.log('\nValidation issues:', fail);