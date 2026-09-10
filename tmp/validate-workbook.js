/**
 * Validation harness for the generated calculator workbook.
 * - Re-reads the .xlsx with ExcelJS (proves file + zip integrity)
 * - Checks sheet structure, protection, locked/unlocked cells, formats
 * - Extracts REAL formulas from the file and evaluates them numerically
 *   under THREE different input scenarios, comparing against an independent
 *   JS model of the intended maths.
 *
 * NOTE ON LAYOUT (verified by tmp/dump-workbook.js):
 *   COMPARISON:  header r4 · scenarios A/B/C r5/r6/r7 · B−A diff r11 ·
 *                C−B diff r12 · relative cost r13 · verdict r16 · text summary r17
 *   SCENARIO:    current Grab r5 · break-even r6 · status r7 ·
 *                grid header r10 (petrol C10:E10) · dep rows r11..r15
 */
const path = require('path');
const ExcelJS = require('exceljs');

const FILE = path.join(
  __dirname, '..', 'digital-products', 'car-vs-mrt-grab-calculator',
  'singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx'
);

// Cell addresses of inputs on INPUTS tab (verified)
const REF = {
  mrt: 'INPUTS!C5', grab: 'INPUTS!C7',
  carPrice: 'INPUTS!C9', coeUpfront: 'INPUTS!C10',
  loanAmount: 'INPUTS!C11', loanPayment: 'INPUTS!C12',
  petrol: 'INPUTS!C14', parking: 'INPUTS!C15', erp: 'INPUTS!C16',
  insurance: 'INPUTS!C17', maintenance: 'INPUTS!C18', otherCar: 'INPUTS!C19',
  dep: 'INPUTS!C21',
};

const DEP_LEVELS = [6000, 9000, 12000, 15000, 18000]; // grid rows 11..15
const PETROL_LEVELS = [150, 250, 350];                // grid cols C,D,E @ row 10

/** Independent JS model of the intended workbook maths. */
function model(d) {
  const cM = d.loanPayment + d.petrol + d.parking + d.erp + d.insurance + d.maintenance + d.otherCar + d.dep / 12;
  const bM = d.mrt + d.grab;
  return {
    aM: d.mrt,
    bM,
    cM,
    aY: d.mrt * 12, bY: bM * 12, cY: cM * 12,
    aD: d.mrt * 120, bD: bM * 120, cD: cM * 120,
    diffBA_m: d.grab, diffBA_y: d.grab * 12, diffBA_d: d.grab * 120,
    diffCB_m: cM - bM, diffCB_y: cM * 12 - bM * 12, diffCB_d: cM * 120 - bM * 120,
    relCB: cM / bM,
    breakEvenGrab: Math.max(0, cM - d.mrt),
    upfrontCash: d.carPrice + d.coeUpfront - d.loanAmount,
  };
}

const VERDICT_PT =
  'Under your current assumptions, MRT + Grab is CHEAPER than owning a car.';
const VERDICT_CAR =
  'Under your current assumptions, owning a car is CHEAPER than MRT + Grab.';
const STATUS_ABOVE =
  'Your Grab / taxi spending is AT or ABOVE break-even — under your assumptions, a car may be financially rational.';
const STATUS_BELOW =
  'A car only becomes cost-comparable if your monthly Grab / taxi spend rises to the break-even level above.';

const SCENARIOS = {
  base: { mrt: 120, grab: 300, carPrice: 70000, coeUpfront: 95000, loanAmount: 70000, loanPayment: 1330, petrol: 250, parking: 250, erp: 80, insurance: 200, maintenance: 150, otherCar: 50, dep: 12000 },
  heavyGrabber: { mrt: 90, grab: 2600, carPrice: 85000, coeUpfront: 100000, loanAmount: 80000, loanPayment: 1520, petrol: 300, parking: 320, erp: 140, insurance: 180, maintenance: 200, otherCar: 60, dep: 15000 },
  cashBuyerLowUse: { mrt: 160, grab: 80, carPrice: 60000, coeUpfront: 90000, loanAmount: 0, loanPayment: 0, petrol: 180, parking: 90, erp: 0, insurance: 150, maintenance: 120, otherCar: 40, dep: 9000 },
  // Synthetic flip scenario: exercises the CAR-cheaper verdict branch AND
  // the "AT or ABOVE break-even" status branch.
  carWinsHighGrab: { mrt: 120, grab: 5000, carPrice: 60000, coeUpfront: 95000, loanAmount: 50000, loanPayment: 800, petrol: 250, parking: 250, erp: 100, insurance: 180, maintenance: 150, otherCar: 50, dep: 9000 },
};

