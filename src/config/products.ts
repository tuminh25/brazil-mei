// src/config/products.ts
// Paid digital products sold via PayPal.
//
// PAYMENT DESTINATION
// The authoritative checkout destination is the owner-supplied PayPal
// payment page (public information, safe to ship in code):
//   https://www.paypal.com/ncp/payment/6JYXQ5WASJBQ6
//
// Optional env overrides (neither is required for production):
//   PAYPAL_CHECKOUT_URL      — full https://www.paypal.com/... checkout URL
//   PAYPAL_HOSTED_BUTTON_ID  — legacy classic hosted-button ID fallback
//
// No credentials or secrets belong in this file.
export const TRANSPORT_CALCULATOR_PRODUCT = {
  key: "transport-calculator",
  name: "Singapore Car vs MRT/Grab Total Cost Decision Calculator (2026)",
  shortName: "Transport Cost Decision Calculator",
  priceLabel: "S$19",
  priceAmount: 19,
  currency: "SGD",
  articleSlug: "singapore-transport-costs-2026-mrt-bus-grab-car-comparison",
  masterAssetFile: "singapore-car-vs-mrt-grab-decision-calculator-2026.xlsx",
  downloadFileName: "SGEventsHub-Car-vs-MRT-Grab-Calculator-2026.xlsx",
  thanksPath: "/thanks/transport-calculator",
} as const;

export const HDB_TENANT_PRODUCT = {
  key: "hdb-tenant-pack",
  name: "Singapore HDB Tenant Protection & Cost Pack (2026)",
  shortName: "HDB Tenant Protection & Cost Pack",
  priceLabel: "S$17",
  priceAmount: 17,
  currency: "SGD",
  articleSlug: "hdb-rental-guide-rental-flat-room-rental-eligibility",
  masterAssetFile: "singapore-hdb-tenant-protection-cost-pack-2026.xlsx",
  downloadFileName: "SGEventsHub-HDB-Tenant-Protection-Cost-Pack-2026.xlsx",
  thanksPath: "/thanks/hdb-tenant-pack",
} as const;

export const HOME_BAKERY_PRODUCT = {
  key: "home-bakery-calculator",
  name: "Singapore Home Bakery Pricing & Profit Calculator (2026)",
  shortName: "Home Bakery Pricing & Profit Calculator",
  priceLabel: "S$22",
  priceAmount: 22,
  currency: "SGD",
  articleSlug: "home-based-food-business-singapore",
  masterAssetFile: "singapore-home-bakery-pricing-profit-calculator-2026.xlsx",
  downloadFileName: "SGEventsHub-Home-Bakery-Pricing-Profit-Calculator-2026.xlsx",
  thanksPath: "/thanks/home-bakery-calculator",
} as const;

export type ProductConfig = typeof TRANSPORT_CALCULATOR_PRODUCT | typeof HDB_TENANT_PRODUCT | typeof HOME_BAKERY_PRODUCT;

export const ALL_PRODUCTS = [TRANSPORT_CALCULATOR_PRODUCT, HDB_TENANT_PRODUCT, HOME_BAKERY_PRODUCT] as const;

export function getProductByKey(key: string): ProductConfig | undefined {
  return ALL_PRODUCTS.find(p => p.key === key);
}

export function getProductByArticleSlug(slug: string): ProductConfig | undefined {
  return ALL_PRODUCTS.find(p => p.articleSlug === slug);
}

const OWNER_PAYPAL_CHECKOUT_URL = "https://www.paypal.com/ncp/payment/6JYXQ5WASJBQ6";

export function getPayPalCheckoutUrl(): string {
  const envUrl = (process.env.PAYPAL_CHECKOUT_URL || "").trim();
  if (/^https:\/\/(www\.)?paypal\.com\//.test(envUrl)) return envUrl;

  const id = (process.env.PAYPAL_HOSTED_BUTTON_ID || "").trim();
  if (id) {
    return `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${encodeURIComponent(id)}`;
  }

  return OWNER_PAYPAL_CHECKOUT_URL;
}
