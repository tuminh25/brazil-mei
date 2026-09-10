const XLSX = require('xlsx');
const fs = require('fs');
const files = {
  MDW: "digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx",
  PR: "digital-products/pr-readiness-audit/singapore-pr-readiness-document-audit-2026.xlsx",
  P1: "digital-products/p1-phase-mapper/singapore-p1-phase-priority-strategy-mapper-2026.xlsx"
};
for (const [name, path] of Object.entries(files)) {
  const wb = XLSX.readFile(path);
  console.log("=== " + name + " ===");
  console.log("Styles exists: " + (wb.Styles ? "yes" : "no"));
  console.log("SheetNames: " + wb.SheetNames.join(", "));
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    let formulaCount = 0;
    for (const addr of Object.keys(ws)) {
      const cell = ws[addr];
      if (cell && cell.f) formulaCount++;
    }
    console.log("  " + sheetName + ": " + formulaCount + " formula cells");
  }
  console.log("");
}