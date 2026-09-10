// scripts/generateWeddingAngBao.js
// Generates: digital-products/wedding-angbao-planner/singapore-wedding-cashflow-angbao-planner-2026.xlsx
const { STYLE, setCell, newWorkbook, addSheet, writeWorkbook } = require('./excel-helper');

const OUTPUT = 'digital-products/wedding-angbao-planner/singapore-wedding-cashflow-angbao-planner-2026.xlsx';
const IN = 'INPUTS';
const CALC = 'CALCULATOR';
const RES = 'RESULTS';

// ---------------------------- START HERE ----------------------------
function buildStartHere() {
  const ws = {};
  const rows = [
    [2, 'Singapore Wedding Cashflow & Ang Bao Planner', STYLE.title],
    [3, '2026 Edition — understand whether your wedding budget is financially comfortable under different guest and ang bao scenarios.', STYLE.subtitle],
    [5, 'THE PROBLEM', STYLE.subHeader],
    [6, 'The article gives cost ranges and ang bao norms, but working out YOUR own numbers — what your banquet actually costs with GST and service charge, what you can realistically expect from guests, and whether you would be in surplus or shortfall — still requires tedious calculation. This workbook does it for you, with honest scenario planning.', STYLE.label],
    [8, 'WHAT THIS WORKBOOK DOES', STYLE.subHeader],
    [9, '• INPUTS — guests, tables, package price, service charge, GST, and every non-banquet cost (bridal, photography, videography, décor, rings, attire, invitations, transport, etc.).', STYLE.label],
    [10, '• CALCULATOR — total expenditure, three ang bao scenarios (conservative / expected / optimistic), surplus or shortfall for each, and break-even points.', STYLE.label],
    [11, '• RESULTS — a dashboard of total budget, banquet vs non-banquet split, expected ang bao, break-even, upfront cash requirement and a payment milestones timeline.', STYLE.label],
    [14, 'HOW TO USE — 3 STEPS', STYLE.subHeader],
    [15, 'STEP 1 · Go to INPUTS and enter your real numbers and quotes. Set your three ang bao per-guest assumptions on INPUTS too.', STYLE.label],
    [16, 'STEP 2 · Review CALCULATOR. See which scenario leaves you short or in surplus, and the break-even ang bao.', STYLE.label],
    [17, 'STEP 3 · Use RESULTS to build your upfront cash reserve and payment timeline — and never let the budget depend on guests funding it.', STYLE.label],
    [19, 'WHAT IS ESTIMATED vs OFFICIAL vs PLANNING ASSUMPTION vs MARKET ESTIMATE vs USER INPUT', STYLE.subHeader],
    [20, '• Ang bao income is a SCENARIO / estimate — NEVER a guarantee. Treat it as a planning scenario, not a funding source.', STYLE.label],
    [21, '• GST rate (9% from 2024) and service-charge practice (typically 10%) are official/venue facts — verify current rates with your venue and IRAS.', STYLE.label],
    [22, '• Per-guest ang bao amounts are market estimates you control via the INPUTS assumptions.', STYLE.label],
    [23, '• Default non-banquet cost figures (bridal, photography, etc.) are planning assumptions / market estimates — replace with your actual quotes.', STYLE.label],
    [24, '• Package price per table is a market estimate — confirm with your venue.', STYLE.label],
    [24, 'LIMITATIONS & DISCLAIMER', STYLE.subHeader],
    [25, 'This tool is for cashflow planning, not prediction. It does not guarantee any ang bao outcome or any wedding surplus. Confirm GST and service-charge terms with your venue before committing.', STYLE.warnText],
    [27, 'Yellow = editable input · Green = auto-calculated · Do not type into green cells.', STYLE.note],
  ];
  rows.forEach(([r, t, s]) => setCell(ws, 'B' + r, t, s));
  ws['!cols'] = [{ wch: 26 }, { wch: 108 }];
  return ws;
}

