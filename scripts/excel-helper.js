// scripts/excel-helper.js
// Shared styling helpers for generating SGEventsHub paid-product workbooks.
const XLSX = require('xlsx');

// ---- Style presets ----
const STYLE = {
  title: {
    font: { name: 'Calibri', sz: 18, bold: true, color: { rgb: '1F2937' } },
    fill: { fgColor: { rgb: 'FFFFFF' } },
  },
  subtitle: {
    font: { name: 'Calibri', sz: 11, italic: true, color: { rgb: '6B7280' } },
  },
  sectionHeader: {
    font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2563EB' } },
    alignment: { vertical: 'center', wrapText: true },
  },
  subHeader: {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1F2937' } },
    fill: { fgColor: { rgb: 'E0E7F1' } },
    alignment: { vertical: 'center' },
  },
  label: {
    font: { name: 'Calibri', sz: 11, color: { rgb: '1F2937' } },
    alignment: { vertical: 'center', wrapText: true },
  },
  labelBold: {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1F2937' } },
    alignment: { vertical: 'center', wrapText: true },
  },
  note: {
    font: { name: 'Calibri', sz: 9, italic: true, color: { rgb: '6B7280' } },
    alignment: { vertical: 'top', wrapText: true },
  },
  input: {
    fill: { fgColor: { rgb: 'FEF3C7' } },
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '92400E' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'D97706' } },
      bottom: { style: 'thin', color: { rgb: 'D97706' } },
      left: { style: 'thin', color: { rgb: 'D97706' } },
      right: { style: 'thin', color: { rgb: 'D97706' } },
    },
  },
  inputText: {
    fill: { fgColor: { rgb: 'FEF3C7' } },
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '92400E' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'D97706' } },
      bottom: { style: 'thin', color: { rgb: 'D97706' } },
      left: { style: 'thin', color: { rgb: 'D97706' } },
      right: { style: 'thin', color: { rgb: 'D97706' } },
    },
  },
  inputDropdown: {
    fill: { fgColor: { rgb: 'FEF3C7' } },
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '92400E' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'D97706' } },
      bottom: { style: 'thin', color: { rgb: 'D97706' } },
      left: { style: 'thin', color: { rgb: 'D97706' } },
      right: { style: 'thin', color: { rgb: 'D97706' } },
    },
  },
  output: {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '065F46' } },
    fill: { fgColor: { rgb: 'D1FAE5' } },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  outputText: {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '065F46' } },
    fill: { fgColor: { rgb: 'D1FAE5' } },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  },
  outputBig: {
    font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: '065F46' } },
    fill: { fgColor: { rgb: 'A7F3D0' } },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  resultPanel: {
    font: { name: 'Calibri', sz: 13, bold: true, color: { rgb: '1E3A8A' } },
    fill: { fgColor: { rgb: 'DBEAFE' } },
    alignment: { horizontal: 'right', vertical: 'center' },
  },
  money: { numFmt: '"S$"#,##0' },
  moneyDp: { numFmt: '"S$"#,##0.00' },
  pct: { numFmt: '0.0%' },
  header: {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '1F2937' } },
    fill: { fgColor: { rgb: 'E5E7EB' } },
    alignment: { vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: '9CA3AF' } },
      bottom: { style: 'thin', color: { rgb: '9CA3AF' } },
    },
  },
  ok: {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '065F46' } },
    fill: { fgColor: { rgb: 'D1FAE5' } },
    alignment: { horizontal: 'center' },
  },
  check: {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '92400E' } },
    fill: { fgColor: { rgb: 'FEF3C7' } },
    alignment: { horizontal: 'center' },
  },
  warning: {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '7F1D1D' } },
    fill: { fgColor: { rgb: 'FEE2E2' } },
    alignment: { horizontal: 'center' },
  },
  danger: {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '7F1D1D' } },
    fill: { fgColor: { rgb: 'FEE2E2' } },
    alignment: { horizontal: 'center' },
  },
  warnText: {
    font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: '92400E' } },
    alignment: { vertical: 'top', wrapText: true },
  },
};

