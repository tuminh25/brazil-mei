// scripts/generateHDBRenoSmart.js
// Generates: digital-products/hdb-renosmart-planner/HDB-RenoSmart-Budget-Compliance-Planner-2026.xlsx
const { STYLE, setCell, newWorkbook, addSheet, writeWorkbook } = require('./excel-helper');

const OUTPUT = 'digital-products/hdb-renosmart-planner/HDB-RenoSmart-Budget-Compliance-Planner-2026.xlsx';
const ASSUMP = 'ASSUMPTIONS';
const IN = 'INPUTS';
const CALC = 'CALCULATOR';
const COMP = 'COMPLIANCE';
const RES = 'RESULTS';
const SRC = 'SOURCES';

// ============================ START HERE ============================
function buildStartHere() {
  const ws = {};
const rows = [
    [2, 'HDB RenoSmart Budget & Compliance Planner 2026', STYLE.title],
    [3, 'Build a personalized renovation budget, compare scopes, plan contingency, estimate cash needs, and check HDB compliance - all in one workbook.', STYLE.subtitle],
    [5, 'WHY THIS WORKBOOK EXISTS', STYLE.subHeader],
    [6, 'The guide at /guides/hdb-renovation-cost-guide-singapore gives cost ranges and regulations. But applying those to YOUR flat - your floor area, your BTO vs resale, your renovation scope, your contingency comfort, and your compliance checks - still requires calculations. This workbook does that math for you.', STYLE.label],
    [8, 'WHAT YOU GET', STYLE.subHeader],
    [9, '- INPUTS - flat type (3/4/5-room), property type (BTO/Resale), floor area (sqm), renovation scope (Light/Moderate/Extensive), and per-category cost overrides.', STYLE.label],
    [10, '- CALCULATOR - transparent formulas using baseline market estimates x property factor x scope factor x floor-area factor, plus contingency and GST.', STYLE.label],
    [11, '- COMPLIANCE CHECKER - flags for HDB-registered contractor, hacking permit, BTO toilet-hacking restriction, structural work, electrical licensing, fire-door rules, completion deadlines, and staged payments.', STYLE.label],
    [12, '- RESULTS - dashboard with base budget, GST, contingency, total, planning range, largest cost categories, cash requirement, payment plan, and compliance warnings.', STYLE.label],
    [14, 'HOW TO USE - 3 STEPS', STYLE.subHeader],
    [15, 'STEP 1 . Go to INPUTS. Set your flat type, property type, floor area, and renovation scope. Leave "Your quote" blank to use auto-estimates, or type your real contractor quotes.', STYLE.label],
    [16, 'STEP 2 . Adjust the contingency rate and GST treatment on INPUTS to match your risk. Review the Compliance Checker for any WARNING items.', STYLE.label],
    [17, 'STEP 3 . Read your plan on RESULTS. Build your cash reserve, set payment milestones, and resolve warnings before signing any contract.', STYLE.label],
    [19, 'WHAT IS ESTIMATED vs OFFICIAL vs PLANNING ASSUMPTION vs USER INPUT', STYLE.subHeader],
    [20, '- Official: HDB compliance rules (contractor registration, hacking permit, BTO toilet-hacking restriction, completion deadlines, electrical licensing, fire-door rules, structural engineer requirements).', STYLE.label],
    [21, '- Market estimate: Baseline category cost ranges (kitchen, bathroom, flooring, etc.) from industry research.', STYLE.label],
    [22, '- Planning assumption: Property type factor, renovation scope factor, floor-area factor (FloorArea/90)^0.6, contingency rates, payment milestones, GST treatment.', STYLE.label],
    [23, '- User input: Your flat details, renovation scope, actual contractor quotes, contingency override.', STYLE.label],
    [24, 'LIMITATIONS & DISCLAIMER', STYLE.subHeader],
    [25, 'This tool provides planning estimates only - not a quotation, not financial or legal advice, and no guarantee of approval. Prices and HDB rules change; verify before committing.', STYLE.warnText],
    [27, 'Yellow = editable input  .  Green = auto-calculated  .  Do not type into green cells.', STYLE.note],
  ];
  rows.forEach(([r, t, s]) => setCell(ws, 'B' + r, t, s));
  ws['!cols'] = [{ wch: 26 }, { wch: 110 }];
  return ws;
}

