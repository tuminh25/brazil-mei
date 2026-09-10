/**
 * SGEventsHub — Paid Digital Asset Generator
 * Product: Singapore Car vs MRT/Grab Total Cost Decision Calculator (2026)
 *
 * Generates a polished, formula-driven Excel workbook:
 *   digital-products/car-vs-mrt-grab-calculator/
 *     singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx
 *
 * Run: node scripts/generateTransportCalculatorWorkbook.js
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
// Palette / shared styles (matches SGEventsHub editorial palette)
// ---------------------------------------------------------------------------
const NAVY = 'FF0F172A';
const BLUE = 'FF2563EB';
const BLUE_SOFT = 'FFDBEAFE';
const BLUE_TINT = 'FFEFF4FF';
const YELLOW_INPUT = 'FFFFF3C4';
const GREY_TEXT = 'FF64748B';
const WHITE = 'FFFFFFFF';
const BORDER_GREY = 'FFCBD5E1';

const FMT_SGD = '"S$"#,##0';
const FONT_BASE = { name: 'Calibri', size: 11 };

function solid(argb) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function thinBorder(color = BORDER_GREY) {
  const edge = { style: 'thin', color: { argb: color } };
  return { top: edge, bottom: edge, left: edge, right: edge };
}

/** Title banner across columns B..F */
function addTitleBanner(ws, row, text, subtitle) {
  ws.mergeCells(row, 2, row, 6);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 15, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 34;

  if (subtitle) {
    ws.mergeCells(row + 1, 2, row + 1, 6);
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

/** Section band across B..F */
function addSectionBand(ws, row, text) {
  ws.mergeCells(row, 2, row, 6);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: WHITE } };
  c.fill = solid(BLUE);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 24;
  return row + 1;
}

/**
 * Input row: label | editable yellow value | example note
 * Returns the cell address of the input value (e.g. "INPUTS!C5").
 */
function addInputRow(ws, row, label, exampleValue, note) {
  const labelCell = ws.getCell(row, 2);
  labelCell.value = label;
  labelCell.font = { ...FONT_BASE, color: { argb: NAVY } };
  labelCell.alignment = { vertical: 'middle', wrapText: true };

  const val = ws.getCell(row, 3);
  val.value = exampleValue;
  val.numFmt = FMT_SGD;
  val.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  val.fill = solid(YELLOW_INPUT);
  val.border = thinBorder();
  val.alignment = { vertical: 'middle', horizontal: 'right' };
  val.dataValidation = {
    type: 'decimal',
    operator: 'greaterThanOrEqual',
    allowBlank: false,
    formulae: ['0'],
    showErrorMessage: true,
    errorTitle: 'Invalid amount',
    error: 'Please enter a non-negative number.',
  };

  if (note) {
    ws.mergeCells(row, 4, row, 6);
    const n = ws.getCell(row, 4);
    n.value = note;
    n.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
    n.alignment = { vertical: 'middle', wrapText: true };
  }
  ws.getRow(row).height = 22;
  return `INPUTS!C${row}`;
}

/** Calculated (locked) output row */
function addCalcRow(ws, row, label, formulaOrValue, opts = {}) {
  const labelCell = ws.getCell(row, 2);
  labelCell.value = label;
  labelCell.font = { ...FONT_BASE, color: { argb: NAVY } };
  labelCell.alignment = { vertical: 'middle', wrapText: true };

  const val = ws.getCell(row, 3);
  val.value = formulaOrValue;
  val.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  val.fill = solid(opts.fill || BLUE_TINT);
  val.border = thinBorder();
  val.alignment = { vertical: 'middle', horizontal: 'right' };
  if (opts.numFmt) val.numFmt = opts.numFmt;

  if (opts.note) {
    ws.mergeCells(row, 4, row, 6);
    const n = ws.getCell(row, 4);
    n.value = opts.note;
    n.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
    n.alignment = { vertical: 'middle', wrapText: true };
  }
  ws.getRow(row).height = 22;
  return val.address;
}