// Normalize an OOXML color to valid 8-digit ARGB. SheetJS/Excel expect 8
// hex digits (FFRRGGBB) in <color rgb="..."/>. 6-digit RGB values are
// preserved as-is visually but some strict parsers trigger "Repair" prompts.
function normColor(color) {
  if (!color) return color;
  const out = { ...color };
  if (typeof out.rgb === 'string' && out.rgb.length === 6) out.rgb = 'FF' + out.rgb;
  return out;
}

// Style registry for SheetJS
const styleRegistry = {
  fonts: [],
  fills: [],
  borders: [],
  cellXfs: [],
  numFmts: [],
  styleMap: new Map(), // style key -> index

  // Default style (index 0)
  init() {
    this.fonts = [{ name: 'Calibri', sz: 11, color: { theme: 1 }, family: 2, scheme: 'minor' }];
    this.fills = [
      { patternFill: { patternType: 'none' } },
      { patternFill: { patternType: 'gray125' } },
    ];
    this.borders = [{ left: {}, right: {}, top: {}, bottom: {}, diagonal: {} }];
    this.cellXfs = [{ numFmtId: 0, fontId: 0, fillId: 0, borderId: 0, xfId: 0 }];
    this.numFmts = [];
    this.styleMap.clear();
    return 0; // default style index
  },

  // Convert style object to a canonical key for deduplication
  styleToKey(style) {
    const parts = [];
    if (style.font) parts.push('font:' + JSON.stringify(style.font));
    if (style.fill) parts.push('fill:' + JSON.stringify(style.fill));
    if (style.border) parts.push('border:' + JSON.stringify(style.border));
    if (style.alignment) parts.push('align:' + JSON.stringify(style.alignment));
    if (style.numFmt) parts.push('numFmt:' + style.numFmt);
    if (style.protection) parts.push('prot:' + JSON.stringify(style.protection));
    return parts.join('|');
  },

  // Get or create a font, return fontId
  getFontId(font) {
    if (!font) return 0;
    const key = JSON.stringify(font);
    for (let i = 0; i < this.fonts.length; i++) {
      if (JSON.stringify(this.fonts[i]) === key) return i;
    }
    this.fonts.push(font);
    return this.fonts.length - 1;
  },

  // Get or create a fill, return fillId
  getFillId(fill) {
    if (!fill) return 0;
    const key = JSON.stringify(fill);
    for (let i = 0; i < this.fills.length; i++) {
      if (JSON.stringify(this.fills[i]) === key) return i;
    }
    this.fills.push(fill);
    return this.fills.length - 1;
  },

  // Get or create a border, return borderId
  getBorderId(border) {
    if (!border) return 0;
    const key = JSON.stringify(border);
    for (let i = 0; i < this.borders.length; i++) {
      if (JSON.stringify(this.borders[i]) === key) return i;
    }
    this.borders.push(border);
    return this.borders.length - 1;
  },

  // Get or create a numFmt, return numFmtId
  getNumFmtId(formatCode) {
    if (!formatCode) return 0;
    // Check built-in formats first (simplified)
    const builtIn = {
      '0.0%': 10, // percentage
      '#,##0': 3,
      '"S$"#,##0': 164,
      '"S$"#,##0.00': 165,
    };
    if (builtIn[formatCode]) return builtIn[formatCode];

    // Check custom numFmts
    for (let i = 0; i < this.numFmts.length; i++) {
      if (this.numFmts[i].formatCode === formatCode) {
        return this.numFmts[i].numFmtId;
      }
    }
    // Assign new numFmtId starting from 164
    const numFmtId = 164 + this.numFmts.length;
    this.numFmts.push({ numFmtId, formatCode });
    return numFmtId;
  },

  // Register a full style, return style index (xf index)
  registerStyle(style) {
    if (!style) return 0;
    const key = this.styleToKey(style);
    if (this.styleMap.has(key)) return this.styleMap.get(key);

    const fontId = this.getFontId(style.font);
    const fillId = this.getFillId(style.fill);
    const borderId = this.getBorderId(style.border);
    const numFmtId = this.getNumFmtId(style.numFmt);

    const xf = {
      numFmtId,
      fontId,
      fillId,
      borderId,
      xfId: 0,
    };
    if (style.font) xf.applyFont = 1;
    if (style.fill) xf.applyFill = 1;
    if (style.border) xf.applyBorder = 1;
    if (style.alignment) xf.applyAlignment = 1;
    if (style.numFmt) xf.applyNumberFormat = 1;
    if (style.protection) xf.applyProtection = 1;
    if (style.alignment) xf.alignment = style.alignment;
    if (style.protection) xf.protection = style.protection;

    const idx = this.cellXfs.length;
    this.cellXfs.push(xf);
    this.styleMap.set(key, idx);
    return idx;
  },

  // Build the stylesheet object for XLSX.write
  buildStylesheet() {
    return {
      fonts: this.fonts,
      fills: this.fills,
      borders: this.borders,
      cellStyleXfs: [{ numFmtId: 0, fontId: 0, fillId: 0, borderId: 0 }],
      cellXfs: this.cellXfs,
      numFmts: this.numFmts.length > 0 ? this.numFmts : undefined,
      cellStyles: [{ name: 'Normal', xfId: 0, builtinId: 0 }],
    };
  },
};