// ============================ ASSUMPTIONS ============================
function buildAssumptions() {
  const ws = {};
  setCell(ws, 'A1', 'source', STYLE.note);
  setCell(ws, 'B2', 'COST ASSUMPTIONS & FACTORS', STYLE.title);
  setCell(ws, 'B3', 'All values below are editable. Research-based market estimates — not official costs. Refresh here without rebuilding the workbook.', STYLE.note);

  let r = 5;
  setCell(ws, 'B' + r, 'BASELINE CATEGORY ESTIMATES · 4-room RESALE · MODERATE scope', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Category', STYLE.header); setCell(ws, 'C' + r, 'Low (S$)', STYLE.header);
  setCell(ws, 'D' + r, 'High (S$)', STYLE.header); setCell(ws, 'E' + r, 'Source / note', STYLE.header); r++;

  const base = {
    kitchen: [8900, 23200, 'Market research estimates: mid-range kitchen w/ cabinetry, hob, hood, tiling', 'Market estimate'],
    bathroom: [2600, 5200, 'Market research estimates: S$1,300 - S$2,600 per bathroom, ~2 bathrooms typical', 'Market estimate'],
    flooring: [5000, 12000, 'Market estimate: tiling/laminate whole 4-room flat', 'Market estimate'],
    painting: [2500, 6000, 'Market estimate incl. prep & paint for whole flat', 'Market estimate'],
    carpentry: [6000, 15000, 'Market research estimates: built-in wardrobes & custom carpentry', 'Market estimate'],
    electrical: [3000, 6000, 'Market research estimates: rewiring ~S$3,000 + power/lighting points', 'Market estimate'],
    hacking: [2000, 6000, 'Market estimate; escalates for resale / heavy structural works', 'Market estimate'],
    builtin: [6000, 15000, 'Custom cabinets, wall units, feature walls', 'Market estimate'],
    appliances: [3000, 10000, 'Hob, hood, washer, dryer, fridge if not in kitchen quote', 'Market estimate'],
    userdefined: [0, 0, 'Enter your own known line items', 'User input'],
  };
  const blRows = {};
  Object.keys(base).forEach(k => { blRows[k] = r; const [lo, hi, note, src] = base[k];
    setCell(ws, 'B' + r, k, STYLE.label);
    setCell(ws, 'C' + r, lo, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + r, hi, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'E' + r, note, STYLE.note);
    setCell(ws, 'F' + r, src, STYLE.note);
    r++;
  });

  r++;
  setCell(ws, 'B' + r, 'PROPERTY TYPE FACTOR (multiplies baseline)', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, 'Property', STYLE.header); setCell(ws, 'C' + r, 'Factor', STYLE.header); setCell(ws, 'D' + r, 'Note', STYLE.header); setCell(ws, 'E' + r, 'Source type', STYLE.header); r++;
  setCell(ws, 'B' + r, 'BTO (new)', STYLE.label); const pBTO = 'C' + r; setCell(ws, pBTO, 0.82, { ...STYLE.output }); setCell(ws, 'D' + r, 'BTO typically 15–25% cheaper than resale for same scope', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Resale', STYLE.label); const pRes = 'C' + r; setCell(ws, pRes, 1.0, { ...STYLE.output }); setCell(ws, 'D' + r, 'Baseline (4-room resale moderate = 1.0)', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'RENOVATION SCOPE FACTOR', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, 'Scope', STYLE.header); setCell(ws, 'C' + r, 'Factor', STYLE.header); setCell(ws, 'D' + r, 'Description', STYLE.header); setCell(ws, 'E' + r, 'Source type', STYLE.header); r++;
  setCell(ws, 'B' + r, 'Light', STYLE.label); const sL = 'C' + r; setCell(ws, sL, 0.7, { ...STYLE.output }); setCell(ws, 'D' + r, 'Cosmetic: paint, flooring, minor carpentry, no hacking', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Moderate', STYLE.label); const sM = 'C' + r; setCell(ws, sM, 1.0, { ...STYLE.output }); setCell(ws, 'D' + r, 'Standard: kitchen + 1-2 bathrooms + flooring + carpentry', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Extensive', STYLE.label); const sE = 'C' + r; setCell(ws, sE, 1.4, { ...STYLE.output }); setCell(ws, 'D' + r, 'Full transform: all wet areas, heavy carpentry, structural, new layout', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'FLAT SIZE FACTOR (per sqm, relative to 90 sqm 4-room baseline)', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, '⚠ Planning / modeling assumption — NOT an official HDB rule or proven market law', STYLE.warning); r++;
  setCell(ws, 'B' + r, 'Input floor area (sqm) is on INPUTS!C8. Formula: (FloorArea / 90)^0.6', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Exponent 0.6 reflects diminishing per-sqm cost for larger flats (economies of scale in wet works, tiling, painting).', STYLE.note); r++;
  setCell(ws, 'B' + r, '3-room (~67 sqm) ~ 0.82x  |  4-room (~90 sqm) = 1.0x  |  5-room (~110 sqm) ~ 1.25x', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Source type: Planning / modeling assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'To override: enter a manual factor in cell C' + r, STYLE.note); 
  const fManual = 'C' + r; setCell(ws, fManual, 1.0, { ...STYLE.input }); setCell(ws, 'D' + r, 'Set to 1.0 to use formula; set to custom value to override', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'CONTINGENCY BASE RATE BY SCOPE', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, 'Scope', STYLE.header); setCell(ws, 'C' + r, 'Base Rate', STYLE.header); setCell(ws, 'D' + r, 'Note', STYLE.header); setCell(ws, 'E' + r, 'Source type', STYLE.header); r++;
  setCell(ws, 'B' + r, 'Light', STYLE.label); const cL = 'C' + r; setCell(ws, cL, 0.08, { ...STYLE.output, ...STYLE.pct }); setCell(ws, 'D' + r, 'Lower risk - fewer unknowns', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Moderate', STYLE.label); const cM = 'C' + r; setCell(ws, cM, 0.12, { ...STYLE.output, ...STYLE.pct }); setCell(ws, 'D' + r, 'Standard recommendation', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Extensive', STYLE.label); const cE = 'C' + r; setCell(ws, cE, 0.15, { ...STYLE.output, ...STYLE.pct }); setCell(ws, 'D' + r, 'Higher risk — more unknowns, structural, layout changes', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'GST TREATMENT', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, 'Current GST rate', STYLE.label); const gstRate = 'C' + r; setCell(ws, gstRate, 0.09, { ...STYLE.output, ...STYLE.pct }); setCell(ws, 'D' + r, 'IRAS official rate from 2024', STYLE.note); setCell(ws, 'E' + r, 'Official (IRAS)', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Baseline prices include GST?', STYLE.label); const gstIncl = 'C' + r; setCell(ws, gstIncl, false, { ...STYLE.input }); setCell(ws, 'D' + r, 'FALSE = add GST on top of baseline; TRUE = baseline already includes GST', STYLE.note); setCell(ws, 'E' + r, 'Planning assumption', STYLE.note); r++;
  setCell(ws, 'B' + r, 'If FALSE, GST is added to base budget only', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'PAYMENT MILESTONES (planning assumption — edit to match your contractor)', STYLE.subHeader); r++;
  setCell(ws, 'B' + r, 'Stage', STYLE.header); setCell(ws, 'C' + r, '% of Total', STYLE.header); setCell(ws, 'D' + r, 'Typical Trigger', STYLE.header); r++;
  const payStages = [
    ['Deposit at signing', 0.15, 'Contract signing'],
    ['Hacking / demolition complete', 0.20, 'After hacking & debris removal'],
    ['Wet works complete (tiling, waterproofing)', 0.30, 'Bathroom/kitchen waterproofing done'],
    ['Carpentry & M&E complete', 0.20, 'Built-ins installed, electrical done'],
    ['Final on completion', 0.15, 'Project signed off, keys handed over'],
  ];
  payStages.forEach((st, i) => {
    const rr = r + 1 + i;
    setCell(ws, 'B' + rr, st[0], STYLE.label);
    setCell(ws, 'C' + rr, st[1], { ...STYLE.input, ...STYLE.pct });
    setCell(ws, 'D' + rr, st[2], STYLE.note);
  });
  const payEnd = r + payStages.length;
  setCell(ws, 'B' + (payEnd + 1), 'Total (must = 100%)', STYLE.labelBold);
  setCell(ws, 'C' + (payEnd + 1), { f: `SUM(C${r+1}:C${payEnd})` }, { ...STYLE.output, ...STYLE.pct });

  ws['!cols'] = [{ wch: 32 }, { wch: 16 }, { wch: 16 }, { wch: 68 }, { wch: 20 }];
  return { ws, refs: { pBTO, pRes, sL, sM, sE, fManual, cL, cM, cE, gstRate, gstIncl, payEnd }, blRows };
}

// ============================ INPUTS ============================
function buildInputs(assump) {
  const ws = {};
  setCell(ws, 'B2', 'STEP 1 · YOUR FLAT, SCOPE & COSTS', STYLE.title);
  setCell(ws, 'B3', 'Edit ONLY the yellow cells. Leave "Your quote" blank to use auto-estimates, or enter your real contractor quotes.', STYLE.subtitle);

  // Flat & Scope section
  setCell(ws, 'B5', 'YOUR FLAT & SCOPE', STYLE.sectionHeader);
  setCell(ws, 'B6', 'Flat type', STYLE.labelBold); setCell(ws, 'C6', '4-room', { ...STYLE.inputDropdown });
  setCell(ws, 'B7', 'Property type', STYLE.labelBold); setCell(ws, 'C7', 'Resale', { ...STYLE.inputDropdown });
  setCell(ws, 'B8', 'Floor area (sqm)', STYLE.labelBold); setCell(ws, 'C8', 90, { ...STYLE.input, ...STYLE.money });
  setCell(ws, 'D8', 'Enter your actual floor area from HDB floor plan', STYLE.note);
  setCell(ws, 'B9', 'Renovation scope', STYLE.labelBold); setCell(ws, 'C9', 'Moderate', { ...STYLE.inputDropdown });

  // Category table
  setCell(ws, 'B11', 'ESTIMATES & QUOTES BY CATEGORY', STYLE.sectionHeader);
  setCell(ws, 'B12', 'Work category', STYLE.header); setCell(ws, 'C12', 'Low est (auto)', STYLE.header);
  setCell(ws, 'D12', 'High est (auto)', STYLE.header); setCell(ws, 'E12', 'Your quote (blank = auto)', STYLE.header);
  setCell(ws, 'F12', 'Low used', STYLE.header); setCell(ws, 'G12', 'High used', STYLE.header);

  const cats = [
    ['Kitchen renovation', 'kitchen'],
    ['Bathroom renovation', 'bathroom'],
    ['Flooring', 'flooring'],
    ['Painting', 'painting'],
    ['Carpentry', 'carpentry'],
    ['Electrical', 'electrical'],
    ['Hacking', 'hacking'],
    ['Built-in furniture', 'builtin'],
    ['Appliances / optional items', 'appliances'],
    ['User-defined costs', 'userdefined'],
  ];

  // Build the factor formula components
  const propFactor = `IF($C$7="BTO",${ASSUMP}!${assump.refs.pBTO},${ASSUMP}!${assump.refs.pRes})`;
  const scopeFactor = `IF($C$9="Light",${ASSUMP}!${assump.refs.sL},IF($C$9="Extensive",${ASSUMP}!${assump.refs.sE},${ASSUMP}!${assump.refs.sM}))`;
  // Floor area factor: (C8/90)^0.6, or manual override from Assumptions
  const floorFactor = `IF(${ASSUMP}!${assump.refs.fManual}=1.0,ROUND(($C$8/90)^0.6,3),${ASSUMP}!${assump.refs.fManual})`;
  const totalMult = `(${propFactor})*(${scopeFactor})*(${floorFactor})`;

  const startRow = 13;
  cats.forEach((c, i) => {
    const rr = startRow + i;
    const bl = assump.blRows[c[1]];
    setCell(ws, 'B' + rr, c[0], STYLE.label);
    setCell(ws, 'C' + rr, { f: `ROUND(${ASSUMP}!C${bl}*${totalMult},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + rr, { f: `ROUND(${ASSUMP}!D${bl}*${totalMult},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'E' + rr, null, { ...STYLE.input, ...STYLE.money });
    setCell(ws, 'F' + rr, { f: `IF($E${rr}="",C${rr},$E${rr})` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'G' + rr, { f: `IF($E${rr}="",D${rr},$E${rr})` }, { ...STYLE.output, ...STYLE.money });
  });

  const lastRow = startRow + cats.length - 1; // 22
  const baseRow = 24;   // F
  const lowRow = 25;    // F
  const highRow = 26;   // F
  const gstRow = 27;    // F
  const contRow = 29;   // C (rate)
  const totalRow = 31;  // E
  const optionalRow = 30; // E
  const loanRow = 34;   // C
  const cashRow = 36;   // E
  const reserveRow = 35;// E

  setCell(ws, 'B' + baseRow, 'ESTIMATED BASE BUDGET (mid-point of auto/quotes)', STYLE.labelBold);
  setCell(ws, 'F' + baseRow, { f: `(SUM(F${startRow}:F${lastRow})+SUM(G${startRow}:G${lastRow}))/2` }, { ...STYLE.outputBig, ...STYLE.money });
  setCell(ws, 'B' + lowRow, 'LOW PLANNING RANGE', STYLE.labelBold);
  setCell(ws, 'F' + lowRow, { f: `SUM(F${startRow}:F${lastRow})` }, { ...STYLE.output, ...STYLE.money });
  setCell(ws, 'B' + highRow, 'HIGH PLANNING RANGE', STYLE.labelBold);
  setCell(ws, 'F' + highRow, { f: `SUM(G${startRow}:G${lastRow})` }, { ...STYLE.output, ...STYLE.money });

  // GST calculation
  setCell(ws, 'B' + gstRow, 'GST (9%) on base budget', STYLE.label);
  setCell(ws, 'F' + gstRow, { f: `IF(${ASSUMP}!${assump.refs.gstIncl},0,ROUND(F${baseRow}*${ASSUMP}!${assump.refs.gstRate},0))` }, { ...STYLE.output, ...STYLE.money });
  setCell(ws, 'D' + gstRow, 'Assumes baseline prices are GST-exclusive. Set ASSUMPTIONS!' + assump.refs.gstIncl + ' to TRUE if quotes include GST', STYLE.note);

  // Contingency - use scope-based default but allow override
  setCell(ws, 'B28', 'CONTINGENCY & TOTALS', STYLE.sectionHeader);
  setCell(ws, 'B' + contRow, 'Contingency rate', STYLE.labelBold); 
  setCell(ws, 'C' + contRow, { f: `IF($C$9="Light",${ASSUMP}!${assump.refs.cL},IF($C$9="Extensive",${ASSUMP}!${assump.refs.cE},${ASSUMP}!${assump.refs.cM}))` }, { ...STYLE.output, ...STYLE.pct });
  setCell(ws, 'D' + contRow, 'Default by scope. Override by typing your own % in this cell.', STYLE.note);
  setCell(ws, 'B' + optionalRow, 'Optional items subtotal (appliances + user-defined)', STYLE.label);
  setCell(ws, 'E' + optionalRow, { f: `(F${startRow+8}+G${startRow+8}+F${startRow+9}+G${startRow+9})/2` }, { ...STYLE.output, ...STYLE.money });
  setCell(ws, 'B' + totalRow, 'ESTIMATED TOTAL (base + GST + contingency)', STYLE.labelBold);
  // Total = base + GST + (base * contingency)
  setCell(ws, 'E' + totalRow, { f: `ROUND(F${baseRow}+F${gstRow}+F${baseRow}*C${contRow},0)` }, { ...STYLE.outputBig, ...STYLE.money });

  setCell(ws, 'B33', 'CASH & PAYMENT', STYLE.sectionHeader);
  setCell(ws, 'B' + loanRow, 'Renovation loan planned (S$)', STYLE.label); setCell(ws, 'C' + loanRow, 0, { ...STYLE.input, ...STYLE.money });
  setCell(ws, 'B' + reserveRow, 'Contingency reserve amount', STYLE.label);
  setCell(ws, 'E' + reserveRow, { f: `ROUND(F${baseRow}*C${contRow},0)` }, { ...STYLE.output, ...STYLE.money });
  setCell(ws, 'B' + cashRow, 'CASH YOU MUST COVER (total − loan)', STYLE.labelBold);
  setCell(ws, 'E' + cashRow, { f: `MAX(0,E${totalRow}-C${loanRow})` }, { ...STYLE.output, ...STYLE.money });

  // Staged payment plan - reference Assumptions payment stages
  const payStart = 38;
  setCell(ws, 'B' + payStart, 'STAGED PAYMENT PLAN (edit % to match your contractor agreement)', STYLE.subHeader);
  setCell(ws, 'B' + (payStart+1), 'Stage', STYLE.header); setCell(ws, 'C' + (payStart+1), '% of Total', STYLE.header);
  setCell(ws, 'D' + (payStart+1), 'Amount (S$)', STYLE.header); setCell(ws, 'E' + (payStart+1), 'Typical Trigger', STYLE.header);
  const payStagesCount = 5;
  for (let i = 0; i < payStagesCount; i++) {
    const rr = payStart + 2 + i;
    const assumpRow = assump.refs.payEnd - payStagesCount + 1 + i;
    setCell(ws, 'B' + rr, { f: `${ASSUMP}!B${assumpRow}` }, STYLE.label);
    setCell(ws, 'C' + rr, { f: `${ASSUMP}!C${assumpRow}` }, { ...STYLE.input, ...STYLE.pct });
    setCell(ws, 'D' + rr, { f: `ROUND(E${totalRow}*C${rr},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'E' + rr, { f: `${ASSUMP}!D${assumpRow}` }, STYLE.note);
  }
  const paySumRow = payStart + 2 + payStagesCount;
  setCell(ws, 'B' + paySumRow, 'Total (must = 100%)', STYLE.labelBold);
  setCell(ws, 'C' + paySumRow, { f: `SUM(C${payStart+2}:C${paySumRow-1})` }, { ...STYLE.output, ...STYLE.pct });

  ws['!validations'] = [
    { type: 'list', formula1: '"3-room,4-room,5-room"', ranges: [['C6', 'C6']] },
    { type: 'list', formula1: '"BTO,Resale"', ranges: [['C7', 'C7']] },
    { type: 'list', formula1: '"Light,Moderate,Extensive"', ranges: [['C9', 'C9']] },
  ];
  ws['!cols'] = [{ wch: 36 }, { wch: 32 }, { wch: 16 }, { wch: 16 }, { wch: 28 }, { wch: 16 }, { wch: 16 }];

  return { ws, refs: {
    baseRow, lowRow, highRow, gstRow, contRow, totalRow, optionalRow, loanRow, cashRow, reserveRow,
    catsStart: startRow, cats, payStart, paySumRow, lastRow,
  } };
}

// ============================ CALCULATOR ============================
function buildCalculator(inRef, assump) {
  const ws = {};
  const iv = (col, row) => `${IN}!${col}${row}`;
  // av() now accepts a full cell reference like 'C43' and returns 'ASSUMPTIONS!C43'
  const av = (cellRef) => `${ASSUMP}!${cellRef}`;

  setCell(ws, 'B2', 'CALCULATOR · TRANSPARENT FORMULAS', STYLE.title);
  setCell(ws, 'B3', 'All formulas reference INPUTS and ASSUMPTIONS. Green cells = calculated. Do not edit.', STYLE.note);

  let r = 5;
  setCell(ws, 'B' + r, 'FACTOR BREAKDOWN', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Factor', STYLE.header); setCell(ws, 'C' + r, 'Value', STYLE.header); setCell(ws, 'D' + r, 'Formula / Source', STYLE.header); r++;

  setCell(ws, 'B' + r, 'Property factor', STYLE.label); setCell(ws, 'C' + r, { f: `IF(${iv('C',7)}="BTO",${av(assump.refs.pBTO)},${av(assump.refs.pRes)})` }, { ...STYLE.output }); setCell(ws, 'D' + r, 'From Assumptions table', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Scope factor', STYLE.label); setCell(ws, 'C' + r, { f: `IF(${iv('C',9)}="Light",${av(assump.refs.sL)},IF(${iv('C',9)}="Extensive",${av(assump.refs.sE)},${av(assump.refs.sM)}))` }, { ...STYLE.output }); setCell(ws, 'D' + r, 'From Assumptions table', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Floor-area factor', STYLE.label); setCell(ws, 'C' + r, { f: `IF(${av(assump.refs.fManual)}=1.0,ROUND((${iv('C',8)}/90)^0.6,3),${av(assump.refs.fManual)})` }, { ...STYLE.output }); setCell(ws, 'D' + r, '=(FloorArea/90)^0.6 or manual override', STYLE.note); r++;
  setCell(ws, 'B' + r, 'Combined multiplier', STYLE.labelBold); setCell(ws, 'C' + r, { f: `C${r-3}*C${r-2}*C${r-1}` }, { ...STYLE.output }); setCell(ws, 'D' + r, 'Property × Scope × Floor-area', STYLE.note); r++;

  r++;
  setCell(ws, 'B' + r, 'CATEGORY CALCULATIONS (Low / High)', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Category', STYLE.header); setCell(ws, 'C' + r, 'Baseline Low', STYLE.header);
  setCell(ws, 'D' + r, 'Baseline High', STYLE.header); setCell(ws, 'E' + r, 'Multiplier', STYLE.header);
  setCell(ws, 'F' + r, 'Calc Low', STYLE.header); setCell(ws, 'G' + r, 'Calc High', STYLE.header);
  setCell(ws, 'H' + r, 'Your Quote Low', STYLE.header); setCell(ws, 'I' + r, 'Your Quote High', STYLE.header);
  setCell(ws, 'J' + r, 'Final Low Used', STYLE.header); setCell(ws, 'K' + r, 'Final High Used', STYLE.header); r++;

  const cats = inRef.refs.cats;
  const startRow = inRef.refs.catsStart;
  cats.forEach((c, i) => {
    const rr = r + i;
    const dr = startRow + i;
    const bl = assump.blRows[c[1]];
    setCell(ws, 'B' + rr, c[0], STYLE.label);
    setCell(ws, 'C' + rr, { f: `${ASSUMP}!C${bl}` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + rr, { f: `${ASSUMP}!D${bl}` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'E' + rr, { f: `C${r-3}` }, { ...STYLE.output }); // combined multiplier from above
    setCell(ws, 'F' + rr, { f: `ROUND(C${rr}*E${rr},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'G' + rr, { f: `ROUND(D${rr}*E${rr},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'H' + rr, { f: `${iv('E', dr)}` }, { ...STYLE.input, ...STYLE.money });
    setCell(ws, 'I' + rr, { f: `${iv('E', dr)}` }, { ...STYLE.input, ...STYLE.money });
    setCell(ws, 'J' + rr, { f: `IF(H${rr}="",F${rr},H${rr})` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'K' + rr, { f: `IF(I${rr}="",G${rr},I${rr})` }, { ...STYLE.output, ...STYLE.money });
  });

  const catEnd = r + cats.length - 1;
  r = catEnd + 2;

  setCell(ws, 'B' + r, 'AGGREGATE TOTALS', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Sum of Final Low Used', STYLE.label); setCell(ws, 'C' + r, { f: `SUM(J${r - cats.length - 1}:J${catEnd})` }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'Sum of Final High Used', STYLE.label); setCell(ws, 'C' + r, { f: `SUM(K${r - cats.length - 2}:K${catEnd})` }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'Base Budget (mid-point)', STYLE.labelBold); setCell(ws, 'C' + r, { f: `(C${r-2}+C${r-1})/2` }, { ...STYLE.outputBig, ...STYLE.money }); r++;

  setCell(ws, 'B' + r, 'GST (9%)', STYLE.label); setCell(ws, 'C' + r, { f: `IF(${av(assump.refs.gstIncl)},0,ROUND(C${r-1}*${av(assump.refs.gstRate)},0))` }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'Contingency', STYLE.label); setCell(ws, 'C' + r, { f: `ROUND(C${r-2}*${iv('C', inRef.refs.contRow)},0)` }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'ESTIMATED TOTAL', STYLE.labelBold); setCell(ws, 'C' + r, { f: `C${r-3}+C${r-2}+C${r-1}` }, { ...STYLE.outputBig, ...STYLE.money }); r++;

  ws['!cols'] = [{ wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
  return { ws, refs: { catStart: r - cats.length - 1, catEnd, baseRow: r - 2, gstRow: r - 1, contRow: r, totalRow: r + 1 } };
}

// ============================ COMPLIANCE ============================
function buildCompliance(inRef) {
  const ws = {};
  setCell(ws, 'B2', 'COMPLIANCE CHECKER', STYLE.title);
  setCell(ws, 'B3', 'Status: OK ✓  ·  CHECK ⚠ (confirm with HDB/contractor)  ·  WARNING ⛔ (resolve before proceeding). Based on HDB guidance; always confirm current rules on the HDB portal.', STYLE.note);

  const headRow = 5;
  setCell(ws, 'B' + headRow, '#', STYLE.header); setCell(ws, 'C' + headRow, 'Check', STYLE.header); setCell(ws, 'D' + headRow, 'Applies to', STYLE.header);
  setCell(ws, 'E' + headRow, 'Status', STYLE.header); setCell(ws, 'F' + headRow, 'Source / Note', STYLE.header);

  // Compliance checks with formulas referencing INPUTS
  const checks = [
    [1, 'HDB-registered renovation contractor', 'All flats — mandatory', '"OK"', 'HDB Directory of Renovation Contractors; HDB renovation rules', 'Official requirement'],
    [2, 'Permit for hacking / wall & floor alteration', 'If scope ≠ Light', `IF(${IN}!$C$9="Light","OK","CHECK")`, 'HDB permit required for hacking, floor level changes, door facing escape route', 'Official requirement'],
    [3, 'New BTO toilet-hacking restriction (first 3 years)', 'Only BTO flats', `IF(${IN}!$C$7="BTO","WARNING","OK")`, 'HDB: no removing toilet wall/floor finishes in first 3 years of new BTO', 'Official requirement'],
    [4, 'Completion deadline', 'All flats', `IF(${IN}!$C$7="BTO","CHECK (3 months)","CHECK (1 month)")`, 'HDB: 3 months for new BTO, 1 month for resale from permit date', 'Official requirement'],
    [5, 'Electrical works by licensed wireman', 'If adding/rewiring points', `IF(OR(${IN}!F18>0,${IN}!G18>0),"CHECK","N/A")`, 'EMA/EMA-licensed electrical worker required for new wiring', 'Official requirement'],
    [6, 'Main entrance door facing lift/staircase (fire escape)', 'If door faces common escape route', `IF(OR(${IN}!F19>0,${IN}!G19>0),"CHECK","N/A")`, 'SCDF/HDB: fire-rated door + permit required for doors facing escape routes', 'Official requirement'],
    [7, 'Staged payments aligned to milestones', 'All flats', '"OK"', 'Avoid paying for incomplete stages; tie payments to verified milestones', 'Planning assumption'],
    [8, 'Waterproofing certification for wet areas', 'If bathroom/kitchen renovated', `IF(OR(${IN}!F14>0,${IN}!G14>0,${IN}!F13>0,${IN}!G13>0),"CHECK","N/A")`, 'HDB requires waterproofing membrane certification for wet areas', 'Official requirement'],
    [9, 'Structural engineer for load-bearing wall changes', 'If hacking structural walls', `IF(OR(${IN}!F19>0,${IN}!G19>0),"WARNING","N/A")`, 'HDB requires PE endorsement for any structural alterations', 'Official requirement'],
  ];

  const start = headRow + 1;
  checks.forEach((c, i) => {
    const rr = start + i;
    setCell(ws, 'B' + rr, c[0], STYLE.label);
    setCell(ws, 'C' + rr, c[1], STYLE.label);
    setCell(ws, 'D' + rr, c[2], STYLE.note);
    setCell(ws, 'E' + rr, { f: c[3] }, STYLE.ok);
    setCell(ws, 'F' + rr, c[4], STYLE.note);
    setCell(ws, 'G' + rr, c[5], STYLE.note);
  });

  // Warning count
  const warnRow = start + checks.length + 1;
  setCell(ws, 'B' + warnRow, 'WARNING COUNT (dashboard uses this)', STYLE.labelBold);
  setCell(ws, 'C' + warnRow, { f: `COUNTIF(E${start}:E${start+checks.length-1},"WARNING")` }, { ...STYLE.danger });
  setCell(ws, 'B' + (warnRow+1), 'CHECK COUNT', STYLE.label);
  setCell(ws, 'C' + (warnRow+1), { f: `COUNTIF(E${start}:E${start+checks.length-1},"CHECK*")` }, { ...STYLE.warning });

  // Conditional formatting for status column
  ws['!cols'] = [{ wch: 5 }, { wch: 44 }, { wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 70 }, { wch: 22 }];
  return { ws, warnRow };
}

// ============================ RESULTS ============================
function buildResults(inRef, compRef) {
  const ws = {};
  const iv = (col, row) => `${IN}!${col}${row}`;
  const cv = (col, row) => `${CALC}!${col}${row}`;

  setCell(ws, 'B2', 'RESULTS · YOUR RENOVATION PLAN DASHBOARD', STYLE.title);
  setCell(ws, 'B3', 'All values below update automatically from INPUTS and CALCULATOR.', STYLE.note);

  let r = 5;
  setCell(ws, 'B' + r, 'KEY NUMBERS', STYLE.sectionHeader); r++;

  const keys = [
    ['Estimated base renovation budget', iv('F', inRef.refs.baseRow)],
    ['GST (9%)', iv('F', inRef.refs.gstRow)],
    ['Contingency reserve', iv('E', inRef.refs.reserveRow)],
    ['Optional items subtotal', iv('E', inRef.refs.optionalRow)],
    ['ESTIMATED TOTAL (base + GST + contingency)', iv('E', inRef.refs.totalRow)],
    ['Renovation loan planned', iv('C', inRef.refs.loanRow)],
    ['CASH YOU MUST COVER (total − loan)', iv('E', inRef.refs.cashRow)],
  ];
  keys.forEach(([label, ref]) => { setCell(ws, 'B' + r, label, STYLE.labelBold); setCell(ws, 'C' + r, { f: ref }, { ...STYLE.outputBig, ...STYLE.money }); r++; });

  r++;
  setCell(ws, 'B' + r, 'PLANNING RANGE', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Low planning range', STYLE.label); setCell(ws, 'C' + r, { f: iv('F', inRef.refs.lowRow) }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'High planning range', STYLE.label); setCell(ws, 'C' + r, { f: iv('F', inRef.refs.highRow) }, { ...STYLE.output, ...STYLE.money }); r++;

  r++;
  setCell(ws, 'B' + r, 'COST CATEGORIES (mid-point of Low/High used)', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Category', STYLE.header); setCell(ws, 'C' + r, 'Amount (S$)', STYLE.header); setCell(ws, 'D' + r, '% of Base', STYLE.header); setCell(ws, 'E' + r, 'Is Max', STYLE.header); r++;

  const cats = inRef.refs.cats;
  const startRow = inRef.refs.catsStart;
  cats.forEach((c, i) => {
    const rr = r + i;
    const dr = startRow + i;
    setCell(ws, 'B' + rr, c[0], STYLE.label);
    setCell(ws, 'C' + rr, { f: `(${iv('F', dr)}+${iv('G', dr)})/2` }, { ...STYLE.output, ...STYLE.money });
    // Percentage of base budget - handle division by zero
    setCell(ws, 'D' + rr, { f: `IF(${iv('F', inRef.refs.baseRow)}=0,0,((${iv('F', dr)}+${iv('G', dr)})/2)/${iv('F', inRef.refs.baseRow)})` }, { ...STYLE.output, ...STYLE.pct });
    // Helper: flag if this category equals the maximum (will be evaluated after max is known)
    setCell(ws, 'E' + rr, { f: `IF(C${rr}=0,0,IF(C${rr}=MAX(C${r}:C${r + cats.length - 1}),1,0))` }, { ...STYLE.output });
  });
  const catEndRow = r + cats.length - 1;

  r = catEndRow + 2;
  setCell(ws, 'B' + r, 'LARGEST COST CATEGORIES (handles ties)', STYLE.sectionHeader); r++;
  // Use a helper column approach: column E flags max categories, then TEXTJOIN collects names
  setCell(ws, 'B' + r, 'Maximum category amount', STYLE.label);
  setCell(ws, 'C' + r, { f: `MAX(C${r - cats.length - 1}:C${catEndRow})` }, { ...STYLE.output, ...STYLE.money }); r++;
  setCell(ws, 'B' + r, 'Categories at maximum', STYLE.label);
  const nameRange = `B${r - cats.length - 1}:B${catEndRow}`;
  const flagRange = `E${r - cats.length - 1}:E${catEndRow}`;
  setCell(ws, 'C' + r, { f: `TEXTJOIN(", ",TRUE,IF(${flagRange}=1,${nameRange},""))` }, { ...STYLE.outputText }); r++;

  r++;
  setCell(ws, 'B' + r, 'PAYMENT PLANNING', STYLE.sectionHeader); r++;
  const payStart = inRef.refs.payStart;
  for (let i = 0; i < 5; i++) {
    const rr = payStart + 2 + i;
    setCell(ws, 'B' + r, { f: `${IN}!B${rr}` }, STYLE.label);
    setCell(ws, 'C' + r, { f: `${IN}!D${rr}` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + r, { f: `${IN}!E${rr}` }, STYLE.note);
    r++;
  }
  setCell(ws, 'B' + r, 'Total (verify = 100%)', STYLE.labelBold);
  setCell(ws, 'C' + r, { f: `${IN}!C${inRef.refs.paySumRow}` }, { ...STYLE.output, ...STYLE.pct }); r++;

  r++;
  setCell(ws, 'B' + r, 'COMPLIANCE SUMMARY', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'WARNING count (must be 0 before proceeding)', STYLE.labelBold);
  setCell(ws, 'C' + r, { f: `${COMP}!C${compRef.warnRow}` }, { ...STYLE.danger }); r++;
  setCell(ws, 'B' + r, 'CHECK count (review each)', STYLE.label);
  setCell(ws, 'C' + r, { f: `${COMP}!C${compRef.warnRow+1}` }, { ...STYLE.warning }); r++;

  ws['!cols'] = [{ wch: 44 }, { wch: 44 }, { wch: 22 }, { wch: 16 }, { wch: 10 }];
  return ws;
}

// ============================ SOURCES ============================
function buildSources() {
  const ws = {};
  setCell(ws, 'B2', 'DATA SOURCES & VERIFICATION', STYLE.title);
  setCell(ws, 'B3', 'All cost estimates are research-based planning assumptions. Regulatory items cite official HDB/SCDF/EMA sources. Verify current rules before committing.', STYLE.note);

  const headRow = 5;
  setCell(ws, 'B' + headRow, 'Topic', STYLE.header); setCell(ws, 'C' + headRow, 'Value / Rule', STYLE.header);
  setCell(ws, 'D' + headRow, 'Source', STYLE.header); setCell(ws, 'E' + headRow, 'URL', STYLE.header);
  setCell(ws, 'F' + headRow, 'Source Type', STYLE.header); setCell(ws, 'G' + headRow, 'Verified', STYLE.header);
  setCell(ws, 'H' + headRow, 'Notes', STYLE.header);

  const sources = [
    ['4-room renovation range', 'S$35,000 - S$65,000', 'Market research estimates (compiled from industry sources)', 'N/A - internal estimate', 'Research assumption', '2025-01', 'Market estimate range for typical 4-room renovation'],
    ['BTO renovation range', 'S$36,000 - S$82,000', 'Market research estimates (compiled from industry sources)', 'N/A - internal estimate', 'Research assumption', '2025-01', 'Includes 3-room to 5-room BTO'],
    ['Resale renovation range', 'S$51,000 - S$97,000', 'Market research estimates (compiled from industry sources)', 'N/A - internal estimate', 'Research assumption', '2025-01', 'Older flats typically cost more'],
    ['HDB renovation contractor requirement', 'Must use HDB-registered contractor', 'HDB Renovation Portal', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'Non-negotiable'],
    ['BTO toilet hacking restriction (3 years)', 'No removing toilet wall/floor finishes in first 3 years', 'HDB BTO Flat Regulations', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'Applies to new BTO flats'],
    ['Hacking permit requirement', 'Required for wall/floor alterations', 'HDB Renovation Permit', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'Includes floor level changes'],
    ['Completion deadline', '3 months (BTO) / 1 month (Resale)', 'HDB Renovation Rules', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'From permit approval date'],
    ['Electrical works licensing', 'Licensed wireman required', 'EMA Electrical Worker Licence', 'https://www.ema.gov.sg', 'Official requirement', '2025-01', 'For new wiring points'],
    ['Fire-rated door for escape route', 'Required if main door faces lift/staircase', 'SCDF Fire Safety Act / HDB', 'https://www.scdf.gov.sg', 'Official requirement', '2025-01', 'Door facing common escape route'],
    ['Waterproofing certification', 'Required for wet areas (bathroom/kitchen)', 'HDB Renovation Guide', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'Membrane test certificate'],
    ['Structural engineer (PE) endorsement', 'Required for load-bearing wall changes', 'HDB / BCA Structural Requirements', 'https://www.hdb.gov.sg/residential/renovating', 'Official requirement', '2025-01', 'Any structural alteration'],
    ['GST rate', '9% from 2024', 'IRAS', 'https://www.iras.gov.sg', 'Official', '2025-01', 'Applicable to renovation services'],
  ];

  sources.forEach((s, i) => {
    const rr = headRow + 1 + i;
    setCell(ws, 'B' + rr, s[0], STYLE.label);
    setCell(ws, 'C' + rr, s[1], STYLE.note);
    setCell(ws, 'D' + rr, s[2], STYLE.note);
    setCell(ws, 'E' + rr, s[3], STYLE.note);
    setCell(ws, 'F' + rr, s[4], STYLE.note);
    setCell(ws, 'G' + rr, s[5], STYLE.note);
    setCell(ws, 'H' + rr, s[6], STYLE.note);
  });

  ws['!cols'] = [{ wch: 42 }, { wch: 44 }, { wch: 32 }, { wch: 40 }, { wch: 22 }, { wch: 12 }, { wch: 70 }];
  return ws;
}

// ============================ BUILD ============================
const AS = buildAssumptions();
const IND = buildInputs(AS);
const CALC_WS = buildCalculator(IND, AS);
const COMP_WS = buildCompliance(IND);
const wb = newWorkbook();
addSheet(wb, 'START HERE', buildStartHere());
addSheet(wb, ASSUMP, AS.ws);
addSheet(wb, IN, IND.ws);
addSheet(wb, CALC, CALC_WS.ws);
addSheet(wb, COMP, COMP_WS.ws);
addSheet(wb, RES, buildResults(IND, COMP_WS));
addSheet(wb, SRC, buildSources());
writeWorkbook(wb, OUTPUT);
console.log('Written:', OUTPUT);

module.exports = { OUTPUT };