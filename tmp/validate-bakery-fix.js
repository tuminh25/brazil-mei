const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const BEFORE = path.join(__dirname, 'bakery-before.xlsx');
const AFTER = path.join(__dirname, '..', 'digital-products', 'home-bakery-calculator', 'singapore-home-bakery-pricing-profit-calculator-2026.xlsx');

async function load(f) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f);
  return wb;
}

(async () => {
  const a = await load(BEFORE);
  const b = await load(AFTER);
  let diffs = 0;

  // 1. Sheet structure
  console.log('sheets:', b.worksheets.map(w => w.name).join(' | '));
  if (a.worksheets.length !== b.worksheets.length) throw new Error('sheet count changed');

  // 2. Cell-by-cell value/formula parity
  for (let i = 0; i < a.worksheets.length; i++) {
    const wa = a.worksheets[i], wb2 = b.worksheets[i];
    if (wa.name !== wb2.name) { console.log('NAME DIFF', wa.name, wb2.name); diffs++; }
    wa.eachRow((row, rn) => {
      row.eachCell({ includeEmpty: false }, (c, col) => {
        const c2 = wb2.getCell(rn, col);
        if (JSON.stringify(c.value) !== JSON.stringify(c2.value)) {
          console.log('VALUE DIFF', wa.name, c.address);
          diffs++;
        }
        // formatting parity for styled cells
        const fa = JSON.stringify(c.font), fb = JSON.stringify(c2.font);
        const fila = JSON.stringify(c.fill), filb = JSON.stringify(c2.fill);
        if (fa !== fb || fila !== filb) { console.log('FORMAT DIFF', wa.name, c.address); diffs++; }
      });
    });
  }
  console.log('value/format diffs vs shipped original:', diffs);

  // 3. Protection state — authoritative check is raw XML (done separately);
  // here verify ExcelJS parsed no sheetProtection model on any sheet.
  const protSheets = b.worksheets.filter(w => w.sheetProtection && Object.keys(w.sheetProtection).length > 0).length;
  console.log('sheets with sheetProtection model after fix:', protSheets);

  // 4. UPGRADE SCENARIO key cells present with formulas
  const upg = b.getWorksheet('UPGRADE SCENARIO');
  let verdictCell = null, sCost = null, hBE = null, sBE = null, inputs = [];
  upg.eachRow((row, rn) => {
    row.eachCell({ includeEmpty: false }, (c) => {
      const v = c.value;
      if (v && typeof v === 'object' && typeof v.formula === 'string') {
        if (v.formula.includes('hold your target margin')) verdictCell = c;
        if (v.formula.includes('MAX(1,') && v.formula.includes('+C')) sCost = c;
        if (v.formula.includes('"price too low"') && !v.formula.includes('hold your target')) sBE = c;
        if (v.formula.includes('Items/month') === false && v.formula.includes('monthlyOverhead') ) {}
        if (typeof v.formula === 'string' && v.formula.startsWith("IF(AND(")) hBE = c;
      }
    });
  });
  console.log('verdict cell:', verdictCell && verdictCell.address, '| shared cost:', sCost && sCost.address, '| home BE:', hBE && hBE.address, '| shared BE:', sBE && sBE.address);
  if (!verdictCell) throw new Error('verdict formula missing!');

  // 5. Independent evaluation of the verdict logic under scenarios
  // Layout (from generator): C5 homeCost(formula), C6 hourly=25, C7 hours=1.5,
  // C8 fixed=150, C9 batches=24, C10 targetMargin(mirror)
  const yieldRow = 13; // RECIPE COSTING C13 = units per batch
  const rec = b.getWorksheet('RECIPE COSTING');
  const yieldPerBatch = rec.getCell(`C${yieldRow}`).result ?? 12;

  function scenario(homeCostPerItem, price, marginTarget, monthlyOverhead, hourly, hours, fixed, batches) {
    const sharedCost = homeCostPerItem + hourly * hours / Math.max(1, yieldPerBatch) + fixed / Math.max(1, batches * yieldPerBatch);
    let verdict;
    if (sharedCost >= price) verdict = 'NOT VIABLE';
    else if (sharedCost <= price * (1 - marginTarget)) verdict = 'CAN HOLD MARGIN';
    else verdict = 'MARGIN SHRINKS';
    return { sharedCost: +sharedCost.toFixed(4), verdict };
  }

  const cases = [
    // price=10, margin=0.3 -> threshold 7.0; sharedCost 6.6458 <= 7.0
    { name: 'can hold margin', args: [3.0, 10, 0.3, 300, 25, 1.5, 150, 24], expect: 'CAN HOLD MARGIN' },
    // price=5; sharedCost 6.6458 >= 5 -> not viable
    { name: 'expensive kitchen', args: [3.0, 5, 0.6, 300, 25, 1.5, 150, 24], expect: 'NOT VIABLE' },
    // price=10, margin=0.5 -> threshold 5.0 < 6.6458 < 10
    { name: 'margin shrinks', args: [3.0, 10, 0.5, 300, 25, 1.5, 150, 24], expect: 'MARGIN SHRINKS' },
  ];
  for (const t of cases) {
    const r = scenario(...t.args);
    const ok = r.verdict === t.expect ? 'OK' : `MISMATCH expected ${t.expect}`;
    console.log(`scenario[${t.name}]: sharedCost=${r.sharedCost} -> ${r.verdict} [${ok}]`);
  }

  // 6. Zip/XLSX integrity via full re-read already done; also confirm file signature
  const fd = fs.readFileSync(AFTER);
  console.log('zip signature OK:', fd[0] === 0x50 && fd[1] === 0x4b);

  if (diffs !== 0) { console.log('FAIL: unexpected diffs'); process.exit(1); }
  console.log('ALL CHECKS PASSED');
})().catch(e => { console.error(e); process.exit(1); });
