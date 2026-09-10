const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const OUTPUT = 'digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx';

const STYLE = {
  title: { font: { name: 'Calibri', size: 18, bold: true, color: { argb: '1F2937' } } },
  subtitle: { font: { name: 'Calibri', size: 11, italic: true, color: { argb: '6B7280' } } },
  sectionHeader: {
    font: { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } },
    alignment: { vertical: 'middle', wrapText: true }
  },
  subHeader: {
    font: { name: 'Calibri', size: 11, bold: true, color: { argb: '1F2937' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E7F1' } },
    alignment: { vertical: 'middle' }
  },
  label: { font: { name: 'Calibri', size: 11, color: { argb: '1F2937' } }, alignment: { vertical: 'middle', wrapText: true } },
  labelBold: { font: { name: 'Calibri', size: 11, bold: true, color: { argb: '1F2937' } }, alignment: { vertical: 'middle', wrapText: true } },
  note: { font: { name: 'Calibri', size: 9, italic: true, color: { argb: '6B7280' } }, alignment: { vertical: 'top', wrapText: true } },
  input: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } },
    font: { name: 'Calibri', size: 11, bold: true, color: { argb: '92400E' } },
    alignment: { horizontal: 'right', vertical: 'middle' },
    border: { top: { style: 'thin', color: { argb: 'D97706' } }, bottom: { style: 'thin', color: { argb: 'D97706' } }, left: { style: 'thin', color: { argb: 'D97706' } }, right: { style: 'thin', color: { argb: 'D97706' } } }
  },
  inputText: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } },
    font: { name: 'Calibri', size: 11, bold: true, color: { argb: '92400E' } },
    alignment: { horizontal: 'left', vertical: 'middle' },
    border: { top: { style: 'thin', color: { argb: 'D97706' } }, bottom: { style: 'thin', color: { argb: 'D97706' } }, left: { style: 'thin', color: { argb: 'D97706' } }, right: { style: 'thin', color: { argb: 'D97706' } } }
  },
  inputDropdown: {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } },
    font: { name: 'Calibri', size: 11, bold: true, color: { argb: '92400E' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: { top: { style: 'thin', color: { argb: 'D97706' } }, bottom: { style: 'thin', color: { argb: 'D97706' } }, left: { style: 'thin', color: { argb: 'D97706' } }, right: { style: 'thin', color: { argb: 'D97706' } } }
  },
  output: { font: { name: 'Calibri', size: 11, bold: true, color: { argb: '065F46' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } }, alignment: { horizontal: 'right', vertical: 'middle' } },
  outputText: { font: { name: 'Calibri', size: 11, bold: true, color: { argb: '065F46' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } }, alignment: { horizontal: 'left', vertical: 'middle', wrapText: true } },
  outputBig: { font: { name: 'Calibri', size: 16, bold: true, color: { argb: '065F46' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A7F3D0' } }, alignment: { horizontal: 'right', vertical: 'middle' } },
  header: {
    font: { name: 'Calibri', size: 10, bold: true, color: { argb: '1F2937' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } },
    alignment: { vertical: 'middle', wrapText: true },
    border: { top: { style: 'thin', color: { argb: '9CA3AF' } }, bottom: { style: 'thin', color: { argb: '9CA3AF' } } }
  },
  ok: { font: { name: 'Calibri', size: 10, bold: true, color: { argb: '065F46' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } }, alignment: { horizontal: 'center' } },
  check: { font: { name: 'Calibri', size: 10, bold: true, color: { argb: '92400E' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }, alignment: { horizontal: 'center' } },
  warning: { font: { name: 'Calibri', size: 10, bold: true, color: { argb: '7F1D1D' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } }, alignment: { horizontal: 'center' } },
  danger: { font: { name: 'Calibri', size: 11, bold: true, color: { argb: '7F1D1D' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } }, alignment: { horizontal: 'center' } },
  warnText: { font: { name: 'Calibri', size: 10, italic: true, color: { argb: '92400E' } }, alignment: { vertical: 'top', wrapText: true } },
  pct: { numFmt: '0.0%' },
  money: { numFmt: '"S$"#,##0' },
};

function setCell(ws, cellRef, value, style) {
  const cell = ws.getCell(cellRef);
  if (value && typeof value === 'object' && value.f) {
    cell.value = { formula: value.f, result: 0 };
  } else {
    cell.value = value;
  }
  if (style) Object.assign(cell, style);
  return cell;
}

async function main() {
  const outputDir = path.dirname(OUTPUT);
  fs.mkdirSync(outputDir, { recursive: true });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'SGEventsHub';
  wb.created = new Date();

  // ============================ START HERE ============================
  const sh1 = wb.addWorksheet('START HERE');
  const rows1 = [
    [2, 'Singapore MDW Total Cost of Ownership (TCO) Planner 2026', STYLE.title],
    [3, 'A planning tool to estimate the full cost of employing a Migrant Domestic Worker — NOT legal/immigration advice.', STYLE.subtitle],
    [5, 'WHAT THIS WORKBOOK DOES', STYLE.subHeader],
    [6, '• PROFILE & INPUTS — capture helper type, salary, levy, agency fees, insurance, medical, and other costs.', STYLE.label],
    [7, '• COST CALCULATOR — breaks down one-off vs recurring costs with transparent formulas.', STYLE.label],
    [8, '• MONTHLY / YEARLY TCO — summarises first-year total, ongoing annual cost, and monthly equivalent.', STYLE.label],
    [9, '• ACTION PLAN — checklist of requirements, timelines, and budgeting steps.', STYLE.label],
    [11, 'HOW TO USE — 3 STEPS', STYLE.subHeader],
    [12, 'STEP 1 · Go to PROFILE & INPUTS. Fill in your arrangement details and cost assumptions.', STYLE.label],
    [13, 'STEP 2 · Review COST CALCULATOR and MONTHLY / YEARLY TCO. Adjust inputs to see impact.', STYLE.label],
    [14, 'STEP 3 · Use ACTION PLAN to track requirements and budgeting milestones.', STYLE.label],
    [16, 'WHAT IS OFFICIAL vs MARKET ESTIMATE vs PLANNING ASSUMPTION vs USER INPUT', STYLE.subHeader],
    [17, '• Official: MOM levy rates, security bond, medical exam requirements, work permit application fee.', STYLE.label],
    [18, '• Market estimate: Agency fees, monthly salary ranges, insurance premiums (vary by provider).', STYLE.label],
    [19, '• Planning assumption: Food, transport, phone, toiletries, replacement maid costs, annual leave pay.', STYLE.label],
    [20, '• User input: Your specific helper profile, chosen agency, actual quotes, and budget decisions.', STYLE.label],
    [22, 'LIMITATIONS & DISCLAIMER', STYLE.subHeader],
    [23, 'This tool is for financial planning only. It does NOT guarantee MOM approval, actual costs, or compliance. MOM rules and levy rates change; always verify on the MOM website and with your agency before committing.', STYLE.warnText],
    [25, 'Yellow = editable input  ·  Green = auto-calculated  ·  Do not type into green cells.', STYLE.note],
  ];
  rows1.forEach(([r, t, s]) => setCell(sh1, 'B' + r, t, s));
  sh1.getColumn('B').width = 28;
  sh1.getColumn('C').width = 110;

  // ============================ PROFILE & INPUTS ============================
  const sh2 = wb.addWorksheet('PROFILE & INPUTS');
  setCell(sh2, 'B2', 'STEP 1 · YOUR MDW ARRANGEMENT & COST ASSUMPTIONS', STYLE.title);
  setCell(sh2, 'B3', 'Fill in the yellow cells. Green cells calculate automatically.', STYLE.subtitle);

  setCell(sh2, 'B5', 'HELPER PROFILE', STYLE.sectionHeader);
  const helper = [
    ['Helper type (New / Transfer / Renewal)', 'New'],
    ['Source country', ''],
    ['Monthly salary (S$)', 600],
    ['Rest day compensation (if no rest day, S$/month)', 0],
    ['Food allowance / groceries per month (S$)', 250],
    ['Transport allowance per month (S$)', 50],
    ['Phone / data allowance per month (S$)', 30],
    ['Toiletries / personal care per month (S$)', 40],
    ['Annual leave pay (if not given as days off, S$)', 0],
    ['Performance bonus / 13th month (S$, annual)', 0],
  ];
  helper.forEach((h, i) => {
    const r = 6 + i;
    setCell(sh2, 'B' + r, h[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, h[1], typeof h[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B17', 'MOM OFFICIAL COSTS (verify on MOM website)', STYLE.sectionHeader);
  const mom = [
    ['Monthly levy (S$) — Standard / Concession', 300],
    ['Levy concession applicable?', 'No'],
    ['Security bond (S$) — MOM requirement', 5000],
    ['Work permit application fee (S$) — MOM', 35],
    ['Work permit issuance fee (S$) — MOM', 35],
    ['Medical examination (S$) — MOM required (6-monthly)', 80],
    ['Settling-in Programme (SIP) — one-off (S$)', 75],
  ];
  mom.forEach((m, i) => {
    const r = 18 + i;
    setCell(sh2, 'B' + r, m[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, m[1], typeof m[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputDropdown });
    setCell(sh2, 'D' + r, 'Verify current rate on MOM website', STYLE.note);
  });

  setCell(sh2, 'B26', 'AGENCY & INSURANCE (market estimates — vary by provider)', STYLE.sectionHeader);
  const agency = [
    ['Agency placement fee (S$) — one-off', 2500],
    ['Agency fee includes: ', 'Placement, medical, SIP, bond processing'],
    ['Insurance — Medical (S$)', 60000],
    ['Insurance — Personal Accident (S$)', 60000],
    ['Insurance coverage label', 'Official MOM requirement'],
    ['Insurance premium — annual (S$) — Market estimate', 260],
    ['Insurance premium label', 'Market estimate'],
    ['Agency loan / instalment plan?', 'No'],
    ['If yes, interest rate / admin fee (S$)', 0],
  ];
  agency.forEach((a, i) => {
    const r = 27 + i;
    setCell(sh2, 'B' + r, a[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, a[1], typeof a[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B34', 'OTHER RECURRING / ONE-OFF COSTS (planning assumptions)', STYLE.sectionHeader);
  const other = [
    ['Home leave / annual trip (S$, annual)', 0],
    ['Replacement maid cost (S$, if needed)', 0],
    ['Additional training / courses (S$)', 0],
    ['Miscellaneous / buffer per month (S$)', 50],
  ];
  other.forEach((o, i) => {
    const r = 35 + i;
    setCell(sh2, 'B' + r, o[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, o[1], typeof o[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B40', 'HOUSEHOLD CONTEXT', STYLE.sectionHeader);
  const context = [
    ['Employer household monthly income (S$)', 0],
    ['Number of dependents (children/elderly)', 0],
    ['Current maid? (Yes/No)', 'No'],
    ['If yes, months remaining on current contract', 0],
  ];
  context.forEach((c, i) => {
    const r = 41 + i;
    setCell(sh2, 'B' + r, c[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, c[1], typeof c[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  sh2.getColumn('B').width = 52;
  sh2.getColumn('C').width = 28;
  sh2.getColumn('D').width = 40;

  // ============================ COST CALCULATOR ============================
  const sh3 = wb.addWorksheet('COST CALCULATOR');
  setCell(sh3, 'B2', 'COST CALCULATOR — TRANSPARENT BREAKDOWN', STYLE.title);
  setCell(sh3, 'B3', 'All formulas reference PROFILE & INPUTS. Green = calculated. Do not edit.', STYLE.subtitle);

  const IN = 'PROFILE & INPUTS';

  let r = 5;
  setCell(sh3, 'B' + r, 'MONTHLY RECURRING COSTS', STYLE.sectionHeader); r++;
  setCell(sh3, 'B' + r, 'Item', STYLE.header);
  setCell(sh3, 'C' + r, 'Monthly (S$)', STYLE.header);
  setCell(sh3, 'D' + r, 'Annual (S$)', STYLE.header);
  setCell(sh3, 'E' + r, 'Source Type', STYLE.header); r++;

  const monthlyItems = [
    ['Monthly salary', `'${IN}'!C8`, 'User input / Market estimate'],
    ['Rest day compensation', `'${IN}'!C9`, 'User input / Market estimate'],
    ['Monthly levy', `'${IN}'!C19`, 'Official (MOM)'],
    ['Food allowance', `'${IN}'!C10`, 'Planning assumption'],
    ['Transport allowance', `'${IN}'!C11`, 'Planning assumption'],
    ['Phone / data allowance', `'${IN}'!C12`, 'Planning assumption'],
    ['Toiletries / personal care', `'${IN}'!C13`, 'Planning assumption'],
    ['Insurance premium (annual ÷ 12)', `('${IN}'!C34)/12`, 'Market estimate'],
    ['Miscellaneous / buffer', `'${IN}'!C42`, 'Planning assumption'],
  ];
  const monthlyStart = r;
  monthlyItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh3, 'B' + rr, item[0], STYLE.label);
    setCell(sh3, 'C' + rr, { f: item[1] }, { ...STYLE.output, ...STYLE.money });
    setCell(sh3, 'D' + rr, { f: `C${rr}*12` }, { ...STYLE.output, ...STYLE.money });
    setCell(sh3, 'E' + rr, item[2], STYLE.note);
  });
  const monthlyEnd = r + monthlyItems.length - 1;
  r = monthlyEnd + 1;
  setCell(sh3, 'B' + r, 'TOTAL MONTHLY RECURRING', STYLE.labelBold);
  setCell(sh3, 'C' + r, { f: `SUM(C${monthlyStart}:C${monthlyEnd})` }, { ...STYLE.outputBig, ...STYLE.money });
  setCell(sh3, 'D' + r, { f: `SUM(D${monthlyStart}:D${monthlyEnd})` }, { ...STYLE.outputBig, ...STYLE.money });
  r += 2;

  setCell(sh3, 'B' + r, 'ONE-OFF / FIRST-YEAR COSTS', STYLE.sectionHeader); r++;
  setCell(sh3, 'B' + r, 'Item', STYLE.header);
  setCell(sh3, 'C' + r, 'Amount (S$)', STYLE.header);
  setCell(sh3, 'D' + r, 'Source Type', STYLE.header); r++;

  const oneoffItems = [
    ['Agency placement fee', `'${IN}'!C28`, 'Market estimate'],
    ['Security bond (refundable)', `'${IN}'!C21`, 'Official (MOM)'],
    ['Work permit application fee', `'${IN}'!C22`, 'Official (MOM)'],
    ['Work permit issuance fee', `'${IN}'!C23`, 'Official (MOM)'],
    ['Medical examination (first)', `'${IN}'!C24`, 'Official (MOM)'],
    ['Settling-in Programme (SIP)', `'${IN}'!C25`, 'Official (MOM)'],
    ['Insurance first-year premium', `'${IN}'!C34`, 'Market estimate'],
    ['Agency loan interest / admin fee', `'${IN}'!C39`, 'Market estimate'],
    ['Home leave / annual trip (first year)', `'${IN}'!C40`, 'Planning assumption'],
    ['Replacement maid cost (if applicable)', `'${IN}'!C41`, 'Planning assumption'],
    ['Additional training / courses', `'${IN}'!C42`, 'Planning assumption'],
  ];
  const oneoffStart = r;
  oneoffItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh3, 'B' + rr, item[0], STYLE.label);
    setCell(sh3, 'C' + rr, { f: item[1] }, { ...STYLE.output, ...STYLE.money });
    setCell(sh3, 'D' + rr, item[2], STYLE.note);
  });
  const oneoffEnd = r + oneoffItems.length - 1;
  r = oneoffEnd + 1;
  setCell(sh3, 'B' + r, 'TOTAL ONE-OFF / FIRST-YEAR', STYLE.labelBold);
  setCell(sh3, 'C' + r, { f: `SUM(C${oneoffStart}:C${oneoffEnd})` }, { ...STYLE.outputBig, ...STYLE.money });
  r += 2;

  setCell(sh3, 'B' + r, 'ANNUAL RECURRING FROM YEAR 2 ONWARDS', STYLE.sectionHeader); r++;
  setCell(sh3, 'B' + r, 'Item', STYLE.header);
  setCell(sh3, 'C' + r, 'Annual (S$)', STYLE.header);
  setCell(sh3, 'D' + r, 'Source Type', STYLE.header); r++;

  const recurringItems = [
    ['Annual recurring from monthly costs', { f: `C${monthlyEnd+1}*12` }, 'Calculated'],
    ['Medical examination (6-monthly × 2)', { f: `'${IN}'!C24*2` }, 'Official (MOM)'],
    ['Insurance renewal (annual)', `'${IN}'!C34`, 'Market estimate'],
    ['Home leave / annual trip', `'${IN}'!C40`, 'Planning assumption'],
    ['Performance bonus / 13th month', `'${IN}'!C15`, 'User input / Market estimate'],
    ['Additional training / courses', `'${IN}'!C42`, 'Planning assumption'],
  ];
  const recurringStart = r;
  recurringItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh3, 'B' + rr, item[0], STYLE.label);
    setCell(sh3, 'C' + rr, { f: item[1] }, { ...STYLE.output, ...STYLE.money });
    setCell(sh3, 'D' + rr, item[2], STYLE.note);
  });
  const recurringEnd = r + recurringItems.length - 1;
  r = recurringEnd + 1;
  setCell(sh3, 'B' + r, 'TOTAL ANNUAL RECURRING (Year 2+)', STYLE.labelBold);
  setCell(sh3, 'C' + r, { f: `SUM(C${recurringStart}:C${recurringEnd})` }, { ...STYLE.outputBig, ...STYLE.money });
  r += 2;

  // PLACEMENT LOAN BREAKDOWN (not a statutory requirement)
  setCell(sh3, 'B' + r, 'PLACEMENT LOAN BREAKDOWN (if applicable — not statutory)', STYLE.sectionHeader); r++;
  setCell(sh3, 'B' + r, 'Item', STYLE.header);
  setCell(sh3, 'C' + r, 'Amount (S$)', STYLE.header);
  setCell(sh3, 'D' + r, 'Notes', STYLE.header); r++;

  const loanItems = [
    ['Agency / placement fee (total)', `'${IN}'!C28`, 'Market estimate'],
    ['Amount paid upfront by employer', `'${IN}'!C28`, 'Typically full fee paid to agency upfront'],
    ['Placement loan recovered from MDW salary (monthly)', 0, 'Enter monthly deduction if agency offers loan scheme'],
    ['Placement loan recovered from MDW salary (total)', { f: `C${r}*'${IN}'!C14` }, 'Monthly × contract months (typically 24)'],
    ['Employer cash outlay (upfront fee − loan recovered)', { f: `C${r-3}-C${r-1}` }, 'Net employer cost after salary deductions'],
    ['First 6-month net cash outlay', { f: `C${r-3}-C${r-2}*6` }, 'Upfront fee minus 6 months of salary deductions'],
  ];
  const loanStart = r;
  loanItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh3, 'B' + rr, item[0], STYLE.label);
    setCell(sh3, 'C' + rr, { f: item[1] }, { ...STYLE.output, ...STYLE.money });
    setCell(sh3, 'D' + rr, item[2], STYLE.note);
  });
  r = loanStart + loanItems.length + 1;

  sh3.getColumn('B').width = 44;
  sh3.getColumn('C').width = 20;
  sh3.getColumn('D').width = 20;
  sh3.getColumn('E').width = 30;

  // ============================ MONTHLY / YEARLY TCO ============================
  const sh4 = wb.addWorksheet('MONTHLY YEARLY TCO');
  setCell(sh4, 'B2', 'TOTAL COST OF OWNERSHIP SUMMARY', STYLE.title);
  setCell(sh4, 'B3', 'Auto-calculated from COST CALCULATOR and PROFILE & INPUTS.', STYLE.subtitle);

  r = 5;
  setCell(sh4, 'B' + r, 'FIRST YEAR TCO', STYLE.sectionHeader); r++;

  const firstYearItems = [
    ['Total one-off / first-year costs', { f: `'COST CALCULATOR'!C${oneoffEnd+1}` }, 'One-off'],
    ['Total monthly recurring × 12', { f: `'COST CALCULATOR'!D${monthlyEnd+1}` }, 'Recurring'],
    ['FIRST-YEAR TOTAL', { f: `C${r}+C${r+1}` }, 'Combined'],
  ];
  firstYearItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh4, 'B' + rr, item[0], i === 2 ? STYLE.labelBold : STYLE.label);
    setCell(sh4, 'C' + rr, item[1], i === 2 ? { ...STYLE.outputBig, ...STYLE.money } : { ...STYLE.output, ...STYLE.money });
    setCell(sh4, 'D' + rr, item[2], STYLE.note);
  });
  const firstYearTotalRow = r + 2;
  r = firstYearTotalRow + 2;

  setCell(sh4, 'B' + r, 'ONGOING ANNUAL TCO (Year 2+)', STYLE.sectionHeader); r++;
  const ongoingItems = [
    ['Total annual recurring (Year 2+)', { f: `'COST CALCULATOR'!C${recurringEnd+1}` }, 'Recurring'],
    ['ONGOING ANNUAL TOTAL', { f: `C${r}` }, 'Combined'],
  ];
  ongoingItems.forEach((item, i) => {
    const rr = r + i;
    setCell(sh4, 'B' + rr, item[0], i === 1 ? STYLE.labelBold : STYLE.label);
    setCell(sh4, 'C' + rr, item[1], i === 1 ? { ...STYLE.outputBig, ...STYLE.money } : { ...STYLE.output, ...STYLE.money });
    setCell(sh4, 'D' + rr, item[2], STYLE.note);
  });
  const ongoingTotalRow = r + 1;
  r = ongoingTotalRow + 2;

  setCell(sh4, 'B' + r, 'MONTHLY EQUIVALENT', STYLE.sectionHeader); r++;
  setCell(sh4, 'B' + r, 'First-year monthly equivalent (Total ÷ 12)', STYLE.label);
  setCell(sh4, 'C' + r, { f: `C${firstYearTotalRow}/12` }, { ...STYLE.outputBig, ...STYLE.money });
  r++;
  setCell(sh4, 'B' + r, 'Ongoing monthly equivalent (Annual ÷ 12)', STYLE.label);
  setCell(sh4, 'C' + r, { f: `C${ongoingTotalRow}/12` }, { ...STYLE.outputBig, ...STYLE.money });
  r += 2;

  setCell(sh4, 'B' + r, 'AFFORDABILITY CHECK', STYLE.sectionHeader); r++;
  setCell(sh4, 'B' + r, 'Household monthly income', STYLE.label);
  setCell(sh4, 'C' + r, { f: `'${IN}'!C42` }, { ...STYLE.output, ...STYLE.money });
  r++;
  setCell(sh4, 'B' + r, 'First-year TCO as % of annual income', STYLE.label);
  setCell(sh4, 'C' + r, { f: `IF('${IN}'!C42=0,0,C${firstYearTotalRow}/('${IN}'!C42*12))` }, { ...STYLE.output, ...STYLE.pct });
  r++;
  setCell(sh4, 'B' + r, 'Ongoing monthly TCO as % of monthly income', STYLE.label);
  setCell(sh4, 'C' + r, { f: `IF('${IN}'!C42=0,0,C${ongoingTotalRow+1}/'${IN}'!C42)` }, { ...STYLE.output, ...STYLE.pct });
  r += 2;

  setCell(sh4, 'B' + r, 'KEY ASSUMPTIONS & SENSITIVITY', STYLE.subHeader); r++;
  setCell(sh4, 'B' + r, '• Levy concession reduces monthly levy from $300 to $60 (check MOM eligibility).', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• Security bond ($5,000) is refundable if no violations; not a "cost" but cash flow.', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• Salary range typically $550–$750 depending on experience and country.', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• Agency fees range $1,500–$3,500; compare before signing.', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• Insurance: MOM minimum $60,000 medical + $60,000 personal accident per year; premiums vary.', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• 6-monthly medical exam required by MOM (cost ~$80 each).', STYLE.note); r++;
  setCell(sh4, 'B' + r, '• Placement loan is NOT a statutory requirement; it is a commercial arrangement between employer and agency.', STYLE.note); r++;

  sh4.getColumn('B').width = 48;
  sh4.getColumn('C').width = 24;
  sh4.getColumn('D').width = 24;

  // ============================ ACTION PLAN ============================
  const sh5 = wb.addWorksheet('ACTION PLAN');
  setCell(sh5, 'B2', 'ACTION PLAN — REQUIREMENTS & BUDGETING', STYLE.title);
  setCell(sh5, 'B3', 'Track your progress. Yellow = editable. Green = auto-calculated.', STYLE.subtitle);

  const headRow5 = 5;
  setCell(sh5, 'B' + headRow5, '#', STYLE.header);
  setCell(sh5, 'C' + headRow5, 'Action / Requirement', STYLE.header);
  setCell(sh5, 'D' + headRow5, 'Timing / Deadline', STYLE.header);
  setCell(sh5, 'E' + headRow5, 'Priority', STYLE.header);
  setCell(sh5, 'F' + headRow5, 'Status', STYLE.header);
  setCell(sh5, 'G' + headRow5, 'Cost Impact (S$)', STYLE.header);
  setCell(sh5, 'H' + headRow5, 'Notes / Links', STYLE.header);

  const actions = [
    [1, 'Confirm MOM eligibility (employer income, household needs)', 'Before starting', 'High', '', 0, 'MOM website: FDW eligibility'],
    [2, 'Compare 3+ agencies (fees, services, reviews)', '1-2 months before', 'High', '', 0, 'Check MOM licensed agency list'],
    [3, 'Budget for first-year TCO (see MONTHLY / YEARLY TCO)', 'Before signing', 'High', '', { f: `'MONTHLY YEARLY TCO'!C${firstYearTotalRow}` }, 'First-year total'],
    [4, 'Prepare security bond $5,000 (banker\'s guarantee or insurance)', 'Before WP application', 'High', '', 5000, 'Refundable if no breach'],
    [5, 'Arrange medical exam for helper (pre-employment)', 'Before arrival', 'High', '', { f: `'${IN}'!C24` }, 'MOM-approved clinic'],
    [6, 'Enrol helper in Settling-in Programme (SIP)', 'Within 3 days of arrival', 'High', '', { f: `'${IN}'!C25` }, 'MOM mandatory'],
    [7, 'Purchase insurance (medical $60k + personal accident $60k min)', 'Before WP issuance', 'High', '', { f: `'${IN}'!C34` }, 'MOM minimum coverage'],
    [8, 'Apply for Work Permit (online via MOM)', 'After helper arrival', 'High', '', { f: `'${IN}'!C22+'${IN}'!C23` }, 'WP application + issuance fee'],
    [9, 'Set up GIRO for monthly levy payment', 'Upon WP approval', 'High', '', { f: `'${IN}'!C19` }, 'Monthly levy auto-deduction'],
    [10, 'Prepare helper\'s room / living arrangements', 'Before arrival', 'Medium', '', 0, 'MOM housing standards'],
    [11, 'Purchase food, toiletries, phone plan for helper', 'First week', 'Medium', '', { f: `'${IN}'!C10+'${IN}'!C11+'${IN}'!C12+'${IN}'!C13` }, 'Monthly recurring items'],
    [12, 'Schedule 6-monthly medical exams', 'Every 6 months', 'Medium', '', { f: `'${IN}'!C24*2` }, 'MOM requirement'],
    [13, 'Renew insurance annually', 'Annually', 'Medium', '', { f: `'${IN}'!C34` }, 'Before policy expiry'],
    [14, 'Plan for home leave / annual trip (if applicable)', 'Annually', 'Low', '', { f: `'${IN}'!C40` }, 'Budget in advance'],
    [15, 'Review contract & salary at renewal (2-year cycle)', 'Month 22-24', 'Medium', '', 0, 'Negotiate if needed'],
    [16, 'Emergency fund for replacement / repatriation', 'Ongoing', 'Low', '', { f: `'${IN}'!C41` }, 'Buffer for unexpected'],
    [17, 'Review placement loan terms (if any) — not statutory', 'Before signing', 'Medium', '', 0, 'See COST CALCULATOR placement loan breakdown'],
  ];

  const startRow5 = headRow5 + 1;
  actions.forEach((a, i) => {
    const rr = startRow5 + i;
    setCell(sh5, 'B' + rr, a[0], STYLE.label);
    setCell(sh5, 'C' + rr, a[1], { ...STYLE.inputText });
    setCell(sh5, 'D' + rr, a[2], { ...STYLE.inputText });
    setCell(sh5, 'E' + rr, a[3], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh5, 'F' + rr, a[4], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh5, 'G' + rr, a[5], typeof a[5] === 'number' ? { ...STYLE.output, ...STYLE.money } : { ...STYLE.output, ...STYLE.money });
    setCell(sh5, 'H' + rr, a[6], { ...STYLE.inputText });
  });

  const lastRow5 = startRow5 + actions.length - 1;

  // Data validations
  sh5.dataValidations.add('E' + startRow5 + ':E' + lastRow5, {
    type: 'list', allowBlank: true, formulae: ['"High,Medium,Low"'],
    showErrorMessage: true, errorMessage: 'Select High/Medium/Low', errorTitle: 'Invalid Priority'
  });
  sh5.dataValidations.add('F' + startRow5 + ':F' + lastRow5, {
    type: 'list', allowBlank: true, formulae: ['"Not Started,In Progress,Done,Blocked,N/A"'],
    showErrorMessage: true, errorMessage: 'Select status', errorTitle: 'Invalid Status'
  });

  // Summary
  let summaryRow = lastRow5 + 3;
  setCell(sh5, 'B' + summaryRow, 'SUMMARY', STYLE.sectionHeader); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Total actions', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTA(C${startRow5}:C${lastRow5})` }, { ...STYLE.output }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'High priority', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(E${startRow5}:E${lastRow5},"High")` }, { ...STYLE.output, ...STYLE.danger }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Not Started', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"Not Started")` }, { ...STYLE.output }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'In Progress', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"In Progress")` }, { ...STYLE.output, ...STYLE.warning }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Done', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"Done")` }, { ...STYLE.output, ...STYLE.ok }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Total cost impact (high priority)', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `SUMIF(E${startRow5}:E${lastRow5},"High",G${startRow5}:G${lastRow5})` }, { ...STYLE.outputBig, ...STYLE.money }); summaryRow++;

  sh5.getColumn('B').width = 5;
  sh5.getColumn('C').width = 48;
  sh5.getColumn('D').width = 24;
  sh5.getColumn('E').width = 14;
  sh5.getColumn('F').width = 16;
  sh5.getColumn('G').width = 18;
  sh5.getColumn('H').width = 40;

  // ============================ WRITE ============================
  await wb.xlsx.writeFile(OUTPUT);
  console.log('Written:', OUTPUT);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});