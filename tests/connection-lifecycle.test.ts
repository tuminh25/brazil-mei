// tests/connection-lifecycle.test.ts
// Regression guards for the Neon/Prisma connection-lifecycle fix.
// Run: npm run test:conn   (uses tsx; NO real database connection is made)
import { strict as assert } from "assert";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

let passed = 0;
const failures: string[] = [];
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failures.push(name);
    console.error(`  FAIL - ${name}: ${(e as Error).message}`);
  }
}

const ROOT = path.resolve(__dirname, "..");

function listFiles(dir: string, exts: string[], out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(p, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(p);
  }
  return out;
}

console.log("connection-lifecycle tests");

async function main() {
await test("Test 1a: singleton is cached on globalThis outside production", async () => {
  const mod = await import("../src/lib/prisma");
  assert.ok(mod.prisma, "prisma export missing");
  if (process.env.NODE_ENV !== "production") {
    assert.equal(mod.prisma, (globalThis as any).prisma, "singleton not stored on globalThis (dev HMR would duplicate clients)");
  }
});

await test("Test 1b: repeated dynamic import resolves to the SAME instance", async () => {
  const a = await import("../src/lib/prisma");
  const b = await import("../src/lib/prisma");
  assert.equal(a.prisma, b.prisma);
  await a.prisma.$disconnect();
});

await test("Test 2: exactly ONE PrismaClient construction in src/, zero elsewhere", () => {
  const files = listFiles(path.join(ROOT, "src"), [".ts", ".tsx"]);
  const hits = files.filter((f) => /new\s+PrismaClient/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(
    hits.map((h) => path.relative(ROOT, h)),
    [path.join("src", "lib", "prisma.ts")],
    "PrismaClient must only be constructed inside src/lib/prisma.ts"
  );
  const content = fs.readFileSync(path.join(ROOT, "src", "lib", "prisma.ts"), "utf8");
  assert.equal((content.match(/new\s+PrismaClient/g) || []).length, 1, "singleton must construct the client exactly once");
});

await test("Test 2b: dead duplicate singleton lib/prisma.ts is gone", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "lib", "prisma.ts")), false, "duplicate singleton must stay deleted");
});

await test("Test 3: conservative pool params injected into DATABASE_URL", () => {
  const { withPoolParams } = require("../src/lib/prisma");
  const url =
    "postgresql://user:secret@ep-x-pooler.host/neondb?sslmode=require&channel_binding=require";
  const out = withPoolParams(url)!;
  assert.ok(out.startsWith("postgresql://user:secret@ep-x-pooler.host/neondb?"));
  const p = new URLSearchParams(out.split("?")[1]);
  assert.equal(p.get("connection_limit"), "3");
  assert.equal(p.get("pool_timeout"), "10");
  assert.equal(p.get("connect_timeout"), "10");
  assert.equal(p.get("pgbouncer"), "true");
  assert.equal(p.get("sslmode"), "require");
  // secrets preserved verbatim
  assert.ok(out.includes("user:secret@"));
  // idempotent
  assert.equal(withPoolParams(out), out);
  // passthrough for garbage/undefined
  assert.equal(withPoolParams(undefined), undefined);
});

await test("Test 4: each script constructs PrismaClient at most once and releases it or exits", () => {
  const dir = path.join(ROOT, "scripts");
  const offenders: string[] = [];
  for (const f of listFiles(dir, [".js", ".mjs", ".ts"])) {
    const c = fs.readFileSync(f, "utf8");
    if (!c.includes("PrismaClient")) continue;
    const count = (c.match(/new\s+PrismaClient/g) || []).length;
    const releases = /\$disconnect|process\.exit|module\.exports/.test(c);
    if (count > 1 || !releases) offenders.push(`${path.relative(ROOT, f)} (constructs=${count}, releases=${releases})`);
  }
  assert.deepEqual(offenders, [], "scripts must create one client and disconnect/exit:\n" + offenders.join("\n"));
});

await test("Test 5: list queries are bounded (take <= 50) in runtime data access", () => {
  const f = path.join(ROOT, "src", "lib", "data-access", "events.ts");
  const c = fs.readFileSync(f, "utf8");
  const m = c.match(/DEFAULT_TAKE\s*=\s*(\d+)/);
  assert.ok(m, "DEFAULT_TAKE missing");
  assert.ok(Number(m![1]) <= 50, "unbounded findMany detected");
  // brace-balanced scan: every findMany({...}) call body must contain `take`
  const unbounded: number[] = [];
  let idx = c.indexOf("findMany({");
  while (idx !== -1) {
    let depth = 0;
    let end = idx + "findMany".length;
    for (; end < c.length; end++) {
      if (c[end] === "{") depth++;
      else if (c[end] === "}") { depth--; if (depth === 0) break; }
    }
    const body = c.slice(idx, end);
    if (!/\btake\b/.test(body)) unbounded.push(idx);
    idx = c.indexOf("findMany({", end);
  }
  assert.equal(unbounded.length, 0, `findMany without take at offsets: ${unbounded.join(",")}`);
});

if (process.argv.includes("--with-build")) {
  console.log("build test");
  try {
    execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
    console.log("  ok - next build");
  } catch {
    failures.push("next build");
    console.error("  FAIL - next build");
  }
}

console.log(`\nTests: ${passed} passed / ${failures.length} failed${failures.length ? " -> " + failures.join(", ") : ""}`);
process.exit(failures.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