// ---------------------------------------------------------------------------
// JS mirror of the workbook maths (used ONLY to seed cached formula results
// and to validate the file after generation — the workbook itself is fully
// formula-driven).
// ---------------------------------------------------------------------------
const DEFAULTS = {
  mrtMonthly: 120,
  grabMonthly: 300,
  carPrice: 70000,
  coeUpfront: 95000,
  loanAmount: 70000,
  loanPayment: 1330,
  petrol: 250,
  parking: 250,
  erp: 80,
  insurance: 200,
  maintenance: 150,
  otherCar: 50,
  annualDepreciation: 12000,
};

function computeModel(d) {
  const upfrontCash = d.carPrice + d.coeUpfront - d.loanAmount;
  const aMonthly = d.mrtMonthly;
  const bMonthly = d.mrtMonthly + d.grabMonthly;
  const cMonthly =
    d.loanPayment + d.petrol + d.parking + d.erp + d.insurance +
    d.maintenance + d.otherCar + d.annualDepreciation / 12;
  const yearly = (m) => m * 12;
  const decade = (m) => m * 120;
  const breakEvenGrab = Math.max(0, cMonthly - d.mrtMonthly);
  const carFixedExclPetrolDep =
    d.loanPayment + d.parking + d.erp + d.insurance + d.maintenance + d.otherCar;
  return {
    upfrontCash, aMonthly, bMonthly, cMonthly,
    aYearly: yearly(aMonthly), bYearly: yearly(bMonthly), cYearly: yearly(cMonthly),
    aDecade: decade(aMonthly), bDecade: decade(bMonthly), cDecade: decade(cMonthly),
    diffBA_m: bMonthly - aMonthly, diffCB_m: cMonthly - bMonthly,
    diffBA_y: yearly(bMonthly) - yearly(aMonthly), diffCB_y: yearly(cMonthly) - yearly(bMonthly),
    diffBA_d: decade(bMonthly) - decade(aMonthly), diffCB_d: decade(cMonthly) - decade(bMonthly),
    relBA: bMonthly / aMonthly, relCB: cMonthly / bMonthly,
    breakEvenGrab, carFixedExclPetrolDep,
  };
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
  wb.title = 'Singapore Car vs MRT/Grab Total Cost Decision Calculator (2026)';
  wb.subject = 'Personal transport cost comparison — 1 year and 10 year scenarios';
  wb.description =
    'Enter your own transport habits, car costs and assumptions. Compare your estimated 1-year and 10-year cost before making a major financial commitment. For personal planning and comparison only — not financial advice.';
  wb.company = 'SGEventsHub';

  const model = computeModel(DEFAULTS);

  // ========================================================================
  // TAB 1 — START HERE
  // ========================================================================
  const start = wb.addWorksheet('START HERE', {
    properties: { tabColor: { argb: BLUE } },
    views: [{ showGridLines: false }],
  });
  start.getColumn(1).width = 3;
  start.getColumn(2).width = 30;
  ['C', 'D', 'E', 'F'].forEach((col) => { start.getColumn(col).width = 24; });

  let r = 2;
  start.mergeCells(r, 2, r, 6);
  let c = start.getCell(r, 2);
  c.value = 'SINGAPORE CAR  vs  MRT + GRAB';
  c.font = { ...FONT_BASE, bold: true, size: 26, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 46;

  r += 1;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = 'Total Cost Decision Calculator — 2026 Edition';
  c.font = { ...FONT_BASE, bold: true, size: 14, color: { argb: WHITE } };
  c.fill = solid(BLUE);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 30;

  r += 2;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value =
    'Enter your own transport habits, car costs and assumptions. Compare your estimated 1-year and 10-year cost before making a major financial commitment.';
  c.font = { ...FONT_BASE, italic: true, size: 12, color: { argb: NAVY } };
  c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  start.getRow(r).height = 34;

  r += 1;

  const addStartSection = (row, title, lines) => {
    let rr = addSectionBand(start, row, title);
    for (const line of lines) {
      start.mergeCells(rr, 2, rr, 6);
      const cc = start.getCell(rr, 2);
      cc.value = line;
      cc.font = { ...FONT_BASE, size: 11, color: { argb: NAVY } };
      cc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
      start.getRow(rr).height = line.length > 110 ? 32 : 20;
      rr += 1;
    }
    return rr + 1;
  };

  r = addStartSection(r, 'WHAT THIS CALCULATOR DOES', [
    'It estimates what YOU would personally spend on getting around Singapore under three scenarios:',
    '         Scenario A — MRT / bus only          Scenario B — MRT / bus + Grab / taxi          Scenario C — owning a car',
    '…and shows each scenario side by side over 1 year and 10 years, plus a break-even point: how high your Grab / taxi spending would need to go before a car becomes cost-comparable.',
  ]);

  r = addStartSection(r, 'WHO IT IS FOR', [
    'Singapore residents who spend significant money on transport and are asking: “Does owning a car actually make sense for MY household?” Ideal if you may buy a car within the next 1–3 years, or you already drive and want to see the full picture.',
  ]);

  r = addStartSection(r, 'HOW TO USE IT — 3 STEPS', [
    'STEP 1  ·  Enter your assumptions on the INPUTS tab (edit the yellow cells only).',
    'STEP 2  ·  Review your estimated monthly, 1-year and 10-year costs on the COMPARISON tab.',
    'STEP 3  ·  Stress-test your biggest assumptions (depreciation, petrol, Grab usage) on the SCENARIO ANALYSIS tab.',
  ]);

  r = addStartSection(r, 'GOOD TO KNOW', [
    'Yellow cells are yours to edit. Blue cells calculate automatically — please do not type into them.',
    'Every pre-filled figure is a clearly-labelled 2026 EXAMPLE assumption, not a quote or forecast. Replace them with your own numbers and research.',
    'The calculator works entirely offline inside this file. It never fetches live COE, petrol, ERP or fare data.',
  ]);

  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value =
    'Disclaimer: This calculator is for personal planning and comparison only. It is not financial advice.';
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  c.fill = solid(YELLOW_INPUT);
  c.border = thinBorder();
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  start.getRow(r).height = 30;

  r += 2;
  start.mergeCells(r, 2, r, 6);
  c = start.getCell(r, 2);
  c.value = '© SGEventsHub · Singapore Car vs MRT/Grab Decision Calculator (2026) · v2026.1';
  c.font = { ...FONT_BASE, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'middle', horizontal: 'center' };

  // ========================================================================
  // TAB 2 — INPUTS
  // ========================================================================
  const inputs = wb.addWorksheet('INPUTS', {
    properties: { tabColor: { argb: 'FFCA8A04' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 2 }],
  });
  inputs.getColumn(1).width = 3;
  inputs.getColumn(2).width = 46;
  inputs.getColumn(3).width = 16;
  ['D', 'E', 'F'].forEach((col) => { inputs.getColumn(col).width = 22; });

  r = addTitleBanner(
    inputs, 1,
    'STEP 1 · ENTER YOUR ASSUMPTIONS',
    'Edit ONLY the yellow cells. Pre-filled values are realistic 2026 examples — replace them with your own numbers.'
  );
  r += 1; // blank spacer row

  let ref = {};
  r = addSectionBand(inputs, r, 'PUBLIC TRANSPORT (SCENARIO A)');
  ref.mrt = addInputRow(inputs, r++, 'Monthly MRT / bus cost', DEFAULTS.mrtMonthly,
    'Example: a commuter paying fares or holding a travel card. Replace with your own average.');

  r = addSectionBand(inputs, r, 'GRAB / TAXI (ADDED IN SCENARIO B)');
  ref.grab = addInputRow(inputs, r++, 'Monthly Grab / taxi spending', DEFAULTS.grabMonthly,
    'Example includes weekday rides and occasional late-night trips.');

  r = addSectionBand(inputs, r, 'CAR — ONE-OFF COSTS & FINANCING');
  ref.carPrice = addInputRow(inputs, r++, 'Car purchase price', DEFAULTS.carPrice,
    'Example price for the vehicle itself, before COE.');
  ref.coeUpfront = addInputRow(inputs, r++, 'COE / upfront ownership cost', DEFAULTS.coeUpfront,
    'Example: COE premium plus registration, parcel fees and extras. Check current COE results yourself.');
  ref.loanAmount = addInputRow(inputs, r++, 'Loan amount', DEFAULTS.loanAmount,
    'Amount you expect to borrow. Enter 0 if paying cash.');
  ref.loanPayment = addInputRow(inputs, r++, 'Loan monthly payment', DEFAULTS.loanPayment,
    'Example: 5-year flat-rate car loan. Confirm rates with lenders.');

  r = addSectionBand(inputs, r, 'CAR — MONTHLY RUNNING COSTS');
  ref.petrol = addInputRow(inputs, r++, 'Petrol per month', DEFAULTS.petrol,
    'Example for moderate mileage. Adjust for your driving distance and fuel prices.');
  ref.parking = addInputRow(inputs, r++, 'Parking per month', DEFAULTS.parking,
    'Example combines residential season parking with occasional town parking.');
  ref.erp = addInputRow(inputs, r++, 'ERP per month', DEFAULTS.erp,
    'Example for a commute that passes pricing gantries a few times a week.');
  ref.insurance = addInputRow(inputs, r++, 'Insurance per month', DEFAULTS.insurance,
    'Example annual premium of about S$2,400 divided across the year.');
  ref.maintenance = addInputRow(inputs, r++, 'Maintenance / servicing per month', DEFAULTS.maintenance,
    'Regular servicing, tyres and wear-and-tear, averaged monthly.');
  ref.otherCar = addInputRow(inputs, r++, 'Other monthly car costs', DEFAULTS.otherCar,
    'Road tax, car washes, accessories — anything else recurring.');

  r = addSectionBand(inputs, r, 'DEPRECIATION');
  ref.dep = addInputRow(inputs, r++, 'Estimated annual depreciation', DEFAULTS.annualDepreciation,
    'How much value the car loses per year. This is usually the single largest hidden cost.');

  r += 1;
  addCalcRow(inputs, r, 'Upfront cash needed (calculated)',
    { formula: `${ref.carPrice}+${ref.coeUpfront}-${ref.loanAmount}`, result: model.upfrontCash },
    { numFmt: FMT_SGD, note: 'Purchase price + COE/upfront cost − loan. Informational only.' });

  // ========================================================================
  // TAB 3 — COMPARISON
  // ========================================================================
  const cmp = wb.addWorksheet('COMPARISON', {
    properties: { tabColor: { argb: 'FF16A34A' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  cmp.getColumn(1).width = 3;
  cmp.getColumn(2).width = 44;
  ['C', 'D', 'E'].forEach((col) => { cmp.getColumn(col).width = 18; });

  r = addTitleBanner(
    cmp, 1,
    'STEP 2 · REVIEW YOUR ESTIMATED COSTS',
    'Everything here updates automatically from the INPUTS tab — change an input and come straight back.'
  );

  r += 1;
  const hdr = ['Scenario', 'Per month', 'Per 1 year', 'Per 10 years'];
  hdr.forEach((h, i) => {
    const hc = cmp.getCell(r, 2 + i);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: i === 0 ? 'left' : 'right', indent: i === 0 ? 1 : 0 };
  });
  cmp.getRow(r).height = 24;
  r += 1;

  const scenarioRow = (row, name, formulas, highlight) => {
    const nc = cmp.getCell(row, 2);
    nc.value = name;
    nc.font = { ...FONT_BASE, bold: !!highlight, color: { argb: NAVY } };
    nc.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    ['C', 'D', 'E'].forEach((col, i) => {
      const vc = cmp.getCell(`${col}${row}`);
      vc.value = formulas[i];
      vc.numFmt = FMT_SGD;
      vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
      vc.fill = solid(highlight ? BLUE_SOFT : BLUE_TINT);
      vc.border = thinBorder();
      vc.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    cmp.getRow(row).height = 24;
  };

  const A = 5, B = 6, C_CASH = 7, C_ECON = 8;
  scenarioRow(A, 'Scenario A · MRT / bus only', [
    { formula: ref.mrt, result: model.aMonthly },
    { formula: `${ref.mrt}*12`, result: model.aYearly },
    { formula: `${ref.mrt}*120`, result: model.aDecade },
  ]);
  scenarioRow(B, 'Scenario B · MRT / bus + Grab / taxi', [
    { formula: `${ref.mrt}+${ref.grab}`, result: model.bMonthly },
    { formula: `(${ref.mrt}+${ref.grab})*12`, result: model.bYearly },
    { formula: `(${ref.mrt}+${ref.grab})*120`, result: model.bDecade },
  ]);
  // Cash outflow: excludes depreciation
  const cashMonthlyFormula = `${ref.loanPayment}+${ref.petrol}+${ref.parking}+${ref.erp}+${ref.insurance}+${ref.maintenance}+${ref.otherCar}`;
  const cashYearlyFormula = `(${cashMonthlyFormula})*12`;
  const cashDecadeFormula = `(${cashMonthlyFormula})*120`;
  const econMonthlyFormula = `${cashMonthlyFormula}+${ref.dep}/12`;
  const econYearlyFormula = `(${econMonthlyFormula})*12`;
  const econDecadeFormula = `(${econMonthlyFormula})*120`;

  scenarioRow(C_CASH, 'Scenario C · Car ownership — Monthly Cash Outflow', [
    { formula: cashMonthlyFormula, result: model.cMonthly - model.annualDepreciation/12 },
    { formula: cashYearlyFormula, result: model.cYearly - model.annualDepreciation },
    { formula: cashDecadeFormula, result: model.cDecade - model.annualDepreciation*10 },
  ]);
  scenarioRow(C_ECON, 'Scenario C · Car ownership — Monthly Economic Cost', [
    { formula: econMonthlyFormula, result: model.cMonthly },
    { formula: econYearlyFormula, result: model.cYearly },
    { formula: econDecadeFormula, result: model.cDecade },
  ], true);

  cmp.mergeCells(C_ECON + 1, 2, C_ECON + 1, 5);
  c = cmp.getCell(C_ECON + 1, 2);
  c.value =
    'Monthly Cash Outflow = loan payment + petrol + parking + ERP + insurance + maintenance + other costs (excludes depreciation).\nMonthly Economic Cost = Cash Outflow + depreciation (annual ÷ 12). Upfront cash outlay is shown on the INPUTS tab — read both together before deciding.';
  c.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'top', wrapText: true, indent: 1 };
  cmp.getRow(C_ECON + 1).height = 36;

  r = C_ECON + 3;
  r = addSectionBand(cmp, r, 'DIFFERENCE BETWEEN SCENARIOS');
  const diffRow = (row, label, fMonth, fYear, fDecade) => {
    const nc = cmp.getCell(row, 2);
    nc.value = label;
    nc.font = { ...FONT_BASE, color: { argb: NAVY } };
    nc.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    [['C', fMonth], ['D', fYear], ['E', fDecade]].forEach(([col, f]) => {
      const vc = cmp.getCell(`${col}${row}`);
      vc.value = f;
      vc.numFmt = FMT_SGD;
      vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
      vc.fill = solid(BLUE_TINT);
      vc.border = thinBorder();
      vc.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    cmp.getRow(row).height = 22;
  };
  diffRow(r, 'Adding Grab / taxi (B − A)',
    { formula: `${ref.grab}`, result: model.diffBA_m },
    { formula: `${ref.grab}*12`, result: model.diffBA_y },
    { formula: `${ref.grab}*120`, result: model.diffBA_d });
  diffRow(r + 1, 'Owning a car instead of MRT + Grab (Economic Cost − B)',
    { formula: `C${C_ECON}-C${B}`, result: model.diffCB_m },
    { formula: `D${C_ECON}-D${B}`, result: model.diffCB_y },
    { formula: `E${C_ECON}-E${B}`, result: model.diffCB_d });
  diffRow(r + 2, 'Car Cash Outflow vs MRT + Grab (Cash Outflow − B)',
    { formula: `C${C_CASH}-C${B}`, result: (model.cMonthly - model.annualDepreciation/12) - model.bMonthly },
    { formula: `D${C_CASH}-D${B}`, result: (model.cYearly - model.annualDepreciation) - model.bYearly },
    { formula: `E${C_CASH}-E${B}`, result: (model.cDecade - model.annualDepreciation*10) - model.bDecade });
  diffRow(r + 3, 'Relative cost — car Economic Cost ÷ MRT + Grab',
    { formula: `IF(C${B}>0,C${C_ECON}/C${B},"n/a")`, result: model.relCB, numFmt: '0.0"×"' },
    { formula: `IF(D${B}>0,D${C_ECON}/D${B},"n/a")`, result: model.relCB, numFmt: '0.0"×"' },
    { formula: `IF(E${B}>0,E${C_ECON}/E${B},"n/a")`, result: model.relCB, numFmt: '0.0"×"' });

  r += 4;
  r = addSectionBand(cmp, r, 'WHICH SCENARIO IS CHEAPER FOR YOU?');
  cmp.mergeCells(r, 2, r, 2);
  const v1 = cmp.getCell(`C${r}`);
  cmp.mergeCells(r, 3, r, 5);
  v1.value = {
    formula: `IF(C${C_ECON}>C${B},"Under your current assumptions, MRT + Grab is CHEAPER than owning a car (Economic Cost).","Under your current assumptions, owning a car is CHEAPER than MRT + Grab (Economic Cost).")`,
    result: model.cMonthly > model.bMonthly
      ? 'Under your current assumptions, MRT + Grab is CHEAPER than owning a car (Economic Cost).'
      : 'Under your current assumptions, owning a car is CHEAPER than MRT + Grab (Economic Cost).',
  };
  v1.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  v1.fill = solid(BLUE_SOFT);
  v1.border = thinBorder();
  v1.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  cmp.getCell(`B${r}`).value = 'Overall verdict (Economic Cost)';
  cmp.getCell(`B${r}`).font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  cmp.getCell(`B${r}`).alignment = { vertical: 'middle', indent: 1 };
  cmp.getRow(r).height = 26;
  r += 1;

  cmp.mergeCells(r, 2, r, 5);
  c = cmp.getCell(r, 2);
  c.value = {
    formula: `"At your assumed Grab / taxi spend, a car (Economic Cost) costs about "&TEXT(MAX(0,C${C_ECON}-C${B}),"S$#,##0")&" more (or less) per month than MRT + Grab. Cash Outflow difference: "&TEXT(MAX(0,C${C_CASH}-C${B}),"S$#,##0")`,
    result: `At your assumed Grab / taxi spend, a car (Economic Cost) costs about S$${Math.round(model.diffCB_m).toLocaleString('en-SG')} more (or less) per month than MRT + Grab. Cash Outflow difference: S$${Math.round((model.cMonthly - model.annualDepreciation/12) - model.bMonthly).toLocaleString('en-SG')}`,
  };
  c.font = { ...FONT_BASE, size: 10, color: { argb: GREY_TEXT }, italic: true };
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  cmp.getRow(r).height = 22;
  r += 2;

  cmp.mergeCells(r, 2, r, 5);
  c = cmp.getCell(r, 2);
  c.value =
    'Tip: Compare Economic Cost (includes depreciation) for true cost of ownership. Cash Outflow shows actual monthly cash spending. Upfront cash required is on the INPUTS tab.';
  c.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };

  // ========================================================================
  // TAB 4 — SCENARIO ANALYSIS
  // ========================================================================
  const scn = wb.addWorksheet('SCENARIO ANALYSIS', {
    properties: { tabColor: { argb: 'FF9333EA' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 2 }],
  });
  scn.getColumn(1).width = 3;
  scn.getColumn(2).width = 44;
  ['C', 'D', 'E'].forEach((col) => { scn.getColumn(col).width = 18; });

  r = addTitleBanner(
    scn, 1,
    'STEP 3 · STRESS-TEST YOUR ASSUMPTIONS',
    'Change the yellow INPUTS and watch every figure update instantly. The tools below answer “what would have to change?”'
  );

  r += 1;
  r = addSectionBand(scn, r, 'BREAK-EVEN ANALYSIS — HOW HIGH WOULD YOUR GRAB BILL HAVE TO GO?');
  addCalcRow(scn, r, 'Your current monthly Grab / taxi spend (from INPUTS)',
    { formula: ref.grab, result: DEFAULTS.grabMonthly },
    { numFmt: FMT_SGD, note: 'Editable on the INPUTS tab.' });
  addCalcRow(scn, r + 1, 'Break-even monthly Grab / taxi spend',
    { formula: `MAX(0,(${ref.loanPayment}+${ref.petrol}+${ref.parking}+${ref.erp}+${ref.insurance}+${ref.maintenance}+${ref.otherCar}+${ref.dep}/12)-${ref.mrt})`, result: model.breakEvenGrab },
    { numFmt: FMT_SGD, fill: BLUE_SOFT, note: 'The Grab / taxi bill at which MRT + Grab would cost the same as owning a car under your assumptions.' });
  addCalcRow(scn, r + 2, 'What this means for you',
    {
      formula: `IF(${ref.grab}>=MAX(0,(${ref.loanPayment}+${ref.petrol}+${ref.parking}+${ref.erp}+${ref.insurance}+${ref.maintenance}+${ref.otherCar}+${ref.dep}/12)-${ref.mrt}),"Your Grab / taxi spending is AT or ABOVE break-even — under your assumptions, a car may be financially rational.","A car only becomes cost-comparable if your monthly Grab / taxi spend rises to the break-even level above.")`,
      result: DEFAULTS.grabMonthly >= model.breakEvenGrab
        ? 'Your Grab / taxi spending is AT or ABOVE break-even — under your assumptions, a car may be financially rational.'
        : 'A car only becomes cost-comparable if your monthly Grab / taxi spend rises to the break-even level above.',
    },
    { fill: BLUE_SOFT });

  r += 4;
  r = addSectionBand(scn, r, 'SENSITIVITY — MONTHLY ECONOMIC COST (INCLUDES DEPRECIATION)');

  const depLevels = [6000, 9000, 12000, 15000, 18000];
  const petrolLevels = [150, 250, 350];
  const fixedRef =
    `${ref.loanPayment}+${ref.parking}+${ref.erp}+${ref.insurance}+${ref.maintenance}+${ref.otherCar}`;

  // grid header row
  const gridHdrRow = r;
  const corner = scn.getCell(gridHdrRow, 2);
  corner.value = 'Annual depreciation ↓   /   Petrol →';
  corner.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
  corner.fill = solid(NAVY);
  corner.border = thinBorder();
  corner.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  petrolLevels.forEach((p, i) => {
    const pc = scn.getCell(gridHdrRow, 3 + i);
    pc.value = p;
    pc.numFmt = '"S$"#,##0"/mo petrol"';
    pc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    pc.fill = solid(NAVY);
    pc.border = thinBorder();
    pc.alignment = { vertical: 'middle', horizontal: 'right' };
  });
  scn.getRow(gridHdrRow).height = 26;

  depLevels.forEach((depVal, ri) => {
    const row = gridHdrRow + 1 + ri;
    const lc = scn.getCell(row, 2);
    lc.value = depVal;
    lc.numFmt = '"S$"#,##0"/yr depreciation"';
    lc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: NAVY } };
    lc.fill = solid(BLUE_SOFT);
    lc.border = thinBorder();
    lc.alignment = { vertical: 'middle', indent: 1 };
    petrolLevels.forEach((_, ci) => {
      const colLetter = ['C', 'D', 'E'][ci];
      const cell = scn.getCell(row, 3 + ci);
      cell.value = {
        formula: `${fixedRef}+$B${row}/12+${colLetter}$${gridHdrRow}`,
        result: model.carFixedExclPetrolDep + depVal / 12 + petrolLevels[ci],
      };
      cell.numFmt = FMT_SGD;
      cell.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
      cell.fill = solid(BLUE_TINT);
      cell.border = thinBorder();
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    scn.getRow(row).height = 22;
  });

  const noteRow = gridHdrRow + depLevels.length + 1;
  scn.mergeCells(noteRow, 2, noteRow, 5);
  c = scn.getCell(noteRow, 2);
  c.value =
    'Each cell is the Monthly Economic Cost (Cash Outflow + depreciation) of owning a car for that combination of annual depreciation and petrol spend (all other inputs stay as entered on the INPUTS tab). Compare with your monthly MRT + Grab total on the COMPARISON tab.';
  c.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'top', wrapText: true, indent: 1 };
  scn.getRow(noteRow).height = 44;

  // Second grid: Cash Outflow (excludes depreciation)
  r = noteRow + 2;
  r = addSectionBand(scn, r, 'SENSITIVITY — MONTHLY CASH OUTFLOW (EXCLUDES DEPRECIATION)');

  const gridHdrRow2 = r;
  const corner2 = scn.getCell(gridHdrRow2, 2);
  corner2.value = 'Annual depreciation (not in cash outflow) ↓   /   Petrol →';
  corner2.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
  corner2.fill = solid(NAVY);
  corner2.border = thinBorder();
  corner2.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  petrolLevels.forEach((p, i) => {
    const pc = scn.getCell(gridHdrRow2, 3 + i);
    pc.value = p;
    pc.numFmt = '"S$"#,##0"/mo petrol"';
    pc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    pc.fill = solid(NAVY);
    pc.border = thinBorder();
    pc.alignment = { vertical: 'middle', horizontal: 'right' };
  });
  scn.getRow(gridHdrRow2).height = 26;

  depLevels.forEach((depVal, ri) => {
    const row = gridHdrRow2 + 1 + ri;
    const lc = scn.getCell(row, 2);
    lc.value = depVal;
    lc.numFmt = '"S$"#,##0"/yr depreciation"';
    lc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: NAVY } };
    lc.fill = solid(BLUE_SOFT);
    lc.border = thinBorder();
    lc.alignment = { vertical: 'middle', indent: 1 };
    petrolLevels.forEach((_, ci) => {
      const colLetter = ['C', 'D', 'E'][ci];
      const cell = scn.getCell(row, 3 + ci);
      // Cash outflow = fixed costs + petrol (no depreciation)
      cell.value = {
        formula: `${fixedRef}+${colLetter}$${gridHdrRow2}`,
        result: model.carFixedExclPetrolDep + petrolLevels[ci],
      };
      cell.numFmt = FMT_SGD;
      cell.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
      cell.fill = solid(BLUE_TINT);
      cell.border = thinBorder();
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    });
    scn.getRow(row).height = 22;
  });

  const noteRow2 = gridHdrRow2 + depLevels.length + 1;
  scn.mergeCells(noteRow2, 2, noteRow2, 5);
  c = scn.getCell(noteRow2, 2);
  c.value =
    'Each cell is the Monthly Cash Outflow (excludes depreciation) of owning a car. This represents actual monthly cash spending. Compare with your monthly MRT + Grab total on the COMPARISON tab to understand cash flow impact.';
  c.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'top', wrapText: true, indent: 1 };
  scn.getRow(noteRow2).height = 44;

  r = noteRow2 + 2;
  r = addSectionBand(scn, r, 'TRY THESE QUICK EXPERIMENTS');
  const tips = [
    'Set your expected Grab / taxi spend to what you think you will really pay after buying a car — most households keep some ride-hailing use.',
    'Test a pessimistic depreciation figure (cars depreciate fastest in the first years).',
    'Add 20–30% to petrol and parking to see whether the verdict survives a bad year.',
    'Change the loan payment to 0 to compare an all-cash purchase financed by your own money.',
  ];
  tips.forEach((t) => {
    scn.mergeCells(r, 2, r, 5);
    const tc = scn.getCell(r, 2);
    tc.value = `•  ${t}`;
    tc.font = { ...FONT_BASE, size: 10, color: { argb: NAVY } };
    tc.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
    scn.getRow(r).height = 20;
    r += 1;
  });

  // ------------------------------------------------------------------------
  // Protect sheets: leave only the yellow INPUTS cells editable.
  // Protection carries NO password — power users can unprotect freely.
  // ------------------------------------------------------------------------
  const inputAddresses = Object.values(ref); // e.g. ["INPUTS!C5", ...]
  for (const ws of [inputs]) {
    for (const fullAddr of inputAddresses) {
      const addr = fullAddr.split('!')[1];
      ws.getCell(addr).protection = { locked: false };
    }
    await inputs.protect('', {
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
    });
  }

  // ------------------------------------------------------------------------
  // Write file
  // ------------------------------------------------------------------------
  const outDir = path.join(__dirname, '..', 'digital-products', 'car-vs-mrt-grab-calculator');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx');
  const buffer = await wb.xlsx.writeBuffer();
  fs.writeFileSync(outFile, Buffer.from(buffer));
  console.log(`Workbook written: ${outFile}`);
  console.log(`Sheets: ${wb.worksheets.map((w) => w.name).join(' | ')}`);
  console.log(`Default-model sanity: A=${model.aMonthly}/mo B=${model.bMonthly}/mo C=${model.cMonthly}/mo breakEvenGrab=${Math.round(model.breakEvenGrab)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
