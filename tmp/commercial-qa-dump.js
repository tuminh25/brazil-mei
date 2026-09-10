/* READ-ONLY commercial QA dump — no writes, no changes. */
const path = require('path');
const ExcelJS = require('exceljs');
const FILE = path.join(__dirname, '..', 'digital-products', 'car-vs-mrt-grab-calculator',
  'singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE);

  for (const name of ['START HERE', 'INPUTS']) {
    const ws = wb.getWorksheet(name);
    console.log(`\n===== ${name} =====`);
    ws.eachRow({ includeEmpty: true }, (row, rn) => {
      if (rn > 40) return;
      ['B', 'C', 'D'].forEach((col) => {
        const cell = ws.getCell(`${col}${rn}`);
        if (cell.value === null || cell.value === undefined) return;
        let v = cell.value;
        if (typeof v === 'object') v = v.formula !== undefined ? `[F] ${v.formula} => ${v.result}` : JSON.stringify(v);
        v = String(v).replace(/\s+/g, ' ').slice(0, 150);
        const fill = cell.fill && cell.fill.fgColor ? String(cell.fill.fgColor.argb).slice(-6) : '';
        console.log(`${col}${rn} [fill:${fill}] [locked:${cell.protection ? cell.protection.locked : 'default'}] ${v}`);
      });
    });
  }

  console.log('\n===== SHEET-LEVEL UX FLAGS =====');
  for (const name of ['START HERE', 'INPUTS', 'COMPARISON', 'SCENARIO ANALYSIS']) {
    const ws = wb.getWorksheet(name);
    const view = ws.views && ws.views[0] || {};
    console.log(`${name}: protected=${!!(ws.sheetProtection && ws.sheetProtection.sheet)} | freezeY=${view.ySplit ?? '-'} | gridlines=${view.showGridLines === false ? 'hidden' : 'shown'} | dims=${ws.dimensions}`);
  }

  // Input-cell visual identifiability: yellow fill + unlocked
  const inputs = wb.getWorksheet('INPUTS');
  const addrs = ['C5','C7','C9','C10','C11','C12','C14','C15','C16','C17','C18','C19','C21'];
  const bad = addrs.filter(a => {
    const c = inputs.getCell(a);
    return !(c.fill && c.fill.fgColor && /FFF3C4/i.test(String(c.fill.fgColor.argb))) ||
           !(c.protection && c.protection.locked === false);
  });
  console.log(`\ninput cells yellow+unlocked: ${addrs.length - bad.length}/${addrs.length}${bad.length ? ' BAD:' + bad.join(',') : ''}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