// ---------------------------------------------------------------------------
// Minimal safe evaluator for the deterministic formula subset used in the
// workbook: numbers, + - * / ( ) , comparisons, MAX(), IF(), cell refs.
// ---------------------------------------------------------------------------
function arithEval(raw) {
  let expr = String(raw);
  const cleaned = expr.replace(/Math\.max/g, '');
  if (/[A-Za-z"]/.test(cleaned)) throw new Error(`Unsafe expr: ${expr}`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${expr});`)();
}

/** Split "a,b,c" on top-level commas (parenthesis- and quote-aware). */
function splitTopLevel(s) {
  const parts = [];
  let depth = 0, inStr = false, cur = '';
  for (const ch of s) {
    if (ch === '"') inStr = !inStr;
    if (!inStr && ch === '(') depth += 1;
    if (!inStr && ch === ')') depth -= 1;
    if (!inStr && ch === ',' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function evalExpr(raw, vars) {
  let expr = String(raw).trim();
  if (/^=/i.test(expr)) expr = expr.slice(1);

  // 1) resolve cross-sheet INPUTS refs
  expr = expr.replace(/INPUTS!\$?C\$?(\d+)/gi, (_, n) => {
    const addr = `INPUTS!C${n}`;
    const key = Object.keys(REF).find((k) => REF[k].toUpperCase() === addr.toUpperCase());
    if (!key) throw new Error(`Unknown ref ${addr}`);
    return String(vars[key]);
  });

  // 2) resolve local same-sheet refs from the derived model + supplied extras
  const m = model(vars);
  const localMap = {
    // COMPARISON scenario block
    B5: null, C5: m.aM, D5: m.aY, E5: m.aD,
    C6: m.bM, D6: m.bY, E6: m.bD,
    C7: m.cM, D7: m.cY, E7: m.cD,
    ...(vars.__extraLocal || {}),
  };
  expr = expr.replace(/\$?([A-Za-z])\$?(\d+)\b/g, (mm, col, row) => {
    const key = `${col.toUpperCase()}${row}`;
    if (!(key in localMap) || localMap[key] === null) throw new Error(`Unhandled local ref ${key} in: ${raw}`);
    return String(localMap[key]);
  });

  // 3) functions (idempotent — never re-wraps an existing Math.max)
  expr = expr.replace(/(?<!\.)\bMAX\(/gi, 'Math.max(');

  // 4) top-level IF(cond, a, b)
  const ifMatch = expr.match(/^IF\((.*)\)$/i);
  if (ifMatch) {
    const [cond, tBranch, fBranch] = splitTopLevel(ifMatch[1]);
    if (tBranch === undefined || fBranch === undefined) throw new Error(`Malformed IF: ${expr}`);
    const truthy = !!evalExpr(cond.trim(), vars);
    const chosen = (truthy ? tBranch : fBranch).trim();
    const strMatch = chosen.match(/^"(.*)"$/);
    if (strMatch) return strMatch[1];          // string branch (verdict/status/"n/a")
    return evalExpr(chosen, vars);             // numeric branch
  }

  return arithEval(expr);
}

let failures = 0;
const check = (name, cond, extra = '') => {
  if (cond) console.log(`  PASS  ${name}${extra ? ' — ' + extra : ''}`);
  else { failures += 1; console.error(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const near = (a, b) => Math.abs(Number(a) - Number(b)) < 0.000001;

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE);

  console.log('\n== STRUCTURE ==');
  check('sheet order', JSON.stringify(wb.worksheets.map((w) => w.name)) ===
    JSON.stringify(['START HERE', 'INPUTS', 'COMPARISON', 'SCENARIO ANALYSIS']));
  check('workbook metadata title', /Decision Calculator/.test(wb.title || ''));

  const start = wb.getWorksheet('START HERE');
  const inputs = wb.getWorksheet('INPUTS');
  const cmp = wb.getWorksheet('COMPARISON');
  const scn = wb.getWorksheet('SCENARIO ANALYSIS');

  const startText = [];
  start.eachRow((row) => row.eachCell((cell) => {
    if (typeof cell.value === 'string') startText.push(cell.value);
  }));
  const startBlob = startText.join('\n');
  console.log('\n== START HERE ==');
  check('disclaimer present', startBlob.includes('personal planning and comparison only. It is not financial advice'));
  check('3 steps present', ['STEP 1', 'STEP 2', 'STEP 3'].every((s) => startBlob.includes(s)));
  check('who-it-is-for present', startBlob.includes('WHO IT IS FOR'));

  console.log('\n== INPUTS ==');
  const inputAddrs = ['C5', 'C7', 'C9', 'C10', 'C11', 'C12', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C21'];
  for (const addr of inputAddrs) {
    const cell = inputs.getCell(addr);
    check(`${addr} unlocked`, cell.protection && cell.protection.locked === false);
    check(`${addr} has validation`, cell.dataValidation && cell.dataValidation.type === 'decimal');
    check(`${addr} currency format`, cell.numFmt === '"S$"#,##0');
  }
  check('inputs sheet protected', !!inputs.protected || inputs.sheetProtection !== undefined,
    `keys=${Object.keys(inputs.sheetProtection || {}).join(',')}`);
  const calcCell = inputs.getCell('C23'); // upfront cash calculated cell
  check('calculated cell is a formula', calcCell.formula && calcCell.formula.includes('+'), calcCell.formula);

  console.log('\n== COMPARISON ==');
  for (const [addr, expect] of [
    ['C5', 'INPUTS!C5'], ['C6', 'INPUTS!C5+INPUTS!C7'],
    ['D7', '*12'], ['E7', '*120'],
  ]) {
    const v = cmp.getCell(addr).formula || '';
    check(`scenario formula at ${addr}`, typeof v === 'string' && v.includes(expect), v.slice(0, 60));
  }
  check('difference row B-A', (cmp.getCell('C11').formula || '').includes('INPUTS!C7'), (cmp.getCell('C11').formula || '').slice(0, 40));
  check('difference row C-B', (cmp.getCell('C12').formula || '').includes('C7-C6'), (cmp.getCell('C12').formula || '').slice(0, 40));
  check('relative cost row', /IF\(C6>0,C7\/C6/.test(cmp.getCell('C13').formula || ''), (cmp.getCell('C13').formula || '').slice(0, 45));
  check('verdict IF present', typeof cmp.getCell('C16').formula === 'string' && cmp.getCell('C16').formula.includes('IF(C7>C6'));
  check('TEXT summary present', (cmp.getCell('B17').formula || '').includes('TEXT(MAX(0,C7-C6)'), (cmp.getCell('B17').formula || '').slice(0, 55));

  console.log('\n== SCENARIO ANALYSIS ==');
  check('break-even MAX formula', (scn.getCell('C6').formula || '').startsWith('MAX(0,'), (scn.getCell('C6').formula || '').slice(0, 50));
  check('status IF formula', (scn.getCell('C7').formula || '').includes(`IF(${REF.grab}>=MAX(0,`), (scn.getCell('C7').formula || '').slice(0, 55));

  // Sensitivity grid: header constants + anchored row/col references
  check('grid corner label', typeof scn.getCell('B10').value === 'string' && /depreciation/i.test(scn.getCell('B10').value));
  for (let i = 0; i < 3; i++) {
    const col = ['C', 'D', 'E'][i];
    check(`grid petrol header ${col}10`, scn.getCell(`${col}10`).value === PETROL_LEVELS[i], String(scn.getCell(`${col}10`).value));
  }
  for (let ri = 0; ri < DEP_LEVELS.length; ri++) {
    const row = 11 + ri;
    check(`grid dep label B${row}`, scn.getCell(`B${row}`).value === DEP_LEVELS[ri], String(scn.getCell(`B${row}`).value));
    for (const col of ['C', 'D', 'E']) {
      const f = scn.getCell(`${col}${row}`).formula || '';
      const ok = f.includes(`$B${row}/12`) && f.includes(`${col}$10`);
      check(`grid ${col}${row} anchored refs`, ok, f.slice(-28));
    }
  }

  console.log('\n== FORMULA EVALUATION ACROSS SCENARIOS (formulas read from file) ==');
  const targets = {
    aM: ['COMPARISON', 'C5'], bM: ['COMPARISON', 'C6'], cM: ['COMPARISON', 'C7'],
    aY: ['COMPARISON', 'D5'], bY: ['COMPARISON', 'D6'], cY: ['COMPARISON', 'D7'],
    aD: ['COMPARISON', 'E5'], bD: ['COMPARISON', 'E6'], cD: ['COMPARISON', 'E7'],
    diffBA_m: ['COMPARISON', 'C11'],
    diffCB_m: ['COMPARISON', 'C12'], diffCB_y: ['COMPARISON', 'D12'], diffCB_d: ['COMPARISON', 'E12'],
    relCB: ['COMPARISON', 'C13'],
    breakEvenGrab: ['SCENARIO ANALYSIS', 'C6'],
    upfrontCash: ['INPUTS', 'C23'],
  };

  for (const [name, s] of Object.entries(SCENARIOS)) {
    const wsCache = {};
    const getFormula = (sheet, addr) => {
      wsCache[sheet] = wsCache[sheet] || wb.getWorksheet(sheet);
      return wsCache[sheet].getCell(addr).formula;
    };
    const expected = model(s);
    let allOk = true;
    const detail = [];
    for (const [key, [sheet, addr]] of Object.entries(targets)) {
      const f = getFormula(sheet, addr);
      if (typeof f !== 'string') { allOk = false; detail.push(`${addr}:no-formula`); continue; }
      let got;
      try { got = evalExpr(f, s); } catch (e) { allOk = false; detail.push(`${addr}:${e.message}`); continue; }
      if (!near(got, expected[key])) { allOk = false; detail.push(`${addr}:got=${got},want=${expected[key]}`); }
    }
    check(`[${name}] all numeric outputs match independent model`, allOk, detail.join(' | ').slice(0, 160));

    // verdict string (both branches exercised across scenarios)
    const gotVerdict = evalExpr(getFormula('COMPARISON', 'C16'), s);
    const wantVerdict = expected.cM > expected.bM ? VERDICT_PT : VERDICT_CAR;
    check(`[${name}] verdict selects correct branch`, gotVerdict === wantVerdict, `"${String(gotVerdict).slice(0, 48)}…"`);

    // break-even status string
    const gotStatus = evalExpr(getFormula('SCENARIO ANALYSIS', 'C7'), s);
    const wantStatus = s.grab >= expected.breakEvenGrab ? STATUS_ABOVE : STATUS_BELOW;
    check(`[${name}] break-even status correct`, gotStatus === wantStatus, `grab=${s.grab},BE=${expected.breakEvenGrab}`);

    // sensitivity grid spot-checks (corners) evaluated from file formulas
    const gridChecks = [['C', 11, 0], ['E', 11, 0], ['C', 15, 4], ['E', 15, 4]];
    let gridOk = true;
    const fixed = s.loanPayment + s.parking + s.erp + s.insurance + s.maintenance + s.otherCar;
    for (const [col, row, di] of gridChecks) {
      const extra = {};
      extra[`B${row}`] = DEP_LEVELS[di];
      extra[`${col}10`] = PETROL_LEVELS[col === 'C' ? 0 : col === 'D' ? 1 : 2];
      const got = evalExpr(getFormula('SCENARIO ANALYSIS', `${col}${row}`), { ...s, __extraLocal: extra });
      const want = fixed + DEP_LEVELS[di] / 12 + PETROL_LEVELS[col === 'C' ? 0 : col === 'D' ? 1 : 2];
      if (!near(got, want)) { gridOk = false; detail.push(`${col}${row}:got=${got},want=${want}`); }
    }
    check(`[${name}] sensitivity grid corners evaluate correctly`, gridOk, detail.join(' | ').slice(0, 120));
  }

  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