// ---------------------------- INPUTS ----------------------------
function buildInputs() {
  const ws = {};
  setCell(ws, 'B2', 'STEP 1 · YOUR WEDDING NUMBERS', STYLE.title);
  setCell(ws, 'B3', 'Edit ONLY the yellow cells. Set ang bao per-guest assumptions at the bottom.', STYLE.subtitle);

  setCell(ws, 'B5', 'BANQUET DETAILS', STYLE.sectionHeader);
  const r_guests = 6, r_pptable = 7, r_price = 8, r_sc = 9, r_gst = 10;
  setCell(ws, 'B' + r_guests, 'Number of guests', STYLE.labelBold); setCell(ws, 'C' + r_guests, 300, { ...STYLE.input });
  setCell(ws, 'B' + r_pptable, 'Guests per table', STYLE.labelBold); setCell(ws, 'C' + r_pptable, 10, { ...STYLE.input });
  setCell(ws, 'B' + r_price, 'Package price per table (S$) — Market estimate', STYLE.labelBold); setCell(ws, 'C' + r_price, 1288, { ...STYLE.input, ...STYLE.money });
  setCell(ws, 'D' + r_price, 'Confirm with your venue — this is an example only', STYLE.note);
  setCell(ws, 'B' + r_sc, 'Service charge', STYLE.labelBold); setCell(ws, 'C' + r_sc, 0.10, { ...STYLE.input, ...STYLE.pct });
  setCell(ws, 'D' + r_sc, 'Usually 10% — check venue', STYLE.note);
  setCell(ws, 'B' + r_gst, 'GST', STYLE.labelBold); setCell(ws, 'C' + r_gst, 0.09, { ...STYLE.input, ...STYLE.pct });
  setCell(ws, 'D' + r_gst, 'Official rate 9% from 2024 — verify with IRAS/venue', STYLE.note);

  setCell(ws, 'B12', 'NON-BANQUET COSTS (S$) — Planning assumptions / Market estimates', STYLE.sectionHeader);
  const nb = [
    ['Bridal package (gown, suit, makeup, hair)', 4000],
    ['Photography', 3500],
    ['Videography', 2500],
    ['Décor (beyond venue-provided)', 1500],
    ['Rings', 3000],
    ['Attire / extra outfits', 1200],
    ['Invitations & stationery', 500],
    ['Solemnisation / ROM', 100],
    ['Transport', 800],
    ['Cultural items / customs', 1500],
    ['Miscellaneous', 800],
    ['User-defined expenses', 0],
  ];
  const nbStart = 13;
  nb.forEach((row, i) => {
    const rr = nbStart + i;
    setCell(ws, 'B' + rr, row[0], STYLE.label);
    setCell(ws, 'C' + rr, row[1], { ...STYLE.input, ...STYLE.money });
  });
  const nbLast = nbStart + nb.length - 1; // 24
  const nbTotal = 25;
  setCell(ws, 'B' + nbTotal, 'TOTAL NON-BANQUET COST', STYLE.labelBold);
  setCell(ws, 'C' + nbTotal, { f: `SUM(C${nbStart}:C${nbLast})` }, { ...STYLE.output, ...STYLE.money });

  const abHeader = 27;
  setCell(ws, 'B' + abHeader, 'ANG BAO SCENARIOS · per guest (S$)', STYLE.sectionHeader);
  setCell(ws, 'B' + (abHeader+1), 'Your assumptions: how much ang bao, on average, per guest in each scenario. Update these freely.', STYLE.note);
  const r_cons = 29, r_exp = 30, r_opt = 31;
  setCell(ws, 'B' + r_cons, 'Conservative (per guest)', STYLE.label); setCell(ws, 'C' + r_cons, 100, { ...STYLE.input, ...STYLE.money });
  setCell(ws, 'B' + r_exp, 'Expected (per guest)', STYLE.label); setCell(ws, 'C' + r_exp, 150, { ...STYLE.input, ...STYLE.money });
  setCell(ws, 'B' + r_opt, 'Optimistic (per guest)', STYLE.label); setCell(ws, 'C' + r_opt, 220, { ...STYLE.input, ...STYLE.money });

  ws['!validations'] = [];
  ws['!cols'] = [{ wch: 42 }, { wch: 40 }, { wch: 16 }, { wch: 40 }];
  return { ws, refs: { r_guests, r_pptable, r_price, r_sc, r_gst, nbStart, nbLast, nbTotal, r_cons, r_exp, r_opt } };
}

