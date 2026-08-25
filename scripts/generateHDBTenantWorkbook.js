/**
 * SGEventsHub — Paid Digital Asset Generator
 * Product: Singapore HDB Tenant Protection & Cost Pack (2026)
 *
 * Generates a polished, formula-driven Excel workbook:
 *   digital-products/hdb-tenant-pack/
 *     singapore-hdb-tenant-protection-cost-pack-2026.xlsx
 *
 * Run: node scripts/generateHDBTenantWorkbook.js
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
const GREEN = 'FF16A34A';
const GREEN_SOFT = 'FFDCFCE7';
const ORANGE = 'FFEA580C';
const ORANGE_SOFT = 'FFFFEDD5';
const YELLOW_INPUT = 'FFFFF3C4';
const GREY_TEXT = 'FF64748B';
const WHITE = 'FFFFFFFF';
const BORDER_GREY = 'FFCBD5E1';

const FMT_SGD = '"S$"#,##0';
const FMT_PCT = '0.0%';
const FONT_BASE = { name: 'Calibri', size: 11 };

function solid(argb) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function thinBorder(color = BORDER_GREY) {
  const edge = { style: 'thin', color: { argb: color } };
  return { top: edge, bottom: edge, left: edge, right: edge };
}

function addTitleBanner(ws, row, text, subtitle) {
  ws.mergeCells(row, 2, row, 7);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 15, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 34;

  if (subtitle) {
    ws.mergeCells(row + 1, 2, row + 1, 7);
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

function addSectionBand(ws, row, text, color = BLUE) {
  ws.mergeCells(row, 2, row, 7);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: WHITE } };
  c.fill = solid(color);
  c.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(row).height = 24;
  return row + 1;
}

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
    ws.mergeCells(row, 4, row, 7);
    const n = ws.getCell(row, 4);
    n.value = note;
    n.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
    n.alignment = { vertical: 'middle', wrapText: true };
  }
  ws.getRow(row).height = 22;
  return `INPUTS!C${row}`;
}

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
    ws.mergeCells(row, 4, row, 7);
    const n = ws.getCell(row, 4);
    n.value = opts.note;
    n.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
    n.alignment = { vertical: 'middle', wrapText: true };
  }
  ws.getRow(row).height = 22;
  return val.address;
}

function addTextRow(ws, row, text, opts = {}) {
  ws.mergeCells(row, 2, row, 7);
  const c = ws.getCell(row, 2);
  c.value = text;
  c.font = { ...FONT_BASE, size: 11, color: { argb: NAVY }, italic: opts.italic || false };
  c.alignment = { vertical: 'top', wrapText: true, indent: opts.indent || 1 };
  ws.getRow(row).height = opts.height || 20;
  return row + 1;
}

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SGEventsHub';
  wb.lastModifiedBy = 'SGEventsHub';
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = 'Singapore HDB Tenant Protection & Cost Pack (2026)';
  wb.subject = 'Rental cost comparison, viewing checklist, pre-signing verification, and message templates';
  wb.description = 'A practical planning and protection tool for HDB tenants. Compare true rental costs, inspect units systematically, and avoid preventable rental mistakes before signing. Not legal advice.';
  wb.company = 'SGEventsHub';

  // ========================================================================
  // TAB 1 — START HERE
  // ========================================================================
  const start = wb.addWorksheet('START HERE', {
    properties: { tabColor: { argb: BLUE } },
    views: [{ showGridLines: false }],
  });
  start.getColumn(1).width = 3;
  start.getColumn(2).width = 50;
  ['C', 'D', 'E', 'F', 'G', 'H'].forEach((col) => { start.getColumn(col).width = 18; });

  let r = 2;
  start.mergeCells(r, 2, r, 7);
  let c = start.getCell(r, 2);
  c.value = 'SINGAPORE HDB TENANT PROTECTION & COST PACK';
  c.font = { ...FONT_BASE, bold: true, size: 26, color: { argb: WHITE } };
  c.fill = solid(NAVY);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 46;

  r += 1;
  start.mergeCells(r, 2, r, 7);
  c = start.getCell(r, 2);
  c.value = '2026 Edition — Rental Cost Calculator, Viewing Checklist, Pre-Signing Verification & Message Templates';
  c.font = { ...FONT_BASE, bold: true, size: 14, color: { argb: WHITE } };
  c.fill = solid(BLUE);
  c.alignment = { vertical: 'middle', horizontal: 'center' };
  start.getRow(r).height = 30;

  r += 2;
  start.mergeCells(r, 2, r, 7);
  c = start.getCell(r, 2);
  c.value = 'Compare the true cost of up to 3 rental options, inspect units systematically with a detailed checklist, verify key details before signing, and use ready-to-copy message templates for clear communication with landlords/agents.';
  c.font = { ...FONT_BASE, italic: true, size: 12, color: { argb: NAVY } };
  c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  start.getRow(r).height = 44;

  r += 1;

  const addStartSection = (row, title, lines) => {
    let rr = addSectionBand(start, row, title);
    for (const line of lines) {
      start.mergeCells(rr, 2, rr, 7);
      const cc = start.getCell(rr, 2);
      cc.value = line;
      cc.font = { ...FONT_BASE, size: 11, color: { argb: NAVY } };
      cc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
      start.getRow(rr).height = line.length > 110 ? 32 : 20;
      rr += 1;
    }
    return rr + 1;
  };

  r = addStartSection(r, 'WHAT THIS PACK DOES', [
    'Sheet 1 — START HERE: This guide.',
    'Sheet 2 — RENTAL CALCULATOR: Enter rent, utilities, Wi-Fi, cleaning, air-con, transport, stamp duty, and other costs for up to 3 options. See true monthly cost and total lease cost side by side.',
    'Sheet 3 — VIEWING CHECKLIST: A practical, room-by-room checklist for HDB viewings. Covers condition, plumbing, ventilation, appliances, pests, house rules, red flags, documentation, and photo evidence.',
    'Sheet 4 — PRE-SIGNING CHECKLIST: Verification steps before committing — landlord/agent eligibility, HDB rental approval, tenancy agreement review, deposit documentation, stamp duty reminders, and evidence preservation.',
    'Sheet 5 — MESSAGE TEMPLATES: Ready-to-copy messages for requesting the agreement, clarifying costs/rules, requesting inventory/condition docs, and confirming payment/stamping details.',
    'Sheet 6 — SOURCES & NOTES: Official references and assumption disclosures.',
  ]);

  r = addStartSection(r, 'WHO IT IS FOR', [
    'Singapore residents actively comparing or renting an HDB room or whole flat who want to:',
    '• Know the full monthly and lease cost — not just the headline rent.',
    '• Inspect units with a structured checklist so nothing is missed.',
    '• Verify eligibility and documentation before handing over money.',
    '• Communicate clearly with landlords/agents using professional templates.',
  ]);

  r = addStartSection(r, 'HOW TO USE IT — 4 STEPS', [
    'STEP 1  ·  Open RENTAL CALCULATOR. Enter your numbers in the yellow cells for each option (up to 3). Compare true monthly and total lease costs.',
    'STEP 2  ·  Print or use VIEWING CHECKLIST on your phone during viewings. Tick items, take photos, note concerns.',
    'STEP 3  ·  Before signing, work through PRE-SIGNING CHECKLIST. Verify each item. Do not proceed if critical items are unresolved.',
    'STEP 4  ·  Use MESSAGE TEMPLATES to clarify outstanding points in writing. Keep records.',
  ]);

  r = addStartSection(r, 'GOOD TO KNOW', [
    'Yellow cells are yours to edit. Blue/green cells calculate automatically — do not type into them.',
    'Every pre-filled figure is a clearly-labelled 2026 EXAMPLE assumption, not a quote or forecast. Replace with your own numbers.',
    'The calculator works entirely offline inside this file. It never fetches live rental or utility data.',
    'Stamp duty calculations follow IRAS guidelines for lease agreements. Verify current rates on IRAS website before relying on them.',
    'This pack is a practical planning tool. It is NOT legal advice. For legal questions, consult a qualified professional.',
  ]);

  start.mergeCells(r, 2, r, 7);
  c = start.getCell(r, 2);
  c.value = 'Disclaimer: This pack is for personal planning and protection only. It is not legal advice. For tenancy disputes, consult the Community Mediation Centre, CEA, or a qualified lawyer.';
  c.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  c.fill = solid(YELLOW_INPUT);
  c.border = thinBorder();
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  start.getRow(r).height = 36;

  r += 2;
  start.mergeCells(r, 2, r, 7);
  c = start.getCell(r, 2);
  c.value = '© SGEventsHub · Singapore HDB Tenant Protection & Cost Pack (2026) · v2026.1';
  c.font = { ...FONT_BASE, size: 9, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'middle', horizontal: 'center' };

  // ========================================================================
  // TAB 2 — RENTAL CALCULATOR
  // ========================================================================
  const calc = wb.addWorksheet('RENTAL CALCULATOR', {
    properties: { tabColor: { argb: GREEN } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }],
  });
  calc.getColumn(1).width = 3;
  calc.getColumn(2).width = 46;
  calc.getColumn(3).width = 18;
  calc.getColumn(4).width = 18;
  calc.getColumn(5).width = 18;
  ['F', 'G', 'H'].forEach((col) => { calc.getColumn(col).width = 20; });

  r = addTitleBanner(
    calc, 1,
    'RENTAL COST CALCULATOR',
    'Enter your assumptions in the yellow cells for up to 3 options (columns C, D, E). True monthly cost and total lease cost calculate automatically.'
  );
  r += 1;

  // Option headers
  const optCols = ['C', 'D', 'E'];
  const optLabels = ['Option 1', 'Option 2', 'Option 3'];
  optCols.forEach((col, i) => {
    const hc = calc.getCell(`${col}3`);
    hc.value = optLabels[i];
    hc.font = { ...FONT_BASE, bold: true, size: 12, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  calc.getRow(3).height = 26;

  const inputRefs = { opt1: {}, opt2: {}, opt3: {} };

  function addCalcInputSection(row, sectionTitle, fields) {
    row = addSectionBand(calc, row, sectionTitle);
    for (const field of fields) {
      const { key, label, example, note, numFmt = FMT_SGD } = field;
      calc.mergeCells(row, 2, row, 2);
      const lc = calc.getCell(row, 2);
      lc.value = label;
      lc.font = { ...FONT_BASE, color: { argb: NAVY } };
      lc.alignment = { vertical: 'middle', wrapText: true, indent: 1 };

      optCols.forEach((col, i) => {
        const optKey = `opt${i + 1}`;
        const vc = calc.getCell(`${col}${row}`);
        vc.value = example;
        vc.numFmt = numFmt;
        vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
        vc.fill = solid(YELLOW_INPUT);
        vc.border = thinBorder();
        vc.alignment = { vertical: 'middle', horizontal: 'right' };
        vc.dataValidation = {
          type: 'decimal',
          operator: 'greaterThanOrEqual',
          allowBlank: false,
          formulae: ['0'],
          showErrorMessage: true,
          errorTitle: 'Invalid amount',
          error: 'Please enter a non-negative number.',
        };
        inputRefs[optKey][key] = vc.address;
      });

      if (note) {
        calc.mergeCells(row, 6, row, 7);
        const nc = calc.getCell(row, 6);
        nc.value = note;
        nc.font = { ...FONT_BASE, italic: true, size: 9, color: { argb: GREY_TEXT } };
        nc.alignment = { vertical: 'middle', wrapText: true };
      }
      calc.getRow(row).height = 22;
      row += 1;
    }
    return row;
  }

  // Monthly recurring costs
  r = addCalcInputSection(r, 'MONTHLY RECURRING COSTS', [
    { key: 'rent', label: 'Monthly rent', example: 2200, note: 'Headline rent per month. Room or whole flat.' },
    { key: 'utilities', label: 'Utilities (electricity, water, gas)', example: 180, note: 'Estimate based on usage. Ask landlord for recent bills.' },
    { key: 'wifi', label: 'Wi-Fi / internet', example: 50, note: 'Home fibre plan. May be shared or included.' },
    { key: 'cleaning', label: 'Cleaning / housekeeping', example: 0, note: 'Weekly/bi-weekly service if applicable.' },
    { key: 'aircon', label: 'Air-con servicing / maintenance', example: 40, note: 'Quarterly servicing amortised monthly (~S$160/quarter).' },
    { key: 'otherRecurring', label: 'Other monthly recurring costs', example: 0, note: 'E.g., town council conservancy (if not included), subscriptions.' },
    { key: 'transport', label: 'Transport allowance / commute cost', example: 150, note: 'Your incremental transport cost for this location vs baseline.' },
  ]);

  // One-off / upfront costs
  r = addCalcInputSection(r, 'ONE-OFF / UPFRONT COSTS', [
    { key: 'deposit', label: 'Security deposit (months of rent)', example: 2, note: 'Typically 1–2 months. Enter number of months; formula converts to S$.', numFmt: '0.0' },
    { key: 'stampDuty', label: 'Stamp duty (tenant\'s share)', example: 150, note: 'Lease duty per IRAS. For leases ≤3 years: 0.4% of total rent. Verify on IRAS website.' },
    { key: 'agentFee', label: 'Agent commission (if any)', example: 0, note: 'Typically 1 month rent if tenant\'s agent. Enter 0 if direct.' },
    { key: 'movingCost', label: 'Moving / setup costs', example: 300, note: 'Mover, boxes, initial groceries, minor repairs.' },
    { key: 'otherOneoff', label: 'Other one-off costs', example: 0, note: 'Any other upfront payment.' },
  ]);

  // Lease terms
  r = addCalcInputSection(r, 'LEASE TERMS', [
    { key: 'leaseMonths', label: 'Lease duration (months)', example: 24, note: 'Typical HDB lease: 24 months. Enter your agreed term.', numFmt: '0' },
    { key: 'rentReview', label: 'Expected mid-lease rent increase (%)', example: 0, note: 'If landlord indicates a review. Enter % (e.g., 5 for 5%).', numFmt: '0.0' },
  ]);

  r += 1;

  // Calculated outputs
  r = addSectionBand(calc, r, 'CALCULATED — TRUE MONTHLY COST', GREEN);

  // Monthly total formula per option
  optCols.forEach((col, i) => {
    const optKey = `opt${i + 1}`;
    const ref = inputRefs[optKey];
    const monthlyFormula = `${ref.rent}+${ref.utilities}+${ref.wifi}+${ref.cleaning}+${ref.aircon}+${ref.otherRecurring}+${ref.transport}`;
    const vc = calc.getCell(`${col}${r}`);
    vc.value = { formula: monthlyFormula, result: 0 };
    vc.numFmt = FMT_SGD;
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.fill = solid(GREEN_SOFT);
    vc.border = thinBorder();
    vc.alignment = { vertical: 'middle', horizontal: 'right' };
    inputRefs[optKey].monthlyTotal = vc.address;
  });
  const monthlyLabel = calc.getCell(r, 2);
  monthlyLabel.value = 'True monthly cost';
  monthlyLabel.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  monthlyLabel.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  calc.getRow(r).height = 24;
  r += 1;

  // Total lease cost
  r = addSectionBand(calc, r, 'TOTAL LEASE COST', GREEN);

  optCols.forEach((col, i) => {
    const optKey = `opt${i + 1}`;
    const ref = inputRefs[optKey];
    // Total = (monthly * leaseMonths) + one-off costs + stamp duty
    const oneoffFormula = `${ref.deposit}*${ref.rent}+${ref.stampDuty}+${ref.agentFee}+${ref.movingCost}+${ref.otherOneoff}`;
    const totalFormula = `(${ref.monthlyTotal}*${ref.leaseMonths})+${oneoffFormula}`;
    const vc = calc.getCell(`${col}${r}`);
    vc.value = { formula: totalFormula, result: 0 };
    vc.numFmt = FMT_SGD;
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.fill = solid(GREEN_SOFT);
    vc.border = thinBorder();
    vc.alignment = { vertical: 'middle', horizontal: 'right' };
    inputRefs[optKey].totalLease = vc.address;
  });
  const totalLabel = calc.getCell(r, 2);
  totalLabel.value = 'Total lease cost (monthly × months + one-off costs)';
  totalLabel.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  totalLabel.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  calc.getRow(r).height = 24;
  r += 1;

  // Average monthly including one-off amortised
  r = addSectionBand(calc, r, 'AVERAGE MONTHLY COST (INCL. ONE-OFF AMORTISED)', BLUE);

  optCols.forEach((col, i) => {
    const optKey = `opt${i + 1}`;
    const ref = inputRefs[optKey];
    const avgFormula = `${ref.totalLease}/${ref.leaseMonths}`;
    const vc = calc.getCell(`${col}${r}`);
    vc.value = { formula: avgFormula, result: 0 };
    vc.numFmt = FMT_SGD;
    vc.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
    vc.fill = solid(BLUE_SOFT);
    vc.border = thinBorder();
    vc.alignment = { vertical: 'middle', horizontal: 'right' };
    inputRefs[optKey].avgMonthly = vc.address;
  });
  const avgLabel = calc.getCell(r, 2);
  avgLabel.value = 'Average monthly cost (total lease ÷ months)';
  avgLabel.font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  avgLabel.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  calc.getRow(r).height = 24;
  r += 1;

  // Comparison row
  r = addSectionBand(calc, r, 'COMPARISON — CHEAPEST OPTION', ORANGE);

  calc.mergeCells(r, 2, r, 2);
  const v1 = calc.getCell(`C${r}`);
  calc.mergeCells(r, 3, r, 7);
  v1.value = {
    formula: `IF(C${r-2}>0,IF(AND(C${r-2}<=D${r-2},C${r-2}<=E${r-2}),"Option 1",IF(AND(D${r-2}<=C${r-2},D${r-2}<=E${r-2}),"Option 2","Option 3")),"Enter data")`,
    result: 'Enter data',
  };
  v1.font = { ...FONT_BASE, bold: true, size: 11, color: { argb: NAVY } };
  v1.fill = solid(ORANGE_SOFT);
  v1.border = thinBorder();
  v1.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  calc.getCell(`B${r}`).value = 'Lowest total cost option';
  calc.getCell(`B${r}`).font = { ...FONT_BASE, bold: true, color: { argb: NAVY } };
  calc.getCell(`B${r}`).alignment = { vertical: 'middle', indent: 1 };
  calc.getRow(r).height = 26;
  r += 1;

  calc.mergeCells(r, 2, r, 7);
  c = calc.getCell(r, 2);
  c.value = 'Tip: The cheapest headline rent may not be the cheapest total cost. Always compare the "Average monthly cost" row which includes one-off costs amortised over the lease.';
  c.font = { ...FONT_BASE, italic: true, size: 10, color: { argb: GREY_TEXT } };
  c.alignment = { vertical: 'middle', wrapText: true, indent: 1 };
  calc.getRow(r).height = 24;

  // ========================================================================
  // TAB 3 — VIEWING CHECKLIST
  // ========================================================================
  const view = wb.addWorksheet('VIEWING CHECKLIST', {
    properties: { tabColor: { argb: ORANGE } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 3 }],
  });
  view.getColumn(1).width = 3;
  view.getColumn(2).width = 8;
  view.getColumn(3).width = 40;
  view.getColumn(4).width = 10;
  view.getColumn(5).width = 10;
  view.getColumn(6).width = 10;
  view.getColumn(7).width = 30;

  r = addTitleBanner(
    view, 1,
    'HDB VIEWING CHECKLIST',
    'Use during viewings. Tick ✓/✗, add notes, take photos. Print or use on phone. Mark "N/A" where not applicable.'
  );
  r += 1;

  // Headers — cols B..G map exactly to how rows are written below
  const viewHeaders = ['✓', 'Checklist item', 'OK?', 'Issue?', 'Photo?', 'Notes / Evidence'];
  viewHeaders.forEach((h, i) => {
    const hc = view.getCell(r, 2 + i);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: i === 0 ? 'center' : 'left', indent: i > 0 ? 1 : 0 };
  });
  view.getRow(r).height = 24;
  r += 1;

  function addChecklistSection(row, category, items, color = BLUE) {
    row = addSectionBand(view, row, category, color);
    for (const item of items) {
      view.getCell(row, 3).value = item;
      view.getCell(row, 3).font = { ...FONT_BASE, color: { argb: NAVY } };
      view.getCell(row, 3).alignment = { vertical: 'middle', wrapText: true, indent: 1 };
      view.getCell(row, 3).border = thinBorder();

      // OK / Issue / Photo tick cells (cols D, E, F)
      ['D', 'E', 'F'].forEach((col) => {
        const vc = view.getCell(`${col}${row}`);
        vc.value = '';
        vc.font = { ...FONT_BASE, size: 14, color: { argb: GREEN } };
        vc.alignment = { vertical: 'middle', horizontal: 'center' };
        vc.border = thinBorder();
      });
      // Notes
      view.getCell(row, 7).border = thinBorder();
      view.getCell(row, 7).alignment = { vertical: 'middle', wrapText: true };
      view.getRow(row).height = 22;
      row += 1;
    }
    return row;
  }

  r = addChecklistSection(r, 'UNIT CONDITION — GENERAL', [
    'Walls: cracks, water stains, peeling paint, mould',
    'Ceiling: water stains, cracks, sagging',
    'Floors: level, tiles intact, no hollow sounds, vinyl/lino condition',
    'Windows: open/close smoothly, locks work, seals intact, no cracks',
    'Doors: main door lock, bedroom/bathroom doors align and latch',
    'Main door: HDB fire-rated door intact, digital lock / chain / peephole',
    'Balcony / service yard: floor condition, drainage, drying rack',
  ], BLUE);

  r = addChecklistSection(r, 'PLUMBING & WATER', [
    'Kitchen tap: flow, pressure, temperature, leaks',
    'Bathroom basin tap: flow, pressure, temperature, leaks',
    'Shower / toilet: flush strength, cistern refill, no leaks at base',
    'Water heater: turns on, heats adequately, no odd noises',
    'Washing machine tap: thread condition, no drips',
    'Service yard tap / floor trap: drains freely, no odour',
    'Check under sinks: no damp, mould, or water damage',
  ], BLUE);

  r = addChecklistSection(r, 'VENTILATION & SMELL', [
    'Natural airflow: cross-ventilation possible, windows on opposite sides',
    'Bathroom: exhaust fan working, no lingering damp smell',
    'Kitchen: range hood / exhaust working, no grease buildup',
    'No musty, sewage, cigarette, pet, or cooking odours embedded',
    'Bedrooms: windows open, air circulates',
  ], GREEN);

  r = addChecklistSection(r, 'AIR-CON & APPLIANCES', [
    'Each air-con unit: powers on, cools, remote works, no water leak',
    'Air-con service history: ask for records, check last service date',
    'Refrigerator: cools, seals tight, freezer works',
    'Cooking hob / hood: all burners light, hood extracts',
    'Oven / microwave (if provided): heats, door seals',
    'Water heater: storage or instant, capacity adequate',
    'Washer / dryer (if provided): runs cycle, no leaks',
  ], GREEN);

  r = addChecklistSection(r, 'PESTS, DAMAGE & STAINS', [
    'Cockroach / ant trails: kitchen, bathroom, cabinets',
    'Termite signs: mud tubes, hollow wood, frass',
    'Rodent signs: droppings, gnaw marks, entry holes',
    'Bed bugs: mattress seams, bed frame, black spots',
    'Mould / mildew: bathroom ceiling, window frames, wardrobes',
    'Stains on mattress, sofa, curtains, carpets',
    'Burn marks, holes, tears in provided furnishings',
  ], ORANGE);

  r = addChecklistSection(r, 'HOUSE RULES & OCCUPANCY', [
    'Cooking: allowed? Light only? No frying? Restrictions?',
    'Guests: overnight guests allowed? Duration limit? Registration?',
    'Laundry: drying on balcony/yard? Machine hours?',
    'Noise: quiet hours? Music/TV volume?',
    'Smoking: indoors? Balcony? Designated area?',
    'Pets: allowed? Type/size restrictions?',
    'Subletting / Airbnb: explicitly prohibited?',
    'Number of occupants: max per room/flat per HDB guidelines',
    'Utility billing: how split? Meter readings? Fixed amount?',
  ], ORANGE);

  r = addChecklistSection(r, 'DEPOSIT & PAYMENT RED FLAGS', [
    'Deposit amount matches agreement (typically 1–2 months rent)',
    'Deposit to be held in joint account / stakeholder / lawyer?',
    'Receipt for every payment — landlord/agent must provide',
    'No "booking fee" or "goodwill deposit" before signing TA',
    'Rent due date, mode (bank transfer preferred), late fee terms',
    'Utility bills: whose name? How reimbursed?',
    'Stamp duty: who pays? Tenant\'s share per IRAS?',
  ], ORANGE);

  r = addChecklistSection(r, 'DOCUMENTATION & EVIDENCE', [
    'Take timestamped photos of EVERY room, defects, meters',
    'Video walkthrough recommended',
    'Record meter readings (electricity, water, gas) on move-in day',
    'Note existing damage in writing + photos — send to landlord/agent immediately',
    'Verify landlord\'s NRIC / HDB ownership (HDB flat portal)',
    'Verify agent\'s CEA registration (if applicable)',
    'Request latest HDB rental approval letter (if whole flat)',
    'Keep all WhatsApp/email records of agreements and promises',
  ], BLUE);

  // ========================================================================
  // TAB 4 — PRE-SIGNING CHECKLIST
  // ========================================================================
  const pre = wb.addWorksheet('PRE-SIGNING CHECKLIST', {
    properties: { tabColor: { argb: 'FF9333EA' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 3 }],
  });
  pre.getColumn(1).width = 3;
  pre.getColumn(2).width = 8;
  pre.getColumn(3).width = 50;
  pre.getColumn(4).width = 10;
  pre.getColumn(5).width = 10;
  pre.getColumn(6).width = 10;
  pre.getColumn(7).width = 30;

  r = addTitleBanner(
    pre, 1,
    'PRE-SIGNING VERIFICATION CHECKLIST',
    'Complete BEFORE signing the Tenancy Agreement or paying any deposit. Tick ✓/✗, add notes. Do NOT proceed if critical items (marked ⚠) are unresolved.'
  );
  r += 1;

  // Headers — cols B..G map exactly to how rows are written below
  const preHeaders = ['⚠', 'Verification step', 'OK?', 'Issue?', 'Doc?', 'Notes / Evidence'];
  preHeaders.forEach((h, i) => {
    const hc = pre.getCell(r, 2 + i);
    hc.value = h;
    hc.font = { ...FONT_BASE, bold: true, size: 10, color: { argb: WHITE } };
    hc.fill = solid(NAVY);
    hc.border = thinBorder();
    hc.alignment = { vertical: 'middle', horizontal: i <= 1 ? 'center' : 'left', indent: i > 1 ? 1 : 0 };
  });
  pre.getRow(r).height = 24;
  r += 1;

  function addPreSection(row, category, items, color = BLUE) {
    row = addSectionBand(pre, row, category, color);
    for (const item of items) {
      const { critical, text } = typeof item === 'object' ? item : { critical: false, text: item };
      pre.getCell(row, 2).value = critical ? '⚠' : '';
      pre.getCell(row, 2).font = { ...FONT_BASE, bold: true, size: 14, color: { argb: critical ? ORANGE : GREY_TEXT } };
      pre.getCell(row, 2).alignment = { vertical: 'middle', horizontal: 'center' };
      pre.getCell(row, 2).border = thinBorder();

      pre.getCell(row, 3).value = text;
      pre.getCell(row, 3).font = { ...FONT_BASE, color: { argb: NAVY } };
      pre.getCell(row, 3).alignment = { vertical: 'middle', wrapText: true, indent: 1 };
      pre.getCell(row, 3).border = thinBorder();

      ['D', 'E', 'F'].forEach((col) => {
        const vc = pre.getCell(`${col}${row}`);
        vc.value = '';
        vc.font = { ...FONT_BASE, size: 14, color: { argb: GREEN } };
        vc.alignment = { vertical: 'middle', horizontal: 'center' };
        vc.border = thinBorder();
      });
      pre.getCell(row, 7).border = thinBorder();
      pre.getCell(row, 7).alignment = { vertical: 'middle', wrapText: true };
      pre.getRow(row).height = 22;
      row += 1;
    }
    return row;
  }

  r = addPreSection(r, 'LANDLORD / OWNER ELIGIBILITY', [
    { critical: true, text: 'Landlord is registered HDB flat owner (verify via HDB Flat Portal or request owners\' NRICs)' },
    { critical: true, text: 'All co-owners consent to rental (HDB requires all owners\' consent)' },
    { critical: false, text: 'Landlord not bankrupt / no outstanding HDB loans in arrears (ask; no public registry)' },
    { critical: false, text: 'If landlord is overseas: valid Power of Attorney for rental matters' },
  ], BLUE);

  r = addPreSection(r, 'AGENT VERIFICATION (IF APPLICABLE)', [
    { critical: true, text: 'Agent has valid CEA licence (check CEA Public Register: www.cea.gov.sg)' },
    { critical: true, text: 'Agent\'s estate agency is licensed (check CEA Register)' },
    { critical: false, text: 'Agent provides Estate Agency Agreement (Form 1) before acting' },
    { critical: false, text: 'Commission amount and payer clearly stated in writing' },
  ], BLUE);

  r = addPreSection(r, 'HDB RENTAL APPROVAL (WHOLE FLAT)', [
    { critical: true, text: 'HDB rental approval letter obtained (mandatory for whole flat rental)' },
    { critical: true, text: 'Approved tenant names match Tenancy Agreement' },
    { critical: true, text: 'Lease term within HDB limits (max 3 years per approval)' },
    { critical: false, text: 'Minimum Occupation Period (MOP) satisfied by owner (5 years for BTO/SBF)' },
    { critical: false, text: 'Quota for non-Malaysian tenants not exceeded (if applicable)' },
  ], ORANGE);

  r = addPreSection(r, 'TENANCY AGREEMENT (TA) REVIEW', [
    { critical: true, text: 'Written TA provided for review BEFORE any payment' },
    { critical: true, text: 'All verbal promises included in TA (no side agreements)' },
    { critical: true, text: 'Rent amount, due date, payment mode, late fees match discussion' },
    { critical: true, text: 'Lease start/end dates, renewal option, notice period clear' },
    { critical: false, text: 'Inventory list attached: all furniture, appliances, fixtures listed with condition' },
    { critical: false, text: 'Maintenance responsibilities: landlord vs tenant clearly defined' },
    { critical: false, text: 'Air-con servicing clause: who pays? How often? (Typical: tenant pays quarterly)' },
    { critical: false, text: 'Early termination clause: notice, penalty, deposit forfeiture terms' },
    { critical: false, text: 'Diplomatic clause (if expat): break lease for job relocation' },
    { critical: false, text: 'Right of entry: landlord/agent access rules, notice period' },
    { critical: false, text: 'Utility accounts: whose name? Transfer process? Final reading?' },
  ], GREEN);

  r = addPreSection(r, 'DEPOSIT & PAYMENT DOCUMENTATION', [
    { critical: true, text: 'Deposit amount = agreed months of rent (typically 1–2)' },
    { critical: true, text: 'Deposit receipt issued with landlord/agent name, date, amount, purpose' },
    { critical: true, text: 'Deposit held per agreement: stakeholder / joint account / lawyer / landlord' },
    { critical: false, text: 'First month\'s rent receipt obtained' },
    { critical: false, text: 'Agent commission receipt (if paid)' },
    { critical: false, text: 'Stamp duty: tenant\'s share calculated, payment plan agreed' },
    { critical: false, text: 'Post-dated cheques / GIRO / standing instruction details confirmed' },
  ], ORANGE);

  r = addPreSection(r, 'STAMP DUTY & IRAS COMPLIANCE', [
    { critical: false, text: 'Lease duty calculated per IRAS: 0.4% of total rent for lease ≤3 years (tenant\'s share)' },
    { critical: false, text: 'Stamp duty paid within 14 days of signing (penalty if late)' },
    { critical: false, text: 'e-Stamping via IRAS portal (www.iras.gov.sg) — keep certificate' },
    { critical: false, text: 'If agent says "landlord pays stamp duty" — confirm in writing in TA' },
    { critical: false, text: 'Reference: IRAS "Stamp Duty for Lease/Tenancy Agreements" guide' },
  ], GREEN);

  r = addPreSection(r, 'EVIDENCE PRESERVATION', [
    { critical: false, text: 'Move-in condition report signed by both parties (with photos)' },
    { critical: false, text: 'Meter readings (electricity, water, gas) recorded and acknowledged' },
    { critical: false, text: 'All keys tested and counted: main, bedroom, bathroom, mailbox, gate' },
    { critical: false, text: 'Digital copies of: TA, inventory, condition report, receipts, approval letters' },
    { critical: false, text: 'WhatsApp/email thread with landlord/agent preserved (do not delete)' },
    { critical: false, text: 'Emergency contacts: landlord, agent, town council, SP Services, gas supplier' },
  ], BLUE);

  // ========================================================================
  // TAB 5 — MESSAGE TEMPLATES
  // ========================================================================
  const msg = wb.addWorksheet('MESSAGE TEMPLATES', {
    properties: { tabColor: { argb: 'FF7C3AED' } },
    views: [{ showGridLines: false, state: 'frozen', ySplit: 2 }],
  });
  msg.getColumn(1).width = 3;
  msg.getColumn(2).width = 30;
  msg.getColumn(3).width = 80;
  msg.getColumn(4).width = 30;

  r = addTitleBanner(
    msg, 1,
    'MESSAGE TEMPLATES',
    'Copy, adapt, and send via WhatsApp/email. Keep records. Replace [bracketed] parts with your details.'
  );
  r += 1;

  const templates = [
    {
      title: '1. Requesting Tenancy Agreement Before Paying',
      category: 'Pre-viewing / Pre-commitment',
      text: `Hi [Landlord/Agent Name],

Thank you for showing me the unit at [address/unit number]. I am keen to proceed.

Before I pay any deposit or booking fee, could you please share a copy of the Tenancy Agreement (TA) for my review? I would like to:
• Review all terms and conditions
• Verify the inventory list and condition report
• Confirm the deposit amount, payment schedule, and stamp duty arrangement

Once I have reviewed the TA and am comfortable with the terms, I will be ready to proceed with the deposit.

Thank you,
[Your Name]
[Your Contact]`
    },
    {
      title: '2. Clarifying Included / Excluded Costs',
      category: 'Cost Clarification',
      text: `Hi [Landlord/Agent Name],

To avoid any misunderstanding, could you please confirm in writing what is included in the monthly rent of S$[amount] for [address/unit number]?

Specifically:
• Utilities (electricity, water, gas) — included or separate? If separate, whose account?
• Wi-Fi / internet — included or separate?
• Town council conservancy charges — included or separate?
• Air-con servicing — who arranges and pays? (Typical: tenant pays quarterly)
• Any other recurring fees (e.g., management fees, parking, dryer usage)

Also, please confirm:
• Security deposit: [X] months = S$[amount]
• Stamp duty: tenant's share per IRAS guidelines — who will handle e-stamping?
• Agent commission (if any): amount and payer

Thank you,
[Your Name]`
    },
    {
      title: '3. Clarifying House Rules',
      category: 'House Rules',
      text: `Hi [Landlord/Agent Name],

Before signing, I would like to confirm the house rules for [address/unit number] in writing so there are no disputes later:

• Cooking: [e.g., light cooking allowed / no frying / no strong smells]
• Overnight guests: [allowed / not allowed / max X nights per month / registration required]
• Laundry drying: [balcony allowed / service yard only / specific hours]
• Noise/quiet hours: [e.g., 10pm–7am]
• Smoking: [not allowed indoors / balcony allowed / designated area]
• Pets: [not allowed / small pets allowed / specific restrictions]
• Visitors/guests during day: [any restrictions?]
• Air-con usage: [any restrictions on hours/temperature?]
• Subletting / Airbnb: [understood to be prohibited per HDB rules]

Please reply confirming the above or with any corrections. I will keep this for our records.

Thank you,
[Your Name]`
    },
    {
      title: '4. Requesting Inventory / Condition Documentation',
      category: 'Pre-signing / Move-in',
      text: `Hi [Landlord/Agent Name],

As we prepare to sign the Tenancy Agreement for [address/unit number], could you please provide:

1. A complete inventory list of all furniture, appliances, and fixtures provided with the unit, including their current condition (e.g., "Refrigerator — Samsung, 2-door, working, minor scratch on door").

2. A move-in condition report template or confirmation that we will jointly document the unit condition on move-in day with timestamped photos.

3. The latest utility meter readings (electricity, water, gas) so we can record the starting point.

4. Confirmation of the number and types of keys provided (main door, bedroom, bathroom, mailbox, gate, digital lock codes).

I want to ensure a smooth handover and avoid any deposit disputes at the end of the lease.

Thank you,
[Your Name]`
    },
    {
      title: '5. Confirming Payment / Stamping / Documentation Details',
      category: 'Final Confirmation',
      text: `Hi [Landlord/Agent Name],

Confirming our agreement for [address/unit number] before I make the deposit payment:

• Monthly rent: S$[amount], due on the [date] of each month
• Payment mode: [Bank transfer to: Bank / Account name / Account number / PayNow UEN]
• Security deposit: [X] months = S$[amount]
  - To be held by: [stakeholder / joint account / lawyer / landlord]
  - Receipt to be issued upon receipt
• First month rent: S$[amount] due on move-in [date]
• Stamp duty (tenant's share per IRAS): S$[amount] — to be e-stamped by [landlord/agent/me] within 14 days
• Agent commission (if any): S$[amount] payable by [tenant/landlord]
• Lease term: [X] months, from [start date] to [end date]
• Notice period: [X] months
• Inventory & condition report: to be completed on move-in day with photos

Please reply "Confirmed" or with any corrections. Once confirmed, I will proceed with the deposit payment.

Thank you,
[Your Name]`
    },
  ];

  templates.forEach((tmpl, idx) => {
    r = addSectionBand(msg, r, `${tmpl.title} (${tmpl.category})`, idx % 2 === 0 ? BLUE : GREEN);
    msg.mergeCells(r, 2, r, 4);
    const tc = msg.getCell(r, 2);
    tc.value = tmpl.text;
    tc.font = { ...FONT_BASE, size: 10, color: { argb: NAVY }, family: 3 }; // monospace-ish
    tc.alignment = { vertical: 'top', wrapText: true, indent: 1 };
    msg.getRow(r).height = 200;
    r += 1;
  });

  // ========================================================================
  // TAB 6 — SOURCES & NOTES
  // ========================================================================
  const src = wb.addWorksheet('SOURCES & NOTES', {
    properties: { tabColor: { argb: GREY_TEXT } },
    views: [{ showGridLines: false }],
  });
  src.getColumn(1).width = 3;
  src.getColumn(2).width = 30;
  src.getColumn(3).width = 90;

  r = addTitleBanner(
    src, 1,
    'SOURCES, ASSUMPTIONS & NOTES',
    'Official references and assumption disclosures for this pack.'
  );
  r += 1;

  const sources = [
    { category: 'HDB Rental Rules', items: [
      'HDB "Renting Out Your Flat" — https://www.hdb.gov.sg/residential/renting-a-flat/renting-out-your-flat',
      'HDB "Renting a Flat" — https://www.hdb.gov.sg/residential/renting-a-flat/renting-a-flat',
      'HDB Rental Approval Application — https://services2.hdb.gov.sg/webapp/BP13AWFlatRental/rental_enquiry.jsp',
      'HDB Minimum Occupation Period (MOP) — typically 5 years for BTO/SBF flats',
      'HDB Non-Citizen Quota — https://www.hdb.gov.sg/residential/renting-a-flat/non-citizen-quota',
    ]},
    { category: 'CEA (Council for Estate Agencies)', items: [
      'CEA Public Register (verify agent/agency) — https://www.cea.gov.sg/public-register',
      'Estate Agency Agreement (Form 1) requirements',
      'CEA Code of Ethics and Professional Client Care',
    ]},
    { category: 'IRAS (Inland Revenue Authority of Singapore)', items: [
      'Stamp Duty for Lease/Tenancy Agreements — https://www.iras.gov.sg/irashome/Stamp-Duty/Lease-or-Tenancy-Agreements/',
      'Current rate: 0.4% of total rent for leases ≤ 3 years (tenant\'s share unless otherwise agreed)',
      'e-Stamping portal — https://www.iras.gov.sg/eservices/estamping/',
      'Penalty for late stamping: up to 4x duty',
    ]},
    { category: 'Community Mediation & Dispute Resolution', items: [
      'Community Mediation Centre (CMC) — https://www.cmc.gov.sg/',
      'Small Claims Tribunals (SCT) — for disputes up to S$20,000 (or S$30,000 with consent)',
      'HDB Branch mediation for landlord-tenant disputes',
    ]},
    { category: 'Key Assumptions in This Pack', items: [
      'Stamp duty calculated at 0.4% of total rent (lease ≤ 3 years). Verify current rate on IRAS website.',
      'Security deposit: 1–2 months rent is market practice; HDB does not mandate a specific amount.',
      'Agent commission: typically 1 month rent if tenant engages agent; negotiable.',
      'Air-con servicing: quarterly (~S$160/quarter) is market practice; clause should specify.',
      'Conservancy charges: typically included in rent for whole flat; may be separate for room rental.',
      'Utility accounts: best practice to transfer to tenant\'s name; landlord may prefer to keep in their name.',
      'HDB rental approval: mandatory for whole flat rental; not required for room rental (but owner must register tenants).',
      'All legal/regulatory references are as of 2026. Rules may change. Verify on official websites before relying.',
    ]},
    { category: 'Important Disclaimers', items: [
      'This pack is a practical planning and protection tool. It is NOT legal advice.',
      'For tenancy disputes, consult the Community Mediation Centre, CEA, or a qualified lawyer.',
      'HDB, CEA, and IRAS rules are authoritative. This pack references them but may not reflect the latest amendments.',
      'The rental calculator uses simplified assumptions. Actual costs may vary.',
      'Templates are starting points — adapt to your specific situation.',
    ]},
  ];

  sources.forEach((section) => {
    r = addSectionBand(src, r, section.category, BLUE);
    section.items.forEach((item) => {
      src.mergeCells(r, 2, r, 3);
      const c = src.getCell(r, 2);
      c.value = `• ${item}`;
      c.font = { ...FONT_BASE, size: 10, color: { argb: NAVY } };
      c.alignment = { vertical: 'top', wrapText: true, indent: 1 };
      src.getRow(r).height = 20;
      r += 1;
    });
    r += 1;
  });

  // ------------------------------------------------------------------------
  // Protect sheets: leave only yellow INPUT cells editable.
  // Protection carries NO password — power users can unprotect freely.
  // ------------------------------------------------------------------------
  // RENTAL CALCULATOR inputs (all live on the RENTAL CALCULATOR sheet)
  const calcInputRefs = [...new Set(
    Object.values(inputRefs).flatMap(opt => Object.values(opt))
  )].filter(a => /^[A-Z]{1,2}\d+$/.test(a)); // only plain cell addresses (skip derived refs)
  for (const addr of calcInputRefs) {
    calc.getCell(addr).protection = { locked: false };
  }

  // Protect sheets
  for (const ws of [calc, view, pre, msg]) {
    await ws.protect('', {
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

  // START HERE and SOURCES & NOTES — no inputs, protect fully
  for (const ws of [start, src]) {
    await ws.protect('', {
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
  const outDir = path.join(__dirname, '..', 'digital-products', 'hdb-tenant-pack');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'singapore-hdb-tenant-protection-cost-pack-2026.xlsx');
  const buffer = await wb.xlsx.writeBuffer();
  fs.writeFileSync(outFile, Buffer.from(buffer));
  console.log(`Workbook written: ${outFile}`);
  console.log(`Sheets: ${wb.worksheets.map((w) => w.name).join(' | ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
