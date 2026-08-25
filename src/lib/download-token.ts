// src/lib/download-token.ts
// Minimal expiring signed-token utility for paid digital downloads.
// HMAC-SHA256 over "productKey.expiry". No database, no auth system.
//
// KNOWN LIMITATION (by design, MVP): a valid token proves nothing about
// PayPal payment — it only grants time-limited access to the file.
import crypto from "node:crypto";

export const DEFAULT_TOKEN_TTL_SECONDS = 30 * 60;

function getSecret(): string {
  return (process.env.DOWNLOAD_TOKEN_SECRET || "").trim();
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createDownloadToken(productKey: string, ttlSeconds: number = DEFAULT_TOKEN_TTL_SECONDS): string {
  if (!getSecret()) throw new Error("DOWNLOAD_TOKEN_SECRET is not configured");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${productKey}.${exp}`;
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${sign(payload)}`;
}

export type TokenVerification =
  | { ok: true; productKey: string }
  | { ok: false; reason: "malformed" | "invalid_signature" | "expired" | "product_mismatch" };

export function verifyDownloadToken(token: string | null | undefined, expectedProductKey: string): TokenVerification {
  const secret = getSecret();
  if (!secret || !token) return { ok: false, reason: "malformed" };

  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };

  let payload: string;
  try {
    payload = Buffer.from(parts[0], "base64url").toString("utf8");
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const expectedSig = Buffer.from(sign(payload));
  const providedSig = Buffer.from(parts[1]);
  if (expectedSig.length !== providedSig.length || !crypto.timingSafeEqual(expectedSig, providedSig)) {
    return { ok: false, reason: "invalid_signature" };
  }

  const dot = payload.lastIndexOf(".");
  if (dot <= 0) return { ok: false, reason: "malformed" };
  const productKey = payload.slice(0, dot);
  const exp = Number(payload.slice(dot + 1));
  if (!Number.isFinite(exp)) return { ok: false, reason: "malformed" };
  if (productKey !== expectedProductKey) return { ok: false, reason: "product_mismatch" };
  if (exp <= Math.floor(Date.now() / 1000)) return { ok: false, reason: "expired" };

  return { ok: true, productKey };
}
