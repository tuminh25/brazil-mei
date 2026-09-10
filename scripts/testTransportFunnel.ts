/**
 * Unit tests: product config + signed download tokens.
 * Run: npx tsx scripts/testTransportFunnel.ts
 */
const SECRET = "unit-test-secret-0123456789abcdef";

process.env.DOWNLOAD_TOKEN_SECRET = SECRET;
delete process.env.PAYPAL_HOSTED_BUTTON_ID;

async function main() {
  const { createDownloadToken, verifyDownloadToken } = await import("../src/lib/download-token");
  const { TRANSPORT_CALCULATOR_PRODUCT: P, getPayPalCheckoutUrl } = await import("../src/config/products");

  let pass = 0, fail = 0;
  const check = (name: string, cond: boolean) => { if (cond) { pass++; console.log("  PASS", name); } else { fail++; console.error("  FAIL", name); } };
  const failsWith = (v: ReturnType<typeof verifyDownloadToken>, reason: string) => !v.ok && v.reason === reason;

  console.log("== PRODUCT CONFIG ==");
  check("key", P.key === "transport-calculator");
  check("price S$19 SGD", P.priceLabel === "S$19" && P.currency === "SGD" && P.priceAmount === 19);
  check("article slug", P.articleSlug === "singapore-transport-costs-2026-mrt-bus-grab-car-comparison");
  check("master asset path-safe", /^[a-z0-9-]+\.xlsx$/.test(P.masterAssetFile));
  check("download filename ASCII safe", /^[\x20-\x7e]+$/.test(P.downloadFileName) && !/["\\;]/.test(P.downloadFileName));
  delete process.env.PAYPAL_CHECKOUT_URL;
  delete process.env.PAYPAL_HOSTED_BUTTON_ID;
  const ownerUrl = getPayPalCheckoutUrl();
  check("owner checkout URL is the real PayPal payment page",
    ownerUrl === "https://www.paypal.com/ncp/payment/6JYXQ5WASJBQ6");
  process.env.PAYPAL_CHECKOUT_URL = "https://www.paypal.com/ncp/payment/OVERRIDE1";
  check("PAYPAL_CHECKOUT_URL override wins", getPayPalCheckoutUrl() === "https://www.paypal.com/ncp/payment/OVERRIDE1");
  delete process.env.PAYPAL_CHECKOUT_URL;
  process.env.PAYPAL_HOSTED_BUTTON_ID = "TESTBTN123";
  check("legacy hosted-button fallback", getPayPalCheckoutUrl().includes("hosted_button_id=TESTBTN123"));
  delete process.env.PAYPAL_HOSTED_BUTTON_ID;
  check("non-paypal env URL ignored", (process.env.PAYPAL_CHECKOUT_URL = "https://evil.example/x", getPayPalCheckoutUrl()) === ownerUrl);
  delete process.env.PAYPAL_CHECKOUT_URL;

  console.log("== TOKENS ==");
  const tok = createDownloadToken(P.key);
  check("valid token verifies", verifyDownloadToken(tok, P.key).ok === true);

  const [payloadB64] = tok.split(".");
  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  check("token embeds product id", payload.startsWith(P.key + "."));
  const exp = Number(payload.split(".")[1]);
  check("token embeds future expiry (~30min)", exp > Date.now() / 1000 && exp <= Date.now() / 1000 + 31 * 60);

  const tamperedPayload = Buffer.from(payload.replace(String(exp), String(exp + 99999)), "utf8").toString("base64url");
  check("tampered expiry rejected", failsWith(verifyDownloadToken(`${tamperedPayload}.${tok.split(".")[1]}`, P.key), "invalid_signature"));
  check("wrong signature rejected", failsWith(verifyDownloadToken(tok.slice(0, -4) + "AAAA", P.key), "invalid_signature"));
  check("expired rejected", failsWith(verifyDownloadToken(createDownloadToken(P.key, -10), P.key), "expired"));
  check("product mismatch rejected", failsWith(verifyDownloadToken(tok, "other-product"), "product_mismatch"));
  check("garbage rejected", failsWith(verifyDownloadToken("garbage-token", P.key), "malformed"));
  check("null rejected", verifyDownloadToken(null, P.key).ok === false);
  {
    delete process.env.DOWNLOAD_TOKEN_SECRET;
    let threw = false;
    try { createDownloadToken(P.key); } catch { threw = true; }
    check("creation fails closed without secret", threw);
    check("verification fails closed without secret", verifyDownloadToken(tok, P.key).ok === false);
    process.env.DOWNLOAD_TOKEN_SECRET = SECRET;
  }

  console.log(`\n${fail === 0 ? "UNIT TESTS PASSED" : "UNIT TESTS FAILED"}`);
  process.exit(fail === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });

