const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const OUTPUT = 'digital-products/pr-readiness-audit/singapore-pr-readiness-document-audit-2026.xlsx';

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
    [2, 'Singapore PR Readiness & Document Audit 2026', STYLE.title],
    [3, 'A practical planning tool to organise your PR application documents, track readiness, and identify gaps — NOT a prediction of approval.', STYLE.subtitle],
    [5, 'WHAT THIS WORKBOOK DOES', STYLE.subHeader],
    [6, '• PROFILE — capture your background details (years in SG, employment, family status, etc.) for quick reference.', STYLE.label],
    [7, '• DOCUMENT CHECKLIST — list every required and supporting document, mark status (Done / Missing / N/A), add notes.', STYLE.label],
    [8, '• READINESS SCORE — automatic tally of required items vs completed, with a simple status indicator.', STYLE.label],
    [9, '• ACTION PLAN — auto-generates a prioritised list of missing items with recommended actions.', STYLE.label],
    [11, 'HOW TO USE — 3 STEPS', STYLE.subHeader],
    [12, 'STEP 1 · Go to PROFILE and fill in your details.', STYLE.label],
    [13, 'STEP 2 · Go to DOCUMENT CHECKLIST. For each item, set Status to Done / Missing / N/A and add notes.', STYLE.label],
    [14, 'STEP 3 · Review READINESS SCORE and ACTION PLAN. Focus on high-priority missing items first.', STYLE.label],
    [16, 'WHAT IS OFFICIAL vs PLANNING GUIDANCE vs USER INPUT', STYLE.subHeader],
    [17, '• Official requirements: ICA PR document checklist (identity, employment, income, family, tax, education).', STYLE.label],
    [18, '• Planning guidance: common supporting documents applicants typically prepare (cover letter, testimonials, etc.).', STYLE.label],
    [19, '• User input: your Profile details, Status selections, and Notes — entirely controlled by you.', STYLE.label],
    [21, 'LIMITATIONS & DISCLAIMER', STYLE.subHeader],
    [22, 'This tool is for document organisation and readiness tracking only. It does NOT predict or guarantee PR approval. ICA assessment criteria are not public; always verify latest requirements on the ICA website before submission.', STYLE.warnText],
    [24, 'Yellow = editable input  ·  Green = auto-calculated  ·  Do not type into green cells.', STYLE.note],
  ];
  rows1.forEach(([r, t, s]) => setCell(sh1, 'B' + r, t, s));
  sh1.getColumn('B').width = 28;
  sh1.getColumn('C').width = 110;

  // ============================ PROFILE ============================
  const sh2 = wb.addWorksheet('PROFILE');
  setCell(sh2, 'B2', 'STEP 1 · YOUR PROFILE', STYLE.title);
  setCell(sh2, 'B3', 'Fill in the yellow cells. This sheet is for your reference and does not drive calculations.', STYLE.subtitle);

  setCell(sh2, 'B5', 'PERSONAL DETAILS', STYLE.sectionHeader);
  const personal = [
    ['Full name (as in passport)', ''],
    ['Date of birth', ''],
    ['Nationality', ''],
    ['Current FIN / NRIC (if any)', ''],
    ['Marital status', ''],
    ['Spouse name (if married)', ''],
    ['Spouse nationality', ''],
    ['Children (names, DOB, nationality)', ''],
  ];
  personal.forEach((p, i) => {
    const r = 6 + i;
    setCell(sh2, 'B' + r, p[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, p[1], { ...STYLE.inputText });
  });

  setCell(sh2, 'B15', 'SINGAPORE HISTORY', STYLE.sectionHeader);
  const history = [
    ['Date of first entry to Singapore', ''],
    ['Total years in Singapore (continuous)', 0],
    ['Current pass type (EP / S Pass / WP / DP / LTVP / PR / Citizen)', ''],
    ['Previous pass types held', ''],
    ['Any previous PR application?', 'No'],
    ['If yes, year and outcome', ''],
  ];
  history.forEach((h, i) => {
    const r = 16 + i;
    setCell(sh2, 'B' + r, h[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, h[1], { ...STYLE.inputText });
  });

  setCell(sh2, 'B23', 'EMPLOYMENT & INCOME', STYLE.sectionHeader);
  const employment = [
    ['Current employer', ''],
    ['Occupation / Job title', ''],
    ['Industry', ''],
    ['Monthly basic salary (S$)', 0],
    ['Monthly variable/bonus (S$)', 0],
    ['Annual bonus (months)', 0],
    ['CPF contribution (monthly, S$)', 0],
    ['Years with current employer', 0],
    ['Previous employer (if < 2 years current)', ''],
  ];
  employment.forEach((e, i) => {
    const r = 24 + i;
    setCell(sh2, 'B' + r, e[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, e[1], typeof e[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B34', 'EDUCATION', STYLE.sectionHeader);
  const education = [
    ['Highest qualification', ''],
    ['Institution', ''],
    ['Country of institution', ''],
    ['Year of graduation', ''],
    ['Professional certifications / memberships', ''],
  ];
  education.forEach((e, i) => {
    const r = 35 + i;
    setCell(sh2, 'B' + r, e[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, e[1], { ...STYLE.inputText });
  });

  sh2.getColumn('B').width = 42;
  sh2.getColumn('C').width = 44;

  // ============================ DOCUMENT CHECKLIST ============================
  const sh3 = wb.addWorksheet('DOCUMENT CHECKLIST');
  setCell(sh3, 'B2', 'STEP 2 · DOCUMENT CHECKLIST', STYLE.title);
  setCell(sh3, 'B3', 'For each item, set Status (Done / Missing / N/A) in column F. Add notes in column G. Yellow = editable.', STYLE.subtitle);

  const headRow = 5;
  setCell(sh3, 'B' + headRow, '#', STYLE.header);
  setCell(sh3, 'C' + headRow, 'Document / Item', STYLE.header);
  setCell(sh3, 'D' + headRow, 'Category', STYLE.header);
  setCell(sh3, 'E' + headRow, 'Required?', STYLE.header);
  setCell(sh3, 'F' + headRow, 'Status', STYLE.header);
  setCell(sh3, 'G' + headRow, 'Notes', STYLE.header);

  const docs = [
    // Identity & Civil
    [1, 'Valid passport (bio-data page)', 'Identity & Civil', true],
    [2, 'Birth certificate', 'Identity & Civil', true],
    [3, 'Marriage certificate (if married)', 'Identity & Civil', false],
    [4, 'Divorce decree / death cert of spouse (if applicable)', 'Identity & Civil', false],
    [5, 'Children\'s birth certificates', 'Identity & Civil', false],
    [6, 'Spouse\'s passport (if married)', 'Identity & Civil', false],
    [7, 'National ID card (home country)', 'Identity & Civil', false],
    [8, 'Change of name deed poll (if applicable)', 'Identity & Civil', false],

    // Immigration & Pass
    [9, 'Current pass (EP / S Pass / WP / DP / LTVP) copy', 'Immigration & Pass', true],
    [10, 'Previous pass copies (if any)', 'Immigration & Pass', false],
    [11, 'Entry permit / approval letters', 'Immigration & Pass', false],
    [12, 'Travel history (ICA e-service printout)', 'Immigration & Pass', false],

    // Employment
    [13, 'Employment letter (company letterhead, role, salary, start date)', 'Employment', true],
    [14, 'Latest 6 months payslips', 'Employment', true],
    [15, 'Latest 3 years IR8A / tax assessments (IRAS)', 'Employment', true],
    [16, 'CPF contribution history (CPF Board printout)', 'Employment', true],
    [17, 'Employment contract', 'Employment', false],
    [18, 'Company ACRA business profile', 'Employment', false],
    [19, 'Professional licence / registration (if applicable)', 'Employment', false],
    [20, 'Testimonial / reference letter from employer', 'Employment', false],

    // Income & Financial
    [21, 'Bank statements (latest 6–12 months)', 'Income & Financial', false],
    [22, 'CPF statement (latest)', 'Income & Financial', true],
    [23, 'Income tax Notice of Assessment (latest 3 years)', 'Income & Financial', true],
    [24, 'Property ownership documents (if any)', 'Income & Financial', false],
    [25, 'Investment / savings statements', 'Income & Financial', false],
    [26, 'Outstanding loans / liabilities declaration', 'Income & Financial', false],

    // Education
    [27, 'Degree / diploma certificates', 'Education', true],
    [28, 'Academic transcripts', 'Education', false],
    [29, 'Professional certification proofs', 'Education', false],
    [30, 'SkillsFuture / WSQ certificates (if any)', 'Education', false],

    // Family (if applicable)
    [31, 'Spouse\'s employment letter & payslips', 'Family', false],
    [32, 'Spouse\'s CPF & tax documents', 'Family', false],
    [33, 'Children\'s school enrolment letters', 'Family', false],
    [34, 'Children\'s immunisation records', 'Family', false],
    [35, 'Parents\' PR / Citizenship status proof (if in SG)', 'Family', false],

    // Supporting / Optional
    [36, 'Cover letter / personal statement', 'Supporting', false],
    [37, 'Testimonials from Singaporeans / PRs (2–3)', 'Supporting', false],
    [38, 'Community involvement / volunteer records', 'Supporting', false],
    [39, 'Property rental agreement (if renting)', 'Supporting', false],
    [40, 'Any other relevant documents', 'Supporting', false],
  ];

  const startRow = headRow + 1;
  docs.forEach((d, i) => {
    const r = startRow + i;
    setCell(sh3, 'B' + r, d[0], STYLE.label);
    setCell(sh3, 'C' + r, d[1], STYLE.label);
    setCell(sh3, 'D' + r, d[2], STYLE.label);
    setCell(sh3, 'E' + r, d[3] ? 'Yes' : 'No', { ...STYLE.outputText, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh3, 'F' + r, '', { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh3, 'G' + r, '', { ...STYLE.inputText });
  });

  const lastRow = startRow + docs.length - 1;
  const docsCount = docs.length;

  // Data validation for Status column (Done / Missing / N/A)
  sh3.dataValidations.add('F' + startRow + ':F' + lastRow, {
    type: 'list',
    allowBlank: true,
    formulae: ['"Done,Missing,N/A"'],
    showErrorMessage: true,
    errorMessage: 'Select Done, Missing, or N/A',
    errorTitle: 'Invalid Status'
  });

  // Data validation for Required column (Yes / No)
  sh3.dataValidations.add('E' + startRow + ':E' + lastRow, {
    type: 'list',
    allowBlank: true,
    formulae: ['"Yes,No"'],
    showErrorMessage: true,
    errorMessage: 'Select Yes or No',
    errorTitle: 'Invalid Required'
  });

  sh3.getColumn('B').width = 5;
  sh3.getColumn('C').width = 52;
  sh3.getColumn('D').width = 22;
  sh3.getColumn('E').width = 10;
  sh3.getColumn('F').width = 12;
  sh3.getColumn('G').width = 50;

  // ============================ READINESS SCORE ============================
  const sh4 = wb.addWorksheet('READINESS SCORE');
  const DC = 'DOCUMENT CHECKLIST';
  const s = startRow;
  const e = lastRow;
  const count = docsCount;

  setCell(sh4, 'B2', 'READINESS SCORE', STYLE.title);
  setCell(sh4, 'B3', 'Auto-calculates from DOCUMENT CHECKLIST. Green = calculated. Do not edit.', STYLE.subtitle);

  let r = 5;
  setCell(sh4, 'B' + r, 'SUMMARY', STYLE.sectionHeader); r++;

  const totalReq = `COUNTIF('${DC}'!E${s}:E${e},"Yes")`;
  const doneReq = `COUNTIFS('${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"Done")`;
  const missingReq = `COUNTIFS('${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"Missing")`;
  const naReq = `COUNTIFS('${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"N/A")`;
  const pctReq = `IF(${totalReq}=0,0,${doneReq}/${totalReq})`;

  setCell(sh4, 'B' + r, 'Total required items', STYLE.labelBold); setCell(sh4, 'C' + r, { f: totalReq }, { ...STYLE.outputBig }); r++;
  setCell(sh4, 'B' + r, 'Completed (Done)', STYLE.label); setCell(sh4, 'C' + r, { f: doneReq }, { ...STYLE.output, ...STYLE.ok }); r++;
  setCell(sh4, 'B' + r, 'Missing', STYLE.label); setCell(sh4, 'C' + r, { f: missingReq }, { ...STYLE.output, ...STYLE.danger }); r++;
  setCell(sh4, 'B' + r, 'Marked N/A', STYLE.label); setCell(sh4, 'C' + r, { f: naReq }, { ...STYLE.output, ...STYLE.check }); r++;
  r++;
  setCell(sh4, 'B' + r, 'READINESS % (Done ÷ Required)', STYLE.labelBold); setCell(sh4, 'C' + r, { f: pctReq }, { ...STYLE.outputBig, ...STYLE.pct }); r++;

  r++;
  setCell(sh4, 'B' + r, 'STATUS INDICATOR', STYLE.sectionHeader); r++;
  const statusFormula = `IF(${pctReq}=1,"Ready for review",IF(${pctReq}>=0.7,"Needs attention","Not ready"))`;
  setCell(sh4, 'B' + r, 'Overall status', STYLE.labelBold); setCell(sh4, 'C' + r, { f: statusFormula }, { ...STYLE.outputText }); r++;

  r++;
  setCell(sh4, 'B' + r, 'BREAKDOWN BY CATEGORY', STYLE.sectionHeader); r++;
  setCell(sh4, 'B' + r, 'Category', STYLE.header);
  setCell(sh4, 'C' + r, 'Required', STYLE.header);
  setCell(sh4, 'D' + r, 'Done', STYLE.header);
  setCell(sh4, 'E' + r, 'Missing', STYLE.header);
  setCell(sh4, 'F' + r, 'N/A', STYLE.header);
  setCell(sh4, 'G' + r, '% Done', STYLE.header);
  r++;

  const categories = ['Identity & Civil', 'Immigration & Pass', 'Employment', 'Income & Financial', 'Education', 'Family', 'Supporting'];
  categories.forEach((cat, i) => {
    const rr = r + i;
    const catReq = `COUNTIFS('${DC}'!D${s}:D${e},"${cat}",'${DC}'!E${s}:E${e},"Yes")`;
    const catDone = `COUNTIFS('${DC}'!D${s}:D${e},"${cat}",'${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"Done")`;
    const catMissing = `COUNTIFS('${DC}'!D${s}:D${e},"${cat}",'${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"Missing")`;
    const catNa = `COUNTIFS('${DC}'!D${s}:D${e},"${cat}",'${DC}'!E${s}:E${e},"Yes",'${DC}'!F${s}:F${e},"N/A")`;
    const catPct = `IF(${catReq}=0,0,${catDone}/${catReq})`;

    setCell(sh4, 'B' + rr, cat, STYLE.label);
    setCell(sh4, 'C' + rr, { f: catReq }, { ...STYLE.output });
    setCell(sh4, 'D' + rr, { f: catDone }, { ...STYLE.output, ...STYLE.ok });
    setCell(sh4, 'E' + rr, { f: catMissing }, { ...STYLE.output, ...STYLE.danger });
    setCell(sh4, 'F' + rr, { f: catNa }, { ...STYLE.output, ...STYLE.check });
    setCell(sh4, 'G' + rr, { f: catPct }, { ...STYLE.output, ...STYLE.pct });
  });

  const catEnd = r + categories.length - 1;
  r = catEnd + 2;
  setCell(sh4, 'B' + r, 'Note: Only "Required = Yes" items count toward the readiness score.', STYLE.note);
  setCell(sh4, 'B' + (r+1), 'Optional items (Required = No) are for tracking only.', STYLE.note);

  sh4.getColumn('B').width = 24;
  sh4.getColumn('C').width = 14;
  sh4.getColumn('D').width = 10;
  sh4.getColumn('E').width = 12;
  sh4.getColumn('F').width = 8;
  sh4.getColumn('G').width = 12;
  sh4.getColumn('H').width = 50;

  // ============================ ACTION PLAN ============================
  const sh5 = wb.addWorksheet('ACTION PLAN');
  setCell(sh5, 'B2', 'ACTION PLAN — MISSING ITEMS PRIORITISED', STYLE.title);
  setCell(sh5, 'B3', 'Auto-generates from DOCUMENT CHECKLIST where Status = Missing and Required = Yes.', STYLE.subtitle);

  const headRow5 = 5;
  setCell(sh5, 'B' + headRow5, '#', STYLE.header);
  setCell(sh5, 'C' + headRow5, 'Missing Document / Item', STYLE.header);
  setCell(sh5, 'D' + headRow5, 'Category', STYLE.header);
  setCell(sh5, 'E' + headRow5, 'Recommended Action', STYLE.header);
  setCell(sh5, 'F' + headRow5, 'Priority', STYLE.header);
  setCell(sh5, 'G' + headRow5, 'Target Date', STYLE.header);
  setCell(sh5, 'H' + headRow5, 'Notes', STYLE.header);

  const maxRows = 50;
  for (let i = 0; i < maxRows; i++) {
    const srcRow = s + i;
    if (srcRow > e) break;

    const itemRef = `'${DC}'!C${srcRow}`;
    const catRef = `'${DC}'!D${srcRow}`;
    const reqRef = `'${DC}'!E${srcRow}`;
    const statusRef = `'${DC}'!F${srcRow}`;

    setCell(sh5, 'B' + (headRow5 + 1 + i), i + 1, STYLE.label);
    setCell(sh5, 'C' + (headRow5 + 1 + i), { f: `IF(AND(${reqRef}="Yes",${statusRef}="Missing"),${itemRef},"")` }, STYLE.outputText);
    setCell(sh5, 'D' + (headRow5 + 1 + i), { f: `IF(AND(${reqRef}="Yes",${statusRef}="Missing"),${catRef},"")` }, STYLE.outputText);
    const actionFormula = `IF(AND(${reqRef}="Yes",${statusRef}="Missing"),CHOOSE(MATCH(${catRef},{"Identity & Civil","Immigration & Pass","Employment","Income & Financial","Education","Family","Supporting"},0),"Obtain from ICA/home country authority","Request from employer/HR/ICA portal","Request from employer/HR","Download from IRAS/CPF/Bank portals","Obtain from institution","Coordinate with family members","Prepare at your discretion"),"")`;
    setCell(sh5, 'E' + (headRow5 + 1 + i), { f: actionFormula }, STYLE.outputText);
    const priorityFormula = `IF(AND(${reqRef}="Yes",${statusRef}="Missing"),VLOOKUP(${catRef},{"Identity & Civil","High";"Immigration & Pass","High";"Employment","High";"Income & Financial","High";"Education","Medium";"Family","Medium";"Supporting","Low"},2,FALSE),"")`;
    setCell(sh5, 'F' + (headRow5 + 1 + i), { f: priorityFormula }, { ...STYLE.outputText, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh5, 'G' + (headRow5 + 1 + i), '', { ...STYLE.input });
    setCell(sh5, 'H' + (headRow5 + 1 + i), '', { ...STYLE.inputText });
  }

  const actionEndRow = headRow5 + maxRows;
  r = actionEndRow + 3;
  setCell(sh5, 'B' + r, 'PRIORITY COUNTS', STYLE.sectionHeader); r++;
  setCell(sh5, 'B' + r, 'High priority missing', STYLE.label); setCell(sh5, 'C' + r, { f: `COUNTIF(F${headRow5+1}:F${actionEndRow},"High")` }, { ...STYLE.output, ...STYLE.danger }); r++;
  setCell(sh5, 'B' + r, 'Medium priority missing', STYLE.label); setCell(sh5, 'C' + r, { f: `COUNTIF(F${headRow5+1}:F${actionEndRow},"Medium")` }, { ...STYLE.output, ...STYLE.warning }); r++;
  setCell(sh5, 'B' + r, 'Low priority missing', STYLE.label); setCell(sh5, 'C' + r, { f: `COUNTIF(F${headRow5+1}:F${actionEndRow},"Low")` }, { ...STYLE.output, ...STYLE.ok }); r++;

  sh5.getColumn('B').width = 5;
  sh5.getColumn('C').width = 48;
  sh5.getColumn('D').width = 22;
  sh5.getColumn('E').width = 50;
  sh5.getColumn('F').width = 12;
  sh5.getColumn('G').width = 14;
  sh5.getColumn('H').width = 40;

  // ============================ WRITE ============================
  await wb.xlsx.writeFile(OUTPUT);
  console.log('Written:', OUTPUT);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});