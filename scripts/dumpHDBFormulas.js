const path = require('path');
const ExcelJS = require('exceljs');

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, '..', 'digital-products', 'hdb-tenant-pack', 'singapore-hdb-tenant-protection-cost-pack-2026.xlsx'));
  const ws = wb.getWorksheet('RENTAL CALCULATOR');
  ws.eachRow((row, rn) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (cell.formula && typeof cell.formula === 'string') {
        console.log(`${cell.address}: ${cell.formula}`);
      }
    });
  });
})().catch(e => { console.error(e); process.exit(1); });