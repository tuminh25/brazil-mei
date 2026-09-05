// src/app/api/download/mdw-tco-planner/route.ts
// Signed-token gated XLSX delivery. No DB, no auth, no external calls.
//
// SECURITY LIMITATION (MVP): a valid token grants time-limited access to
// the file but is NOT proof of PayPal payment.
import fs from "node:fs";
import path from "node:path";
import { MDW_TCO_PRODUCT } from "@/config/products";
import { verifyDownloadToken } from "@/lib/download-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function reject(status: number, code: string) {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const verification = verifyDownloadToken(
    url.searchParams.get("token"),
    MDW_TCO_PRODUCT.key
  );
  if (!verification.ok) {
    return reject(403, verification.reason === "expired" ? "token_expired" : "token_invalid");
  }

  const masterPath = path.join(
    process.cwd(),
    "digital-products",
    "mdw-tco-planner",
    MDW_TCO_PRODUCT.masterAssetFile
  );

  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.promises.readFile(masterPath);
  } catch {
    return new Response(JSON.stringify({ error: "asset_unavailable" }), {
      status: 404,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  return new Response(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Type": XLSX_CONTENT_TYPE,
      "Content-Disposition": `attachment; filename="${MDW_TCO_PRODUCT.downloadFileName}"`,
      "Content-Length": String(fileBuffer.byteLength),
      "Cache-Control": "no-store",
    },
  });
}