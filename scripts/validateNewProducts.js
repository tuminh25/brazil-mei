/**
 * Validation for Product #2 and #3 digital assets.
 * Opens each workbook, prints sheets, formula counts and key cells.
 */
const path = require('path');
const ExcelJS = require('exceljs');

async function inspect(file, label) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  console.log(`\n=== ${label} ===`);
  console.log(`File: ${file}`);
  let totalFormulas = 0;
  for (const ws of wb.worksheets) {
    let formulas = 0;
    const sample = [];
    ws.eachRow((row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        if (cell.formula) {
          formulas++;
          if (sample.length < 3 && typeof cell.formula === 'string' && cell.formula.length > 5) {
            sample.push(`${ws.name}!${cell.address}: ${cell.formula.slice(0, 80)}`);
          }
        }
      });
    });
    totalFormulas += formulas;
    console.log(`  [${ws.name}] rows=${ws.rowCount} formulas=${formulas}`);
    sample.forEach(s => console.log(`      ${s}`));
  }
  console.log(`TOTAL FORMULAS: ${totalFormulas}`);
}

(async () => {
  await inspect(
    path.join(__dirname, '..', 'digital-products', 'hdb-tenant-pack', 'singapore-hdb-tenant-protection-cost-pack-2026.xlsx'),
    'PRODUCT #2 — HDB Tenant Protection & Cost Pack'
  );
  await inspect(
    path.join(__dirname, '..', 'digital-products', 'home-bakery-calculator', 'singapore-home-bakery-pricing-profit-calculator-2026.xlsx'),
    'PRODUCT #3 — Home Bakery Pricing & Profit Calculator'
  );
})().catch(e => { console.error(e); process.exit(1); });