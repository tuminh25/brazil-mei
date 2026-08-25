/**
 * SGEventsHub — Paid Digital Asset Generator
 * Product: Singapore Home Bakery Pricing & Profit Calculator (2026)
 *
 * Generates a polished, formula-driven Excel workbook:
 *   digital-products/home-bakery-calculator/
 *     singapore-home-bakery-pricing-profit-calculator-2026.xlsx
 *
 * Run: node scripts/generateHomeBakeryWorkbook.js
 *
 * Design rules:
 *  - All calculations happen INSIDE the spreadsheet via live formulas.
 *  - Only yellow input cells are editable (sheets are protected, no password).
 *  - Pre-filled numbers are clearly-labelled 2026 EXAMPLES, editable by design.
 *  - No external APIs, no live data fetches.
 */

const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

// ---------------------------------------------------------------------------
// Palette / shared styles
// ---------------------------------------------------------------------------
const NAVY = 'FF0F172A';
const BLUE = 'FF2563EB';
const BLUE_SOFT = 'FFDBEAFE';
const BLUE_TINT = 'FFEFF4FF';
const GREEN = 'FF16A34A';
const GREEN_SOFT = 'FFDCFCE7';
const ORANGE = 'FFEA580C';
const ORANGE_SOFT = 'FFFFEDD5';
const PURPLE = 'FF9333EA';
const YELLOW_INPUT = 'FFFFF3C4';
const GREY_TEXT = 'FF64748B';
const WHITE = 'FFFFFFFF';
const BORDER_GREY = 'FFCBD5E1';

const FMT_SGD = '"S$"#,##0.00';
const FMT_SGD0 = '"S$"#,##0';
const FONT_BASE = { name: 'Calibri', size: 11 };

function solid(argb) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function thinBorder(color = BORDER_GREY) {
  const edge = { style: 'thin', color: { argb: color } };
  return { top: edge, bottom: edge, left: edge, right: edge };
}

function addTitleBanner(ws, row, text, subtitle) {
  ws.mergeCells(row, 2, row, 8);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 15, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 34;

  if (subtitle) {
    ws.mergeCells(row + 1, 2, row + 1, 8);
    const s = ws.getCell(row + 1, 2);
    s.value = subtitle;
    s.font = { ...FONT_BASE, italic: true, size: 10, color: { argb: GREY_TEXT } };
    s.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    s.border = { bottom: { style: 'thin', color: { argb: BORDER_GREY } } };
    ws.getRow(row + 1).height = 20;
    return row + 2;
  }
  return row + 1;
}

function addSectionBand(ws, row, text, color = BLUE, spanTo = 8) {
  ws.mergeCells(row, 2, row, spanTo);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: WHITE } };
  c.fill = solid(color);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 24;
  return row + 1;
}

