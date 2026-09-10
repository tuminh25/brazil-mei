const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const OUTPUT = 'digital-products/p1-phase-mapper/singapore-p1-phase-priority-strategy-mapper-2026.xlsx';

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
    [2, 'Singapore P1 Phase & Priority Strategy Mapper 2026', STYLE.title],
    [3, 'A planning tool to understand P1 registration phases, map school distances, and build a timeline — NOT a guarantee of admission.', STYLE.subtitle],
    [5, 'WHAT THIS WORKBOOK DOES', STYLE.subHeader],
    [6, '• PROFILE — capture your child\'s details (DOB, address, citizenship, sibling status) for quick reference.', STYLE.label],
    [7, '• PHASE MAP — overview of all P1 registration phases (1 to 3), key dates, and what each phase means.', STYLE.label],
    [8, '• DISTANCE & PRIORITY — list schools of interest, their distance categories, and planning relevance.', STYLE.label],
    [9, '• ACTION PLAN — build a personalised timeline with deadlines, priorities, and status tracking.', STYLE.label],
    [11, 'HOW TO USE — 3 STEPS', STYLE.subHeader],
    [12, 'STEP 1 · Go to PROFILE and fill in your child\'s details and residential address.', STYLE.label],
    [13, 'STEP 2 · Review PHASE MAP to understand which phase applies to you. Use DISTANCE & PRIORITY to shortlist schools.', STYLE.label],
    [14, 'STEP 3 · Build your ACTION PLAN with key deadlines and track progress.', STYLE.label],
    [16, 'WHAT IS OFFICIAL vs PLANNING GUIDANCE vs USER INPUT', STYLE.subHeader],
    [17, '• Official rules: MOE P1 registration phases, eligibility criteria, and balloting rules (published annually by MOE).', STYLE.label],
    [18, '• Planning guidance: typical phase timelines, distance categories (<1km, 1-2km, >2km), and common preparation steps.', STYLE.label],
    [19, '• User input: your Profile details, school selections, Action Plan items — entirely controlled by you.', STYLE.label],
    [21, 'LIMITATIONS & DISCLAIMER', STYLE.subHeader],
    [22, 'This tool is for planning and organisation only. It does NOT guarantee admission to any school. MOE rules change annually; always verify latest information on the MOE website and individual school websites before registration.', STYLE.warnText],
    [24, 'Yellow = editable input  ·  Green = auto-calculated  ·  Do not type into green cells.', STYLE.note],
  ];
  rows1.forEach(([r, t, s]) => setCell(sh1, 'B' + r, t, s));
  sh1.getColumn('B').width = 28;
  sh1.getColumn('C').width = 110;

  // ============================ PROFILE ============================
  const sh2 = wb.addWorksheet('PROFILE');
  setCell(sh2, 'B2', 'STEP 1 · CHILD & FAMILY PROFILE', STYLE.title);
  setCell(sh2, 'B3', 'Fill in the yellow cells. This sheet is for your reference and drives phase eligibility.', STYLE.subtitle);

  setCell(sh2, 'B5', 'CHILD DETAILS', STYLE.sectionHeader);
  const child = [
    ['Child\'s full name (as in BC)', ''],
    ['Date of birth', ''],
    ['Current age (years)', { f: 'IF(C6="","",DATEDIF(C6,TODAY(),"Y"))' }],
    ['Birth Certificate / FIN number', ''],
    ['Citizenship / Residency status', ''],
    ['Gender', ''],
  ];
  child.forEach((c, i) => {
    const r = 6 + i;
    setCell(sh2, 'B' + r, c[0], STYLE.labelBold);
    const isFormula = typeof c[1] === 'object' && c[1].f;
    setCell(sh2, 'C' + r, c[1], isFormula ? { ...STYLE.output } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B13', 'ADDRESS & DISTANCE', STYLE.sectionHeader);
  const address = [
    ['Residential address (for P1 registration)', ''],
    ['Postal code', ''],
    ['Planning area / region', ''],
    ['Type of residence', ''],
    ['Years at current address', 0],
    ['Intended address for registration (if different)', ''],
  ];
  address.forEach((a, i) => {
    const r = 14 + i;
    setCell(sh2, 'B' + r, a[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, a[1], typeof a[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B21', 'FAMILY & SIBLING STATUS', STYLE.sectionHeader);
  const family = [
    ['Father\'s citizenship / residency', ''],
    ['Mother\'s citizenship / residency', ''],
    ['Sibling 1: Name, DOB, School (if any)', ''],
    ['Sibling 2: Name, DOB, School (if any)', ''],
    ['Sibling currently in target primary school?', 'No'],
    ['Parent / sibling alumni of target school?', 'No'],
    ['Parent / sibling staff of target school?', 'No'],
    ['Parent volunteer hours at target school (if any)', 0],
    ['Community / clan association membership', ''],
  ];
  family.forEach((f, i) => {
    const r = 22 + i;
    setCell(sh2, 'B' + r, f[0], STYLE.labelBold);
    setCell(sh2, 'C' + r, f[1], typeof f[1] === 'number' ? { ...STYLE.input, ...STYLE.money } : { ...STYLE.inputText });
  });

  setCell(sh2, 'B32', 'REGISTRATION YEAR TARGET', STYLE.sectionHeader);
  const regYear = [
    ['Target P1 registration year', 2026],
    ['Child turns 7 in (year)', { f: 'IF(C6="","",YEAR(C6)+7)' }],
    ['Eligible for Phase 1?', { f: 'IF(OR(C11="Singapore Citizen",C11="Singapore PR"),"Yes","No")' }],
  ];
  regYear.forEach((r, i) => {
    const rr = 33 + i;
    setCell(sh2, 'B' + rr, r[0], STYLE.labelBold);
    const isFormula = typeof r[1] === 'object' && r[1].f;
    setCell(sh2, 'C' + rr, r[1], isFormula ? { ...STYLE.outputText } : { ...STYLE.inputText });
  });

  sh2.getColumn('B').width = 42;
  sh2.getColumn('C').width = 44;

  // ============================ PHASE MAP ============================
  const sh3 = wb.addWorksheet('PHASE MAP');
  setCell(sh3, 'B2', 'P1 REGISTRATION PHASES — OVERVIEW', STYLE.title);
  setCell(sh3, 'B3', 'Based on MOE annual registration framework. Verify exact dates on MOE website each year.', STYLE.subtitle);

  const headRow3 = 5;
  setCell(sh3, 'B' + headRow3, 'Phase', STYLE.header);
  setCell(sh3, 'C' + headRow3, 'Eligibility', STYLE.header);
  setCell(sh3, 'D' + headRow3, 'Typical Period', STYLE.header);
  setCell(sh3, 'E' + headRow3, 'What It Means', STYLE.header);
  setCell(sh3, 'F' + headRow3, 'What to Prepare', STYLE.header);
  setCell(sh3, 'G' + headRow3, 'Source Type', STYLE.header);

  const phases = [
    ['Phase 1', 'Child with sibling currently studying in the school', 'Early July (1 day)', 'Guaranteed place if sibling is in the school', 'Sibling\'s BC, parent\'s NRIC, proof of sibling\'s current enrolment', 'Official'],
    ['Phase 2A', 'Child whose parent/sibling is alumni (member of alumni association) OR parent/sibling is staff of the school', 'Mid July (1 day)', 'High priority; balloting if oversubscribed', 'Alumni membership proof OR staff employment proof, parent\'s NRIC, child\'s BC', 'Official'],
    ['Phase 2B', 'Child whose parent joined parent volunteer group (≥40 hrs, by 30 Jun prior year) OR parent/sibling is clan/church/community leader OR child is in MOE kindergarten near school', 'Late July (2 days)', 'Balloting likely; distance priority applies', 'Volunteer hours proof, MOE kindergarten cert, community leader proof, child\'s BC, parent\'s NRIC', 'Official'],
    ['Phase 2C', 'All other children (SC & PR)', 'Early August (2 days)', 'Open to all; balloting by distance priority (<1km, 1-2km, >2km)', 'Child\'s BC, both parents\' NRIC, proof of address', 'Official'],
    ['Phase 2C Supplementary', 'SC & PR children not yet placed after Phase 2C', 'Mid August (1 day)', 'Remaining vacancies; same distance priority', 'Same as Phase 2C', 'Official'],
    ['Phase 3', 'International students (non-SC, non-PR)', 'Late October (after all SC/PR placed)', 'Only after all SC/PR allocated; very limited vacancies', 'Child\'s passport, parents\' passes, proof of address, MOE approval letter', 'Official'],
  ];

  phases.forEach((p, i) => {
    const r = headRow3 + 1 + i;
    setCell(sh3, 'B' + r, p[0], { ...STYLE.labelBold, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh3, 'C' + r, p[1], STYLE.label);
    setCell(sh3, 'D' + r, p[2], { ...STYLE.label, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh3, 'E' + r, p[3], STYLE.label);
    setCell(sh3, 'F' + r, p[4], STYLE.label);
    setCell(sh3, 'G' + r, p[5], { ...STYLE.label, alignment: { horizontal: 'center', vertical: 'middle' } });
  });

  const phaseEndRow = headRow3 + phases.length;
  let rNote = phaseEndRow + 2;
  setCell(sh3, 'B' + rNote, 'KEY NOTES', STYLE.subHeader); rNote++;
  setCell(sh3, 'B' + rNote, '• Exact dates change annually — check MOE P1 Registration website for current year.', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• Balloting order: <1km SC > <1km PR > 1-2km SC > 1-2km PR > >2km SC > >2km PR', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• Phase 2B volunteer hours must be completed by 30 June of year BEFORE registration.', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• Address used for distance is the one on NRIC at registration. 30-month stay rule may apply.', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• MOE Kindergarten (MK) priority applies only to MKs within 2km of the primary school.', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• Phase 2A covers both alumni association members and school staff (per MOE framework).', STYLE.label); rNote++;
  setCell(sh3, 'B' + rNote, '• Source: MOE P1 Registration Framework (official).', STYLE.note);

  sh3.getColumn('B').width = 14;
  sh3.getColumn('C').width = 48;
  sh3.getColumn('D').width = 22;
  sh3.getColumn('E').width = 44;
  sh3.getColumn('F').width = 58;
  sh3.getColumn('G').width = 14;

  // ============================ DISTANCE & PRIORITY ============================
  const sh4 = wb.addWorksheet('DISTANCE & PRIORITY');
  setCell(sh4, 'B2', 'SCHOOL SHORTLIST — DISTANCE & PRIORITY', STYLE.title);
  setCell(sh4, 'B3', 'Add schools you are considering. Distance category determines balloting priority. Yellow = editable.', STYLE.subtitle);

  const headRow4 = 5;
  setCell(sh4, 'B' + headRow4, '#', STYLE.header);
  setCell(sh4, 'C' + headRow4, 'School Name', STYLE.header);
  setCell(sh4, 'D' + headRow4, 'Distance from Home', STYLE.header);
  setCell(sh4, 'E' + headRow4, 'Distance Category', STYLE.header);
  setCell(sh4, 'F' + headRow4, 'Phase You Qualify For', STYLE.header);
  setCell(sh4, 'G' + headRow4, 'Priority / Planning Relevance', STYLE.header);
  setCell(sh4, 'H' + headRow4, 'Notes', STYLE.header);

  const schools = [
    [1, '', '', '', '', '', ''],
    [2, '', '', '', '', '', ''],
    [3, '', '', '', '', '', ''],
    [4, '', '', '', '', '', ''],
    [5, '', '', '', '', '', ''],
    [6, '', '', '', '', '', ''],
    [7, '', '', '', '', '', ''],
    [8, '', '', '', '', '', ''],
    [9, '', '', '', '', '', ''],
    [10, '', '', '', '', '', ''],
  ];

  const startRow4 = headRow4 + 1;
  schools.forEach((s, i) => {
    const r = startRow4 + i;
    setCell(sh4, 'B' + r, s[0], STYLE.label);
    setCell(sh4, 'C' + r, s[1], { ...STYLE.inputText });
    setCell(sh4, 'D' + r, s[2], { ...STYLE.inputText });
    setCell(sh4, 'E' + r, s[3], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh4, 'F' + r, s[4], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh4, 'G' + r, s[5], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh4, 'H' + r, s[6], { ...STYLE.inputText });
  });

  const lastRow4 = startRow4 + schools.length - 1;

  // Data validations
  sh4.dataValidations.add('E' + startRow4 + ':E' + lastRow4, {
    type: 'list', allowBlank: true, formulae: ['"<1km,1-2km,>2km,Unknown"'],
    showErrorMessage: true, errorMessage: 'Select distance category', errorTitle: 'Invalid Category'
  });
  sh4.dataValidations.add('F' + startRow4 + ':F' + lastRow4, {
    type: 'list', allowBlank: true, formulae: ['"Phase 1,Phase 2A,Phase 2B,Phase 2C,Phase 2C Supplementary,Phase 3"'],
    showErrorMessage: true, errorMessage: 'Select phase', errorTitle: 'Invalid Phase'
  });
  sh4.dataValidations.add('G' + startRow4 + ':G' + lastRow4, {
    type: 'list', allowBlank: true, formulae: ['"High — guaranteed/strong chance,Medium — balloting likely,Low — long shot,Exploratory — just researching"'],
    showErrorMessage: true, errorMessage: 'Select priority', errorTitle: 'Invalid Priority'
  });

  // Auto-calculate distance category from distance (helper)
  for (let i = 0; i < schools.length; i++) {
    const r = startRow4 + i;
    setCell(sh4, 'E' + r, { f: `IF(D${r}="","",IF(D${r}<1,"<1km",IF(D${r}<=2,"1-2km",">2km")))` }, { ...STYLE.outputText, alignment: { horizontal: 'center', vertical: 'middle' } });
  }

  rNote = lastRow4 + 3;
  setCell(sh4, 'B' + rNote, 'DISTANCE CATEGORY GUIDE', STYLE.subHeader); rNote++;
  setCell(sh4, 'B' + rNote, '<1 km — Highest balloting priority (SC then PR)', STYLE.label); rNote++;
  setCell(sh4, 'B' + rNote, '1–2 km — Medium priority (SC then PR)', STYLE.label); rNote++;
  setCell(sh4, 'B' + rNote, '>2 km — Lowest priority (SC then PR)', STYLE.label); rNote++;
  setCell(sh4, 'B' + rNote, 'Use OneMap or school\'s "Find Schools Near You" tool for official distance.', STYLE.note); rNote++;

  sh4.getColumn('B').width = 5;
  sh4.getColumn('C').width = 36;
  sh4.getColumn('D').width = 20;
  sh4.getColumn('E').width = 18;
  sh4.getColumn('F').width = 24;
  sh4.getColumn('G').width = 34;
  sh4.getColumn('H').width = 40;

  // ============================ ACTION PLAN ============================
  const sh5 = wb.addWorksheet('ACTION PLAN');
  setCell(sh5, 'B2', 'PERSONALISED ACTION PLAN', STYLE.title);
  setCell(sh5, 'B3', 'Build your timeline. Yellow = editable. Green = auto-calculated from PROFILE.', STYLE.subtitle);

  const headRow5 = 5;
  setCell(sh5, 'B' + headRow5, '#', STYLE.header);
  setCell(sh5, 'C' + headRow5, 'Action', STYLE.header);
  setCell(sh5, 'D' + headRow5, 'Deadline / Phase', STYLE.header);
  setCell(sh5, 'E' + headRow5, 'Priority', STYLE.header);
  setCell(sh5, 'F' + headRow5, 'Status', STYLE.header);
  setCell(sh5, 'G' + headRow5, 'Owner', STYLE.header);
  setCell(sh5, 'H' + headRow5, 'Notes / Links', STYLE.header);

  const actions = [
    [1, 'Confirm child\'s eligibility (SC/PR status, age)', 'Immediate', 'High', '', '', 'Check PROFILE!C11'],
    [2, 'Verify residential address on NRIC matches registration address', 'Immediate', 'High', '', '', '30-month stay rule may apply'],
    [3, 'Complete 40h parent volunteer hours (if targeting Phase 2B)', 'By 30 Jun year before reg', 'High', '', '', 'Must be done by 30 June prior year'],
    [4, 'Join alumni association (if targeting Phase 2A)', 'Before registration year', 'High', '', '', 'Check school alumni website'],
    [5, 'Shortlist 5-8 schools using DISTANCE & PRIORITY sheet', '6 months before reg', 'High', '', '', 'Consider <1km, 1-2km, >2km mix'],
    [6, 'Attend school open houses / virtual tours', 'Registration year Jan-Jun', 'Medium', '', '', 'Check school websites for dates'],
    [7, 'Prepare all required documents (BC, NRICs, proof of address)', '1 month before reg', 'High', '', '', 'See MOE document checklist'],
    [8, 'Register for Phase 1 (if eligible)', 'Phase 1 date (early Jul)', 'High', '', '', 'Online via MOE P1 portal'],
    [9, 'Register for Phase 2A (if eligible)', 'Phase 2A date (mid Jul)', 'High', '', '', 'Online via MOE P1 portal'],
    [10, 'Register for Phase 2B (if eligible)', 'Phase 2B dates (late Jul)', 'High', '', '', 'Online via MOE P1 portal'],
    [11, 'Register for Phase 2C (if eligible)', 'Phase 2C dates (early Aug)', 'High', '', '', 'Online via MOE P1 portal'],
    [12, 'Check balloting results', 'After each phase', 'High', '', '', 'MOE will notify via SMS/email'],
    [13, 'If not placed, register for Phase 2C Supplementary', 'Phase 2C Supp date (mid Aug)', 'High', '', '', 'Online via MOE P1 portal'],
    [14, 'If still not placed, consider Phase 3 (international students only)', 'Phase 3 date (late Oct)', 'Medium', '', '', 'Requires MOE approval letter'],
    [15, 'Accept offered place & complete admin', 'Within deadline', 'High', '', '', 'Submit required forms to school'],
  ];

  const startRow5 = headRow5 + 1;
  actions.forEach((a, i) => {
    const r = startRow5 + i;
    setCell(sh5, 'B' + r, a[0], STYLE.label);
    setCell(sh5, 'C' + r, a[1], { ...STYLE.inputText });
    setCell(sh5, 'D' + r, a[2], { ...STYLE.inputText });
    setCell(sh5, 'E' + r, a[3], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh5, 'F' + r, a[4], { ...STYLE.inputDropdown, alignment: { horizontal: 'center', vertical: 'middle' } });
    setCell(sh5, 'G' + r, a[5], { ...STYLE.inputText });
    setCell(sh5, 'H' + r, a[6], { ...STYLE.inputText });
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

  // Summary counts
  let summaryRow = lastRow5 + 3;
  setCell(sh5, 'B' + summaryRow, 'SUMMARY', STYLE.sectionHeader); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Total actions', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTA(C${startRow5}:C${lastRow5})` }, { ...STYLE.output }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'High priority', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(E${startRow5}:E${lastRow5},"High")` }, { ...STYLE.output, ...STYLE.danger }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Not Started', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"Not Started")` }, { ...STYLE.output }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'In Progress', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"In Progress")` }, { ...STYLE.output, ...STYLE.warning }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Done', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"Done")` }, { ...STYLE.output, ...STYLE.ok }); summaryRow++;
  setCell(sh5, 'B' + summaryRow, 'Blocked', STYLE.label); setCell(sh5, 'C' + summaryRow, { f: `COUNTIF(F${startRow5}:F${lastRow5},"Blocked")` }, { ...STYLE.output, ...STYLE.danger }); summaryRow++;

  sh5.getColumn('B').width = 5;
  sh5.getColumn('C').width = 48;
  sh5.getColumn('D').width = 28;
  sh5.getColumn('E').width = 14;
  sh5.getColumn('F').width = 16;
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