// ---------------------------- CALCULATOR ----------------------------
function buildCalculator(inp) {
  const ws = {};
  const R = inp.refs;
  const iv = (col, row) => `${IN}!${col}${row}`;

  const tables = `ROUND(${iv('C', R.r_guests)}/${iv('C', R.r_pptable)},0)`;
  const banquet = `ROUND(${iv('C', R.r_price)}*${tables}*(1+${iv('C', R.r_sc)})*(1+${iv('C', R.r_gst)}),0)`;
  const nonbanquet = iv('C', R.nbTotal);
  const total = `ROUND(${banquet}+${nonbanquet},0)`;
  const angPo = (sc) => `ROUND(${iv('C', R.r_guests)}*${iv('C', sc)},0)`;

  setCell(ws, 'B2', 'STEP 2 · YOUR NUMBERS, SCENARIOS & BREAK-EVEN', STYLE.title);
  setCell(ws, 'B3', 'Everything updates from INPUTS. Green cells calculate automatically.', STYLE.note);

  setCell(ws, 'B5', 'TOTALS', STYLE.sectionHeader);
  setCell(ws, 'B6', 'Estimated banquet cost (GST & service charge in)', STYLE.labelBold); setCell(ws, 'C6', { f: banquet }, { ...STYLE.output, ...STYLE.money }); setCell(ws, 'D6', `${tables} tables approx`, STYLE.note);
  setCell(ws, 'B7', 'Non-banquet cost', STYLE.labelBold); setCell(ws, 'C7', { f: nonbanquet }, { ...STYLE.output, ...STYLE.money });
  setCell(ws, 'B8', 'TOTAL ESTIMATED EXPENDITURE', STYLE.labelBold); setCell(ws, 'C8', { f: total }, { ...STYLE.outputBig, ...STYLE.money });

  setCell(ws, 'B10', 'ANG BAO SCENARIOS (estimates — not guarantees)', STYLE.sectionHeader);
  setCell(ws, 'B11', 'Scenario', STYLE.header); setCell(ws, 'C11', 'Per guest', STYLE.header); setCell(ws, 'D11', 'Ang bao received', STYLE.header); setCell(ws, 'E11', 'Surplus (+) / Shortfall (−)', STYLE.header);
  const scen = [
    ['Conservative', R.r_cons],
    ['Expected', R.r_exp],
    ['Optimistic', R.r_opt],
  ];
  const scenRows = {};
  scen.forEach((s, i) => {
    const rr = 12 + i;
    scenRows[s[0]] = rr;
    setCell(ws, 'B' + rr, s[0], STYLE.label);
    setCell(ws, 'C' + rr, { f: `ROUND(${iv('C', s[1])},0)` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + rr, { f: angPo(s[1]) }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'E' + rr, { f: `ROUND(D${rr}-$C8,0)` }, { ...STYLE.output, ...STYLE.money });
  });

  const beRow = 16;
  setCell(ws, 'B' + beRow, 'BREAK-EVEN POINTS', STYLE.sectionHeader);
  setCell(ws, 'B' + (beRow+1), 'Break-even average ang bao per guest (to cover TOTAL expenditure)', STYLE.label); setCell(ws, 'C' + (beRow+1), { f: `IF(${iv('C', R.r_guests)}=0,0,C8/${iv('C', R.r_guests)})` }, { ...STYLE.output, ...STYLE.money }); setCell(ws, 'D' + (beRow+1), 'If this exceeds your expected scenario, the budget depends on above-average ang bao', STYLE.note);
  setCell(ws, 'B' + (beRow+2), 'Break-even ang bao to cover banquet ONLY', STYLE.label); setCell(ws, 'C' + (beRow+2), { f: `IF(${iv('C', R.r_guests)}=0,0,C6/${iv('C', R.r_guests)})` }, { ...STYLE.output, ...STYLE.money }); setCell(ws, 'D' + (beRow+2), 'Banquet ÷ guests', STYLE.note);
  setCell(ws, 'B' + (beRow+3), 'Break-even guest count (expected scenario)', STYLE.label); setCell(ws, 'C' + (beRow+3), { f: `IF(${iv('C', R.r_exp)}=0,0,C8/${iv('C', R.r_exp)})` }, { ...STYLE.output }); setCell(ws, 'D' + (beRow+3), 'Guests needed at expected ang bao to cover total cost', STYLE.note);

  setCell(ws, 'B' + (beRow+5), 'UPFRONT CASH & TIMELINE', STYLE.sectionHeader);
  setCell(ws, 'B' + (beRow+6), 'Upfront cash to secure BEFORE the day (total − expected ang bao)', STYLE.labelBold); setCell(ws, 'C' + (beRow+6), { f: `MAX(0,C8-D${scenRows.Expected})` }, { ...STYLE.output, ...STYLE.money }); setCell(ws, 'D' + (beRow+6), 'Ang bao arrives on the day — do not rely on it for deposits', STYLE.note);
  setCell(ws, 'B' + (beRow+7), 'Expected ang bao on the day', STYLE.label); setCell(ws, 'C' + (beRow+7), { f: `D${scenRows.Expected}` }, { ...STYLE.output, ...STYLE.money });

  // payment milestone table
  const payHeader = beRow + 9;
  setCell(ws, 'B' + payHeader, 'PAYMENT MILESTONES (edit amounts/timing)', STYLE.subHeader);
  const ms = [
    ['T-12 months · venue deposit', 8000],
    ['T-9 · bridal deposit', 1500],
    ['T-6 · décor deposit', 800],
    ['T-3 · venue balance', 15000],
    ['T-1 · photography/videography', 4000],
    ['T-0 · final vendors', 5000],
  ];
  const msStart = payHeader + 1;
  setCell(ws, 'B' + msStart, 'Milestone', STYLE.header); setCell(ws, 'C' + msStart, 'Amount (S$)', STYLE.header); setCell(ws, 'D' + msStart, 'Note', STYLE.header);
  ms.forEach((m, i) => {
    const rr = msStart + 1 + i;
    setCell(ws, 'B' + rr, m[0], STYLE.label);
    setCell(ws, 'C' + rr, m[1], { ...STYLE.input, ...STYLE.money });
    setCell(ws, 'D' + rr, 'Adjust to your actual vendor schedule', STYLE.note);
  });
  const msSum = msStart + ms.length + 1;
  setCell(ws, 'B' + msSum, 'Total pre-wedding payments scheduled', STYLE.labelBold);
  setCell(ws, 'C' + msSum, { f: `SUM(C${msStart+1}:C${msStart+ms.length})` }, { ...STYLE.output, ...STYLE.money });

  ws['!cols'] = [{ wch: 46 }, { wch: 34 }, { wch: 24 }, { wch: 60 }];
  return { ws, refs: { banquet, nonbanquet, total, scenRows, beRow, msStart, ms } };
}

// ---------------------------- RESULTS ----------------------------
function buildResults(inp, calc) {
  const ws = {};
  const C = calc.refs;
  const iv = (col, row) => `${IN}!${col}${row}`;
  setCell(ws, 'B2', 'RESULTS · YOUR WEDDING FINANCIAL PICTURE', STYLE.title);
  setCell(ws, 'B3', 'Auto-updates from CALCULATOR and INPUTS.', STYLE.note);

  let r = 5;
  setCell(ws, 'B' + r, 'KEY NUMBERS', STYLE.sectionHeader); r++;
  const rows = [
    ['Total estimated wedding expenditure', 'CALCULATOR!C8'],
    ['Total banquet cost', 'CALCULATOR!C6'],
    ['Total non-banquet cost', 'CALCULATOR!C7'],
    ['Expected ang bao (estimate)', `CALCULATOR!D${C.scenRows.Expected}`],
    ['Break-even average ang bao (per guest)', `CALCULATOR!C${C.beRow+1}`],
    ['Upfront cash to secure before the day', `CALCULATOR!C${C.beRow+6}`],
  ];
  rows.forEach(([label, ref]) => { setCell(ws, 'B' + r, label, STYLE.labelBold); setCell(ws, 'C' + r, { f: ref }, { ...STYLE.outputBig, ...STYLE.money }); r++; });

  r++;
  setCell(ws, 'B' + r, 'ANG BAO SCENARIOS', STYLE.sectionHeader); r++;
  setCell(ws, 'B' + r, 'Scenario', STYLE.header); setCell(ws, 'C' + r, 'Received (est)', STYLE.header); setCell(ws, 'D' + r, 'Surplus/Shortfall', STYLE.header); r++;
  Object.keys(C.scenRows).forEach(s => {
    const rr = C.scenRows[s];
    setCell(ws, 'B' + r, s, STYLE.label);
    setCell(ws, 'C' + r, { f: `CALCULATOR!D${rr}` }, { ...STYLE.output, ...STYLE.money });
    setCell(ws, 'D' + r, { f: `CALCULATOR!E${rr}` }, { ...STYLE.output, ...STYLE.money });
    r++;
  });

  ws['!cols'] = [{ wch: 42 }, { wch: 44 }, { wch: 22 }, { wch: 24 }];
  return ws;
}

// ---------------------------- BUILD ----------------------------
const INP = buildInputs();
const CAL = buildCalculator(INP);
const wb = newWorkbook();
addSheet(wb, 'START HERE', buildStartHere());
addSheet(wb, IN, INP.ws);
addSheet(wb, CALC, CAL.ws);
addSheet(wb, RES, buildResults(INP, CAL));
writeWorkbook(wb, OUTPUT);
console.log('Written:', OUTPUT);