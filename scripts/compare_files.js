const fs = require("fs");
const files = [
  "digital-products/hdb-renosmart-planner/HDB-RenoSmart-Budget-Compliance-Planner-2026.xlsx",
  "digital-products/wedding-angbao-planner/singapore-wedding-cashflow-angbao-planner-2026.xlsx",
  "digital-products/pr-readiness-audit/singapore-pr-readiness-document-audit-2026.xlsx",
  "digital-products/p1-phase-mapper/singapore-p1-phase-priority-strategy-mapper-2026.xlsx",
  "digital-products/mdw-tco-planner/singapore-mdw-tco-planner-2026.xlsx"
];

// Read HEAD version from git
const { execSync } = require("child_process");

for (const file of files) {
  // Get SHA from git ls-tree
  const sha = execSync(`git ls-tree HEAD -- ${file}`.trim()).toString().trim().split(" ")[2];
  // Read local file content
  const localBuf = fs.readFileSync(file);
  // Read HEAD version from git object
  const headBuf = execSync(`git cat-file -p HEAD:${file}`.trim()).toString();
  // The cat-file output includes mode and type, we need just the content
  // Actually cat-file -p outputs the raw content for blobs
  // Let's compare differently: use git show HEAD:file > /tmp/head_$file
  require("child_process").execSync(`git show HEAD:${file} > /tmp/head_${file.replace(/\//g, "_")}`);
  const headBuf2 = fs.readFileSync(`/tmp/head_${file.replace(/\//g, "_")}`);
  if (localBuf.equals(headBuf2)) {
    console.log(file + ": MATCHES HEAD");
  } else {
    console.log(file + ": DIFFERS HEAD");
  }
}