// ---------------------------------------------------------------------------
// Workbook
// ---------------------------------------------------------------------------
async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SGEventsHub';
  wb.lastModifiedBy = 'SGEventsHub';
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = 'Singapore Home Bakery Pricing & Profit Calculator (2026)';
  wb.subject = 'Ingredient costing, recipe costing, labour & overhead allocation, pricing and profit projection';
  wb.description = 'Cost your bakes accurately — ingredients, packaging, labour and overhead — then price for profit. Includes a home vs shared-kitchen upgrade scenario. For small-business planning only — not financial advice.';
  wb.company = 'SGEventsHub';

  // ========================================================================
  // TAB 1 — START HERE
  // ========================================================================
  const start = wb.addWorksheet('START HERE', {
    properties: { tabColor: { argb: BLUE } },
    views: [{ showGridLines: false }],
  });
  start.getColumn(1).width = 3;
  start.getColumn(2).width = 55;
  ['C', 'D', 'E', 'F'].forEach((col) => { start.getColumn(col).width = 20; });

  let r = 2;
  start.mergeCells(r, 2, r, 6);
  let c = start.getCell(r, 2);
  c.value = 'HOME BAKERY PRICING & PROFIT CALCULATOR';
  c.font = { ...FONT_BASE, bold: true, size: 26, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 46;

  r += 1;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = 'Singapore Edition — 2026';
  c.font = { ...FONT_BASE, bold: true, size: 14, color: { argb: WHITE } };
  c.fill = solid(BLUE);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 30;

  r += 2;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = 'Cost your bakes accurately — ingredients, packaging, labour and overhead — then price for real profit instead of guessing.';
  c.font = { ...FONT_BASE, italic: true, size: 12, color: { argb: NAVY } };
  c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  start.getRow(r).height = 34;

  r += 2;

  const addStartSection = (row, title, lines) => {
    let rr = addSectionBand(start, row, title, BLUE, 6);
    for (const line of lines) {
      start.mergeCells(rr, 2, rr, 6);
      const cc = start.getCell(rr, 2);
      cc.value = line;
      cc.font = { ...FONT_BASE, size: 11, color: { argb: NAVY } };
      cc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
      start.getRow(rr).height = line.length > 100 ? 30 : 20;
      rr += 1;
    }
    return rr + 1;
  };

  r = addStartSection(r, 'WHAT THIS CALCULATOR DOES', [
    'INGREDIENTS tab — build your ingredient database: what you bought, how much it cost, and the cost per gram/ml/unit.',
    'RECIPE COSTING — pick a recipe and enter quantities used; the sheet prices every ingredient line and totals the batch.',
    'LABOUR & OVERHEAD — add your time value, utilities and equipment allowance; allocate them per batch and per item.',
    'PRICING & PROFIT — see cost per item, suggested price at your target margin, profit per item and batch, and a monthly profit projection.',
    'UPGRADE SCENARIO — compare today\'s home operation against a shared-kitchen setup with higher overheads, and see what sales volume or pricing keeps your target margin.',
  ]);

  r = addStartSection(r, 'HOW TO USE IT — 4 STEPS', [
    'STEP 1 · INGREDIENTS: enter each ingredient you buy — package size, unit and price. The sheet computes cost per usable unit automatically.',
    'STEP 2 · RECIPE COSTING: choose one recipe (the example uses a classic butter cookie batch). Enter quantity used per ingredient — costs flow in from the database.',
    'STEP 3 · LABOUR & OVERHEAD: set your hourly rate, batch time, utility and equipment allowances on LABOUR & OVERHEAD.',
    'STEP 4 · PRICING & PROFIT: set your target margin and monthly volume. Review suggested pricing, margins and monthly profit. Then try the UPGRADE SCENARIO before renting any kitchen.',
  ]);

  r = addStartSection(r, 'GOOD TO KNOW', [
    'Yellow cells are yours to edit. Blue/green cells calculate automatically — do not type into them.',
    'All pre-filled figures are clearly-labelled EXAMPLES using typical Singapore supermarket prices — replace them with your own receipts.',
    'Unit conversions supported: kg→g (×1000), g as-is, L→ml (×1000), ml as-is, units/pcs as-is.',
    'The calculator works entirely offline inside this file. It never fetches live prices.',
    'This is a business planning tool. It is NOT financial or tax advice. Check SFA/home-business rules yourself before selling.',
  ]);

  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = 'Disclaimer: For planning only — not financial, tax or legal advice. Verify current SFA guidance on home-based food businesses before operating.';
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  c.fill = solid(YELLOW_INPUT);
  c.border = thinBorder();
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  start.getRow(r).height = 32;

  r += 2;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = '© SGEventsHub · Singapore Home Bakery Pricing & Profit Calculator (2026) · v2026.1';
  c.font = { ...FONT_BASE, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'middle', horizontal: 'center' };

  // ========================================================================
  // TAB 2 — INGREDIENTS (database)
  // ========================================================================
  const ing = wb.addWorksheet('INGREDIENTS', {
    properties: { tabColor: { argb: 'FFCA8A04' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  ing.getColumn(1).width = 3;
  ing.getColumn(2).width = 26;   // Ingredient name
  ing.getColumn(3).width = 12;   // Purchase qty
  ing.getColumn(4).width = 10;   // Unit
  ing.getColumn(5).width = 13;   // Price
  ing.getColumn(6).width = 14;   // Cost per unit
  ing.getColumn(7).width = 44;   // Notes

  r = addTitleBanner(
    ing, 1,
    'INGREDIENT DATABASE',
    'Enter each ingredient you actually buy. Cost-per-usable-unit calculates automatically. Recipe Costing pulls prices from here.'
  );

  const ingHdrRow = r + 0; // header row
  const ingHeaders = ['Ingredient', 'Package size', 'Unit', 'Package price', 'Cost per unit (auto)', 'Notes / brand'];
  ingHeaders.forEach((h, i) => {
    const hc = ing.getCell(ingHdrRow, 2 + i);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: i === 0 ? 'left' : 'center', indent: i === 0 ? 1 : 0 };
  });
  ing.getRow(ingHdrRow).height = 24;

  // Example ingredient rows — realistic SG supermarket examples
  const exampleIngredients = [
    { name: 'Plain flour',        qty: 1,    unit: 'kg',  price: 2.35, note: 'e.g., Prima — NTUC' },
    { name: 'Butter (salted)',    qty: 250,  unit: 'g',   price: 3.75, note: 'e.g., SCS block' },
    { name: 'Icing sugar',        qty: 500,  unit: 'g',   price: 2.80, note: 'Fine grade' },
    { name: 'Brown sugar',        qty: 500,  unit: 'g',   price: 2.55, note: 'Soft brown' },
    { name: 'Eggs',               qty: 10,   unit: 'pcs', price: 3.20, note: 'Grade A, tray of 10' },
    { name: 'Vanilla extract',    qty: 50,   unit: 'ml',  price: 6.90, note: 'Pure extract' },
    { name: 'Baking powder',      qty: 200,  unit: 'g',   price: 2.40, note: 'Double acting' },
    { name: 'Salt',               qty: 500,  unit: 'g',   price: 0.95, note: 'Table salt' },
    { name: 'Chocolate chips',    qty: 340,  unit: 'g',   price: 5.85, note: 'Dark, baking chips' },
    { name: 'Full-fat milk',      qty: 1,    unit: 'L',   price: 3.45, note: 'Fresh, UHT ok' },
  ];

  const ingFirstDataRow = ingHdrRow + 1;
  exampleIngredients.forEach((item, idx) => {
    const rowIdx = ingFirstDataRow + idx;
    ing.getCell(rowIdx, 2).value = item.name;
    ing.getCell(rowIdx, 3).value = item.qty;
    ing.getCell(rowIdx, 4).value = item.unit;
    ing.getCell(rowIdx, 5).value = item.price;

    // Style inputs yellow
    [3, 4, 5].forEach((colIdx) => {
      const cell = ing.getCell(rowIdx, colIdx);
      cell.fill = solid(YELLOW_INPUT);
      cell.border = thinBorder();
      cell.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    ing.getCell(rowIdx, 3).numFmt = '0.###';
    ing.getCell(rowIdx, 5).numFmt = FMT_SGD;

    // Cost per usable unit — formula with conversion
    // kg -> *1000 to get per-g ; L -> *1000 to get per-ml ; g/ml/pcs -> direct divide
    const costPerUnitFormula =
      `IF(D${rowIdx}="kg",E${rowIdx}/(C${rowIdx}*1000),` +
      `IF(D${rowIdx}="L",E${rowIdx}/(C${rowIdx}*1000),` +
      `IF(E${rowIdx}=0,"",E${rowIdx}/C${rowIdx})))`;
    const cpuCell = ing.getCell(rowIdx, 6);
    cpuCell.value = { formula: costPerUnitFormula, result: 0 };
    cpuCell.numFmt = '"S$"0.0000';
    cpuCell.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    cpuCell.fill = solid(BLUE_SOFT);
    cpuCell.border = thinBorder();
    cpuCell.alignment = { vertical: 'middle', horizontal: 'right' };

    // Notes
    const noteCell = ing.getCell(rowIdx, 7);
    noteCell.value = item.note;
    noteCell.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
    noteCell.alignment = { vertical: 'middle', wrapText: true };

    ing.getCell(rowIdx, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
    ing.getCell(rowIdx, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    ing.getCell(rowIdx, 4).alignment = { vertical: 'middle', horizontal: 'center' };

    ing.getRow(rowIdx).height = 22;
  });

  // Data validation rows below examples (blank template rows)
  const extraRows = 14;
  for (let i = 0; i < extraRows; i++) {
    const rowIdx = ingFirstDataRow + exampleIngredients.length + i;
    ['B','C','D','E','G'].forEach((colL) => {
      const cell = ing.getCell(`${colL}${rowIdx}`);
      cell.fill = solid(YELLOW_INPUT);
      cell.border = thinBorder();
      cell.font = { ...FONT_BASE, color: { argb: NAVY } };
    });
    ing.getCell(`${'E'}${rowIdx}`).numFmt = FMT_SGD;
    const cpuCell = ing.getCell(rowIdx, 6);
    cpuCell.value = {
      formula:
        `IF($D${rowIdx}="kg",$E${rowIdx}/($C${rowIdx}*1000),` +
        `IF($D${rowIdx}="L",$E${rowIdx}/($C${rowIdx}*1000),` +
        `IF($E${rowIdx}=0,"",$E${rowIdx}/$C${rowIdx})))`,
      result: ''
    };
    cpuCell.numFmt = '"S$"0.0000';
    cpuCell.fill = solid(BLUE_TINT);
    cpuCell.border = thinBorder();
    cpuCell.alignment = { vertical: 'middle', horizontal: 'right' };
    ing.getCell(rowIdx, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    ing.getRow(rowIdx).height = 22;
  }

  const ingLastDataRow = ingFirstDataRow + exampleIngredients.length + extraRows - 1;

  // Usage note
  let noteR = ingLastDataRow + 2;
  ing.mergeCells(noteR, 2, noteR, 7);
  let nc = ing.getCell(noteR, 2);
  nc.value = 'How cost-per-unit works: kg and L are converted to g and ml respectively (÷1000 factor), then price ÷ converted size. Units like pcs divide directly. Add more ingredients in the blank rows.';
  nc.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  nc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
  ing.getRow(noteR).height = 30;

  // ========================================================================
  // TAB 3 — RECIPE COSTING
  // ========================================================================
  const rec = wb.addWorksheet('RECIPE COSTING', {
    properties: { tabColor: { argb: GREEN } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  rec.getColumn(1).width = 3;
  rec.getColumn(2).width = 26;  // Ingredient
  rec.getColumn(3).width = 14;  // Qty used
  rec.getColumn(4).width = 10;  // Unit
  rec.getColumn(5).width = 16;  // Line cost
  rec.getColumn(6).width = 16;  // % of batch
  rec.getColumn(7).width = 40;  // Note

  r = addTitleBanner(
    rec, 1,
    'RECIPE COSTING',
    'Example recipe: Classic Butter Cookies (24 pieces). Enter quantity used — line costs pull from the INGREDIENTS database.'
  );

  const recHdrRow = r;
  const recHeaders = ['Ingredient', 'Qty used', 'Unit', 'Line cost (auto)', '% of ingredient cost', 'Notes'];
  recHeaders.forEach((h, i) => {
    const hc = rec.getCell(recHdrRow, 2 + i);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: i === 0 ? 'left' : 'center', indent: i === 0 ? 1 : 0 };
  });
  rec.getRow(recHdrRow).height = 24;

  // Helper to reference an ingredient's cost/unit cell by name lookup is complex in plain formulas;
  // we use direct references into INGREDIENTS rows (documented order matches).
  function ingRef(rowIndex) { return `'INGREDIENTS'!F${rowIndex}`; }

  const recipeLines = [
    { name: 'Plain flour',     qty: 300, unit: 'g',  dbRow: ingFirstDataRow + 0 },
    { name: 'Butter (salted)', qty: 200, unit: 'g',  dbRow: ingFirstDataRow + 1 },
    { name: 'Icing sugar',     qty: 100, unit: 'g',  dbRow: ingFirstDataRow + 2 },
    { name: 'Eggs',            qty: 1,   unit: 'pcs',dbRow: ingFirstDataRow + 4 },
    { name: 'Vanilla extract', qty: 5,   unit: 'ml', dbRow: ingFirstDataRow + 5 },
    { name: 'Salt',            qty: 2,   unit: 'g',  dbRow: ingFirstDataRow + 7 },
  ];

  const recipeFirstRow = recHdrRow + 1;
  const recipeLastLineRow = recipeFirstRow + recipeLines.length - 1;
  const recipeTotalRowPlaceholder = recipeLastLineRow + 1;

  recipeLines.forEach((line, idx) => {
    const rowIdx = recipeFirstRow + idx;
    rec.getCell(rowIdx, 2).value = line.name;
    rec.getCell(rowIdx, 3).value = line.qty;
    rec.getCell(rowIdx, 4).value = line.unit;

    rec.getCell(rowIdx, 3).fill = solid(YELLOW_INPUT);
    rec.getCell(rowIdx, 3).border = thinBorder();
    rec.getCell(rowIdx, 3).font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    rec.getCell(rowIdx, 3).alignment = { vertical: 'middle', horizontal: 'right' };
    rec.getCell(rowIdx, 3).numFmt = '0.##';

    // Line cost = qty used × cost-per-unit from DB (unit must match: g↔kg-derived per-g, ml↔per-ml, pcs↔per-pc)
    const lc = rec.getCell(rowIdx, 5);
    lc.value = { formula: `$C${rowIdx}*${ingRef(line.dbRow)}`, result: 0 };
    lc.numFmt = FMT_SGD;
    lc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    lc.fill = solid(BLUE_TINT);
    lc.border = thinBorder();
    lc.alignment = { vertical: 'middle', horizontal: 'right' };

    // % of ingredient cost
    const pct = rec.getCell(rowIdx, 6);
    pct.value = { formula: `IF($E$${recipeTotalRowPlaceholder}=0,"",E${rowIdx}/$E$${recipeTotalRowPlaceholder})`, result: '' };
    pct.numFmt = '0.0%';
    pct.font = { ...FONT_BASE, color: { argb: NAVY } };
    pct.fill = solid(BLUE_TINT);
    pct.border = thinBorder();
    pct.alignment = { vertical: 'middle', horizontal: 'right' };

    rec.getCell(rowIdx, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
    rec.getCell(rowIdx, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    rec.getCell(rowIdx, 4).alignment = { vertical: 'middle', horizontal: 'center' };
    rec.getCell(rowIdx, 4).border = thinBorder();

    rec.getRow(rowIdx).height = 22;
  });

  // Total ingredient cost row
  const totRow = recipeTotalRowPlaceholder;
  rec.getCell(totRow, 2).value = 'TOTAL INGREDIENT COST';
  rec.getCell(totRow, 2).font = { ...FONT_BASE, bold: true, size: 12, color: { argb: WHITE } };
  rec.getCell(totRow, 2).fill = solid(GREEN);
  rec.getCell(totRow, 2).alignment = { vertical: 'middle', indent: 1 };
  rec.mergeCells(totRow, 2, totRow, 4);

  const totCell = rec.getCell(`E${totRow}`);
  totCell.value = { formula: `SUM(E${recipeFirstRow}:E${recipeLastLineRow})`, result: 0 };
  totCell.numFmt = FMT_SGD;
  totCell.font = { ...FONT_BASE, bold: true, size: 12, color: { argb: NAVY } };
  totCell.fill = solid(GREEN_SOFT);
  totCell.border = thinBorder();
  totCell.alignment = { vertical: 'middle', horizontal: 'right' };
  rec.getRow(totRow).height = 26;

  // Batch yield + packaging
  let pr = totRow + 2;
  pr = addSectionBand(rec, pr, 'PACKAGING & YIELD', GREEN);

  const yieldRow = pr;
  rec.getCell(yieldRow, 2).value = 'Batch yield (pieces)';
  rec.getCell(yieldRow, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
  rec.getCell(yieldRow, 2).alignment = { vertical: 'middle', indent: 1 };
  const yc = rec.getCell(`C${yieldRow}`);
  yc.value = 24;
  yc.numFmt = '0';
  yc.fill = solid(YELLOW_INPUT);
  yc.border = thinBorder();
  yc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  yc.alignment = { vertical: 'middle', horizontal: 'right' };

  const pkgPerItemRow = yieldRow + 1;
  rec.getCell(pkgPerItemRow, 2).value = 'Packaging cost per piece';
  rec.getCell(pkgPerItemRow, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
  rec.getCell(pkgPerItemRow, 2).alignment = { vertical: 'middle', indent: 1 };
  const pk = rec.getCell(`C${pkgPerItemRow}`);
  pk.value = 0.25;
  pk.numFmt = FMT_SGD;
  pk.fill = solid(YELLOW_INPUT);
  pk.border = thinBorder();
  pk.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  pk.alignment = { vertical: 'middle', horizontal: 'right' };

  const pkgBatchRow = pkgPerItemRow + 1;
  rec.getCell(pkgBatchRow, 2).value = 'Packaging cost per batch (auto)';
  rec.getCell(pkgBatchRow, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
  rec.getCell(pkgBatchRow, 2).alignment = { vertical: 'middle', indent: 1 };
  const pb = rec.getCell(`C${pkgBatchRow}`);
  pb.value = { formula: `C${yieldRow}*C${pkgPerItemRow}`, result: 0 };
  pb.numFmt = FMT_SGD;
  pb.fill = solid(BLUE_SOFT);
  pb.border = thinBorder();
  pb.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  pb.alignment = { vertical: 'middle', horizontal: 'right' };

  const batchCostNoteRow = pkgBatchRow + 2;
  rec.mergeCells(batchCostNoteRow, 2, batchCostNoteRow, 7);
  const bn = rec.getCell(batchCostNoteRow, 2);
  bn.value = 'Named cells used downstream: TOTAL INGREDIENT COST (E' + totRow + '), Yield (C' + yieldRow + '), Packaging/batch (C' + pkgBatchRow + '). LABOUR & OVERHEAD adds the rest.';
  bn.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  bn.alignment = { vertical: 'top', wrapText: true, indent: 1 };
  rec.getRow(batchCostNoteRow).height = 26;

  // ========================================================================
  // TAB 4 — LABOUR & OVERHEAD
  // ========================================================================
  const lab = wb.addWorksheet('LABOUR & OVERHEAD', {
    properties: { tabColor: { argb: PURPLE } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  lab.getColumn(1).width = 3;
  lab.getColumn(2).width = 42;
  lab.getColumn(3).width = 16;
  lab.getColumn(4).width = 46;

  r = addTitleBanner(
    lab, 1,
    'LABOUR, UTILITIES & OVERHEAD',
    'Pay yourself properly. These costs are allocated per batch and per item on PRICING & PROFIT.'
  );

  let lr = 4;
  lr = addSectionBand(lab, lr, 'YOUR TIME', PURPLE);

  function labInput(row, label, value, fmt, note) {
    lab.getCell(row, 2).value = label;
    lab.getCell(row, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
    lab.getCell(row, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };

    const vc = lab.getCell(`C${row}`);
    vc.value = value;
    vc.numFmt = fmt;
    vc.fill = solid(YELLOW_INPUT);
    vc.border = thinBorder();
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.alignment = { vertical: 'middle', horizontal: 'right' };

    if (note) {
      lab.mergeCells(row, 4, row, 4);
      const ncell = lab.getCell(`D${row}`);
      ncell.value = note;
      ncell.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
      ncell.alignment = { vertical: 'middle', wrapText: true };
    }
    lab.getRow(row).height = 22;
    return `C${row}`;
  }

  const hourlyRateRef  = labInput(lr++, 'Your target hourly rate', 18, FMT_SGD, 'What an hour of your skilled baking time should earn.');
  const batchHoursRef  = labInput(lr++, 'Hours per batch (prep+bake+clean)', 2.5, '0.0#', 'Be honest — include washing up and cooling time.');

  lr = addSectionBand(lab, lr, 'UTILITIES PER BATCH', PURPLE);
  const elecPerBatchRef = labInput(lr++, 'Electricity / gas per batch', 2.80, FMT_SGD, 'Oven + mixer + hob estimate. Split monthly bill by batches baked.');

  lr = addSectionBand(lab, lr, 'MONTHLY OVERHEAD (ALLOCATED)', PURPLE);
  const equipMonthlyRef = labInput(lr++, 'Equipment depreciation / month', 25, FMT_SGD, 'Mixer, oven, tins ÷ useful months. Example: S$900 gear over 36 months ≈ S$25.');
  const otherMonthlyRef = labInput(lr++, 'Other overheads / month', 30, FMT_SGD, 'Packaging stock storage, listing fees, samples, etc.');
  const batchesMonthRef = labInput(lr++, 'Batches you bake per month', 20, '0', 'Used to split monthly overhead across batches.');

  lr += 1;
  lr = addSectionBand(lab, lr, 'CALCULATED ALLOCATIONS', GREEN);

  function labCalc(row, label, formulaObj, fmt, note) {
    lab.getCell(row, 2).value = label;
    lab.getCell(row, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
    lab.getCell(row, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };

    const vc = lab.getCell(`C${row}`);
    vc.value = formulaObj;
    vc.numFmt = fmt;
    vc.fill = solid(BLUE_SOFT);
    vc.border = thinBorder();
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.alignment = { vertical: 'middle', horizontal: 'right' };

    if (note) {
      const ncell = lab.getCell(`D${row}`);
      ncell.value = note;
      ncell.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
      ncell.alignment = { vertical: 'middle', wrapText: true };
    }
    lab.getRow(row).height = 22;
    return `C${row}`;
  }

  const labourPerBatchRef = labCalc(lr++,
    'Labour cost per batch',
    { formula: `${hourlyRateRef}*${batchHoursRef}`, result: 0 }, FMT_SGD,
    'Hourly rate × hours per batch.');

  const monthlyOverheadRef = labCalc(lr++,
    'Monthly overhead total',
    { formula: `${equipMonthlyRef}+${otherMonthlyRef}`, result: 0 }, FMT_SGD,
    'Equipment + other recurring overheads.');

  const overheadPerBatchRef = labCalc(lr++,
    'Overhead allocated per batch',
    { formula: `IF(${batchesMonthRef}=0,0,${monthlyOverheadRef}/${batchesMonthRef})`, result: 0 }, FMT_SGD,
    'Monthly overhead ÷ batches per month. Guarded against divide-by-zero.');

  const utilAndOhPerBatchRef = labCalc(lr++,
    'Utilities + overhead per batch',
    { formula: `${elecPerBatchRef}+${overheadPerBatchRef}`, result: 0 }, FMT_SGD,
    'Added on top of labour when costing a batch.');

  // ========================================================================
  // TAB 5 — PRICING & PROFIT
  // ========================================================================
  const price = wb.addWorksheet('PRICING & PROFIT', {
    properties: { tabColor: { argb: 'FF059669' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  price.getColumn(1).width = 3;
  price.getColumn(2).width = 44;
  price.getColumn(3).width = 17;
  price.getColumn(4).width = 48;

  r = addTitleBanner(
    price, 1,
    'PRICING, MARGIN & MONTHLY PROFIT',
    'All values flow from RECIPE COSTING and LABOUR & OVERHEAD. Only yellow cells are editable.'
  );

  let ppr = 4;
  ppr = addSectionBand(price, ppr, 'FULL BATCH COST', GREEN);

  function priceRow(row, label, valOrFormula, opts = {}) {
    const isInput = !!opts.input;
    price.getCell(row, 2).value = label;
    price.getCell(row, 2).font = { ...FONT_BASE, bold: !!opts.boldLabel, color: { argb: NAVY } };
    price.getCell(row, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };

    const vc = price.getCell(`C${row}`);
    vc.value = valOrFormula;
    vc.numFmt = opts.fmt || FMT_SGD;
    vc.fill = solid(isInput ? YELLOW_INPUT : (opts.fill || BLUE_TINT));
    vc.border = thinBorder();
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.alignment = { vertical: 'middle', horizontal: 'right' };

    if (opts.note) {
      const ncell = price.getCell(`D${row}`);
      ncell.value = opts.note;
      ncell.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
      ncell.alignment = { vertical: 'middle', wrapText: true };
    }
    price.getRow(row).height = 22;
    return `C${row}`;
  }

  // Pull key refs from other sheets
  const R_ING_TOTAL = `'RECIPE COSTING'!E${totRow}`;
  const R_YIELD     = `'RECIPE COSTING'!C${yieldRow}`;
  const R_PKG_BATCH = `'RECIPE COSTING'!C${pkgBatchRow}`;

  const ingTotalRef  = priceRow(ppr++, 'Ingredients per batch', { formula: R_ING_TOTAL, result: 0 }, { fill: BLUE_SOFT });
  const pkgBatchRef  = priceRow(ppr++, 'Packaging per batch', { formula: R_PKG_BATCH, result: 0 });
  const labourRef    = priceRow(ppr++, 'Labour per batch', { formula: `'LABOUR & OVERHEAD'!${labourPerBatchRef.replace('C', 'C')}`, result: 0 });
  const utilOhRef    = priceRow(ppr++, 'Utilities + overhead per batch', { formula: `'LABOUR & OVERHEAD'!${utilAndOhPerBatchRef}`, result: 0 });

  const batchCostRow = ppr++;
  const batchCostRef = priceRow(batchCostRow, 'TOTAL COST PER BATCH', { formula: `${ingTotalRef}+${pkgBatchRef}+${labourRef}+${utilOhRef}`, result: 0 }, { fill: GREEN_SOFT, boldLabel: true });

  const yieldPriceRef = priceRow(ppr++, 'Pieces per batch', { formula: R_YIELD, result: 0 }, { fmt: '0' });

  const costPerItemRow = ppr++;
  const costPerItemRef = priceRow(costPerItemRow, 'COST PER ITEM', { formula: `IF(${yieldPriceRef}=0,0,${batchCostRef}/${yieldPriceRef})`, result: 0 }, { fill: GREEN_SOFT, boldLabel: true });

  ppr += 1;
  ppr = addSectionBand(price, ppr, 'SET YOUR PRICE', GREEN);

  const marginInputRef = priceRow(ppr++, 'Target gross margin', 0.45, { input: true, fmt: '0%', note: '45% means cost is 55% of price. Typical home-bakery range: 40–60%.' });
  const suggestedPriceRef = priceRow(ppr++, 'Suggested price per item', { formula: `IF(${costPerItemRef}=0,0,${costPerItemRef}/(1-${marginInputRef}))`, result: 0 }, { fill: BLUE_SOFT, note: 'Cost ÷ (1 − margin).' });
  const actualPriceInputRef = priceRow(ppr++, 'Your chosen price per item', 4.5, { input: true, note: 'What you will actually charge (round for the market).' });
  const profitPerItemRef = priceRow(ppr++, 'Gross profit per item', { formula: `${actualPriceInputRef}-${costPerItemRef}`, result: 0 });
  const marginActualRef = priceRow(ppr++, 'Margin at your price', { formula: `IF(${actualPriceInputRef}=0,0,(${actualPriceInputRef}-${costPerItemRef})/${actualPriceInputRef})`, result: 0 }, { fmt: '0.0%' });

  ppr += 1;
  ppr = addSectionBand(price, ppr, 'BATCH & MONTHLY PROJECTION', GREEN);

  const batchProfitRef = priceRow(ppr++, 'Profit per batch', { formula: `(${actualPriceInputRef}-${costPerItemRef})*${yieldPriceRef}`, result: 0 });

  const volInputRef = priceRow(ppr++, 'Items sold per month', 240, { input: true, fmt: '#,##0' });
  const batchesNeededRef = priceRow(ppr++, 'Batches needed per month', { formula: `IF(${yieldPriceRef}=0,0,ROUNDUP(${volInputRef}/${yieldPriceRef},0))`, result: 0 }, { fmt: '0' });
  const monthlyProfitRef = priceRow(ppr++, 'PROJECTED MONTHLY PROFIT', { formula: `(${actualPriceInputRef}-${costPerItemRef})*${volInputRef}`, result: 0 }, { fill: GREEN_SOFT, boldLabel: true });

  const revenueRow = ppr++;
  priceRow(revenueRow, 'Projected monthly revenue', { formula: `${actualPriceInputRef}*${volInputRef}`, result: 0 });

  // Sanity check banner
  ppr += 1;
  price.mergeCells(ppr, 2, ppr, 4);
  const warn = price.getCell(ppr, 2);
  warn.value = { formula: `IF(${marginActualRef}<0.3,"⚠ Your margin is below 30% — most home bakeries need 40%+ to survive fees, wastage and slow weeks.","Margin looks workable — remember platform/payment fees (~2–4%) come out of this.")`, result: '' };
  warn.font = { ...FONT_BASE, italic: true, size: 10, color: { argb: NAVY } };
  warn.fill = solid(ORANGE_SOFT);
  warn.border = thinBorder();
  warn.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  price.getRow(ppr).height = 28;

  // ========================================================================
  // TAB 6 — UPGRADE SCENARIO (home vs shared kitchen)
  // ========================================================================
  const upg = wb.addWorksheet('UPGRADE SCENARIO', {
    properties: { tabColor: { argb: ORANGE } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  upg.getColumn(1).width = 3;
  upg.getColumn(2).width = 40;
  upg.getColumn(3).width = 17;
  upg.getColumn(4).width = 17;
  upg.getColumn(5).width = 44;

  let ur = addTitleBanner(
    upg, 1,
    'SHARED-KITCHEN UPGRADE SCENARIO',
    'Compare today\'s home operation vs renting shared-kitchen hours. What volume or price keeps your target margin?'
  );

  ur = addSectionBand(upg, ur, 'SCENARIO INPUTS', ORANGE);

  function upgInput(row, label, val, fmt, note) {
    upg.getCell(row, 2).value = label;
    upg.getCell(row, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
    upg.getCell(row, 2).alignment = { vertical: 'middle', wrapText: true, indent: 1 };

    const vc = upg.getCell(`C${row}`);
    vc.value = val;
    vc.numFmt = fmt || FMT_SGD;
    vc.fill = solid(YELLOW_INPUT);
    vc.border = thinBorder();
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.alignment = { vertical: 'middle', horizontal: 'right' };

    if (note) {
      const ncell = upg.getCell(`D${row}`);
      ncell.value = note;
      ncell.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
      ncell.alignment = { vertical: 'middle', wrapText: true };
    }
    upg.getRow(row).height = 22;
    return `C${row}`;
  }

  const homeCostRef = upgInput(ur++, 'Home: full cost per item (from Pricing)', { formula: `'PRICING & PROFIT'!${costPerItemRef}`, result: 0 }, undefined, undefined);
  const sharedHourlyRef = upgInput(ur++, 'Shared kitchen hourly rate', 25, FMT_SGD, 'Typical SG shared/commercial kitchens: S$20–40/hr.');
  const sharedHoursRef = upgInput(ur++, 'Extra hours needed per batch', 1.5, '0.0#', 'Load-in, load-out, compliance cleaning.');
  const sharedFixedRef = upgInput(ur++, 'Shared kitchen fixed monthly fee', 150, FMT_SGD, 'Locker/storage/membership if applicable.');
  const batchesUpgRef = upgInput(ur++, 'Planned batches per month (upgraded)', 24, '0');
  const marginTargetRef = upgInput(ur++, 'Target margin (same as Pricing)', { formula: `'PRICING & PROFIT'!${marginInputRef}`, result: 0 }, '0%');

  ur += 1;
  ur = addSectionBand(upg, ur, 'SCENARIO COMPARISON', GREEN);

  // header
  const cmpHdr = ur;
  [['Scenario', 2], ['Cost/item', 3], ['Break-even items/month', 4], ['Notes', 5]].forEach(([h, col]) => {
    const hc = upg.getCell(cmpHdr, col);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: col === 2 ? 'left' : 'center', indent: col === 2 ? 1 : 0 };
  });
  upg.getRow(cmpHdr).height = 24;
  ur += 1;

  // Cross-sheet ref to monthly overhead total (LABOUR & OVERHEAD tab)
  const monthlyOverheadLookup = `'LABOUR & OVERHEAD'!${monthlyOverheadRef}`;

  // HOME row
  const homeRow = ur++;
  upg.getCell(homeRow, 2).value = 'A · Home (current)';
  upg.getCell(homeRow, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
  upg.getCell(homeRow, 2).alignment = { vertical: 'middle', indent: 1 };

  const hCostCell = upg.getCell(`C${homeRow}`);
  hCostCell.value = { formula: `'PRICING & PROFIT'!${costPerItemRef}`, result: 0 };
  hCostCell.numFmt = FMT_SGD; hCostCell.fill = solid(BLUE_TINT); hCostCell.border = thinBorder();
  hCostCell.alignment = { vertical: 'middle', horizontal: 'right' };

  const hBECell = upg.getCell(`D${homeRow}`);
  hBECell.value = { formula: `IF(AND('PRICING & PROFIT'!${actualPriceInputRef}-C${homeRow}>0,${monthlyOverheadLookup}>0),${monthlyOverheadLookup}/('PRICING & PROFIT'!${actualPriceInputRef}-C${homeRow}),"n/a")`, result: '' };
  hBECell.numFmt = '#,##0'; hBECell.fill = solid(BLUE_TINT); hBECell.border = thinBorder();
  hBECell.alignment = { vertical: 'middle', horizontal: 'right' };

  const hNote = upg.getCell(`E${homeRow}`);
  hNote.value = 'Items/month to cover your monthly overheads at your chosen price.';
  hNote.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  hNote.alignment = { vertical: 'middle', wrapText: true };

  // SHARED row
  const sharedRow = ur++;
  upg.getCell(sharedRow, 2).value = 'B · Shared kitchen';
  upg.getCell(sharedRow, 2).font = { ...FONT_BASE, color: { argb: NAVY } };
  upg.getCell(sharedRow, 2).alignment = { vertical: 'middle', indent: 1 };

  const sCostCell = upg.getCell(`C${sharedRow}`);
  sCostCell.value = {
    formula: `C${homeRow}+${sharedHourlyRef}*${sharedHoursRef}/MAX(1,'RECIPE COSTING'!${yieldRow})+${sharedFixedRef}/MAX(1,${batchesUpgRef}*'RECIPE COSTING'!${yieldRow})`,
    result: 0,
  };
  sCostCell.numFmt = FMT_SGD; sCostCell.fill = solid(BLUE_TINT); sCostCell.border = thinBorder();
  sCostCell.alignment = { vertical: 'middle', horizontal: 'right' };

  const sBECell = upg.getCell(`D${sharedRow}`);
  sBECell.value = {
    formula: `IF(('PRICING & PROFIT'!${actualPriceInputRef}-C${sharedRow})<=0,"price too low",(${sharedFixedRef}+${monthlyOverheadLookup})/('PRICING & PROFIT'!${actualPriceInputRef}-C${sharedRow}))`,
    result: '',
  };
  sBECell.numFmt = '#,##0'; sBECell.fill = solid(BLUE_TINT); sBECell.border = thinBorder();
  sBECell.alignment = { vertical: 'middle', horizontal: 'right' };

  const sNote = upg.getCell(`E${sharedRow}`);
  sNote.value = 'Adds hourly cost spread per item + fixed fee spread across planned output.';
  sNote.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  sNote.alignment = { vertical: 'middle', wrapText: true };

  // Verdict row
  const verdictRow = ur + 1;
  upg.mergeCells(verdictRow, 2, verdictRow, 5);
  const vd = upg.getCell(verdictRow, 2);
  vd.value = {
    formula: `IF(C${sharedRow}>='PRICING & PROFIT'!${actualPriceInputRef},"Upgrade NOT viable at current price — raise price or negotiate kitchen rates.",IF(C${sharedRow}<='PRICING & PROFIT'!${actualPriceInputRef}*(1-${marginTargetRef}),"Upgrade CAN hold your target margin at current price.","Upgrade possible but margin shrinks below target — needs higher price or volume."))`,
    result: '',
  };
  vd.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  vd.fill = solid(ORANGE_SOFT);
  vd.border = thinBorder();
  vd.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  upg.getRow(verdictRow).height = 32;

  // ========================================================================
  // TAB 7 — SOURCES & NOTES
  // ========================================================================
  const src = wb.addWorksheet('SOURCES & NOTES', {
    properties: { tabColor: { argb: GREY_TEXT } },
    views: [{ showGridLines: false }],
  });
  src.getColumn(1).width = 3;
  src.getColumn(2).width = 34;
  src.getColumn(3).width = 92;

  let sr = addTitleBanner(src, 1, 'SOURCES, ASSUMPTIONS & NOTES', 'Official references and assumption disclosures for this calculator.');

  const sources = [
    { category: 'Regulatory Context (verify current rules)', items: [
      'SFA — Home-Based Food Businesses guidance (small-scale, for household income): https://www.sfa.gov.sg/',
      'URA/HDB — home use rules for private residential and HDB premises; no employment of external staff for HDB home businesses.',
      'NEA — environmental hygiene expectations for food preparation at home.',
      'IRAS — income from side businesses may be taxable; keep records. https://www.iras.gov.sg/',
      'Rules evolve — always confirm on official portals before scaling up.',
    ]},
    { category: 'Pricing Assumptions Used', items: [
      'Ingredient prices: typical Singapore supermarket (NTUC FairPrice) shelf prices, 2026 examples.',
      'Labour rate default S$18/hr — a placeholder for YOUR opportunity cost; adjust freely.',
      'Utilities per batch estimated from typical domestic oven usage (~S$2.50–3.00).',
      'Equipment depreciation: straight-line over ~36 months of moderate home use.',
      'Packaging: simple kraft box + liner ≈ S$0.25/piece in bulk.',
      'Target margin default 45%; common sustainable range for micro-bakeries: 40–60%.',
    ]},
    { category: 'Method Notes', items: [
      'Cost per usable unit converts kg→g and L→ml (×1000) so recipe quantities in g/ml price correctly.',
      'Overheads are allocated per batch via planned monthly batches; update that number as reality lands.',
      'The upgrade scenario spreads hourly kitchen rates across one batch\'s yield, and fixed monthly fees across planned monthly output.',
      'Break-even items/month = fixed monthly costs ÷ contribution per item.',
    ]},
    { category: 'Disclaimers', items: [
      'Planning tool only — NOT financial, tax or legal advice.',
      'Prices and rules change; validate assumptions against your own receipts and official sites.',
      'Profit projections assume steady demand; real months vary.',
    ]},
  ];

  sources.forEach((section) => {
    sr = addSectionBand(src, sr, section.category, BLUE, 3);
    section.items.forEach((item) => {
      src.mergeCells(sr, 2, sr, 3);
      const cc = src.getCell(sr, 2);
      cc.value = `• ${item}`;
      cc.font = { ...FONT_BASE, size: 10, color: { argb: NAVY } };
      cc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
      src.getRow(sr).height = Math.max(18, 16 * Math.ceil(item.length / 90));
      sr += 1;
    });
    sr += 1;
  });

  // ------------------------------------------------------------------------
  // Protect sheets: leave only yellow INPUT cells editable.
  // ------------------------------------------------------------------------
  const protectOpts = {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertRows: false,
    insertColumns: false,
    deleteRows: false,
    deleteColumns: false,
    sort: false,
    autoFilter: false,
  };

  // Unlock all yellow input cells
  function unlock(ws, addresses) {
    addresses.forEach((a) => ws.getCell(a).protection = { locked: false });
  }

  unlock(ing, []);
  for (let i = 0; i < exampleIngredients.length; i++) {
    const rowIdx = ingFirstDataRow + i;
    ['B','C','D','E','G'].forEach(col => unlock(ing, [`${col}${rowIdx}`]));
  }
  for (let i = 0; i < extraRows; i++) {
    const rowIdx = ingFirstDataRow + exampleIngredients.length + i;
    ['B','C','D','E','G'].forEach(col => unlock(ing, [`${col}${rowIdx}`]));
  }

  for (let i = 0; i < recipeLines.length; i++) {
    unlock(rec, [`C${recipeFirstRow + i}`]);
  }
  unlock(rec, [`C${yieldRow}`, `C${pkgPerItemRow}`]);

  unlock(lab, [hourlyRateRef, batchHoursRef, elecPerBatchRef, equipMonthlyRef, otherMonthlyRef, batchesMonthRef]);

  unlock(price, [marginInputRef, actualPriceInputRef, volInputRef]);

  unlock(upg, [sharedHourlyRef, sharedHoursRef, sharedFixedRef, batchesUpgRef]);

  for (const ws of [start, ing, rec, lab, price, upg, src]) {
    await ws.protect('', protectOpts);
  }

  // ------------------------------------------------------------------------
  // Write file
  // ------------------------------------------------------------------------
  const outDir = path.join(__dirname, '..', 'digital-products', 'home-bakery-calculator');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'singapore-home-bakery-pricing-profit-calculator-2026.xlsx');
  const buffer = await wb.xlsx.writeBuffer();
  fs.writeFileSync(outFile, Buffer.from(buffer));
  console.log(`Workbook written: ${outFile}`);
  console.log(`Sheets: ${wb.worksheets.map(w => w.name).join(' | ')}`);
  console.log(`Recipe total row: E${totRow} | Yield C${yieldRow} | Packaging C${pkgBatchRow}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});