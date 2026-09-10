const path = require('path');
const ExcelJS = require('exceljs');
const FILE = path.join(__dirname, '..', 'digital-products', 'car-vs-mrt-grab-calculator',
  'singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx');

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE);

  for (const name of ['COMPARISON', 'SCENARIO ANALYSIS']) {
    const ws = wb.getWorksheet(name);
    console.log(`\n===== ${name} =====`);
    ws.eachRow({ includeEmpty: false }, (row, rn) => {
      if (rn > 30) return;
      ['B', 'C', 'D', 'E'].forEach((col) => {
        const cell = ws.getCell(`${col}${rn}`);
        if (cell.value === null || cell.value === undefined) return;
        let desc;
        if (cell.value && typeof cell.value === 'object') {
          if (cell.value.formula !== undefined) {
            desc = `FORMULA(${cell.value.formula})`;
            if (cell.value.result !== undefined && typeof cell.value.result === 'number') {
              desc += ` => ${cell.value.result}`;
            }
          } else if (cell.value.richText) {
            desc = 'RICHTEXT';
          } else if (cell.value.text) {
            desc = `TEXT(${cell.value.text})`;
          }
        } else {
          desc = String(cell.value);
        }
        console.log(`${col}${rn}: ${desc}`);
      });
    });
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