function _num(row) {
  return row + 1;
}

function _colNum(c) {
  let n = 0;
  for (let i = 0; i < c.length; i++) n = n * 26 + (c.charCodeAt(i) - 64);
  return n;
}

function colLetter(n) {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Write a value/style at a cell using "A1" ref. Value may be:
//   scalar -> literal cell, or { f: '...' } -> formula cell.
function setCell(ws, A1, value, style) {
  const cellRef = XLSX.utils.encode_cell(XLSX.utils.decode_cell(A1));
  let cell;
  if (value && typeof value === 'object' && typeof value.f === 'string') {
    // formula cell
    cell = { t: 'n', v: 0, f: value.f };
  } else {
    const t =
      value === null || value === undefined ? 's'
      : typeof value === 'number' ? 'n'
      : typeof value === 'boolean' ? 'b'
      : value instanceof Date ? 'd'
      : 's';
    cell = { t, v: value === undefined ? '' : value === null ? '' : value };
  }
  if (style) {
    const styleIdx = styleRegistry.registerStyle(style);
    cell.s = styleIdx;
    if (style.numFmt) cell.z = style.numFmt;
  }
  ws[cellRef] = cell;
  return ws[cellRef];
}

// Compute !ref (range) for a sheet before writing.
function finalizeSheet(ws) {
  const ref = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (const addr of Object.keys(ws)) {
    if (addr[0] === '!') continue;
    const c = XLSX.utils.decode_cell(addr);
    ref.s.r = Math.min(ref.s.r, c.r);
    ref.e.r = Math.max(ref.e.r, c.r);
    ref.s.c = Math.min(ref.s.c, c.c);
    ref.e.c = Math.max(ref.e.c, c.c);
  }
  ws['!ref'] = XLSX.utils.encode_range(ref);
  return ws;
}

// Create workbook
function newWorkbook() {
  styleRegistry.init();
  const wb = XLSX.utils.book_new();
  return wb;
}

function addSheet(wb, name, ws) {
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

function writeWorkbook(wb, file) {
  wb.SheetNames.forEach(n => finalizeSheet(wb.Sheets[n]));
  const stylesheet = styleRegistry.buildStylesheet();
  // Attach stylesheet to workbook for XLSX.write
  wb.Styles = stylesheet;
  XLSX.writeFile(wb, file, { cellStyles: true, bookType: 'xlsx' });
}

module.exports = {
  XLSX,
  STYLE,
  setCell,
  newWorkbook,
  addSheet,
  writeWorkbook,
  finalizeSheet,
  colLetter,
  _num,
  styleRegistry,
};