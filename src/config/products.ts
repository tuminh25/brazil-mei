// src/config/products.ts
// Paid digital products sold via PayPal.
//
// PAYMENT DESTINATION
// Each product carries its own dedicated PayPal payment URL (`paypalUrl`).
// PaidProductCTA resolves the checkout URL from the matched product only —
// there is deliberately NO cross-product fallback. Auto Return URLs are
// configured in PayPal directly; none are set in code.
//
// Public payment pages, safe to ship in code. No credentials or secrets
// belong in this file.
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
  paypalUrl: "https://www.paypal.com/ncp/payment/6JYXQ5WASJBQ6",
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
  paypalUrl: "https://www.paypal.com/ncp/payment/Q3KGGKE3UBFCN",
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
  paypalUrl: "https://www.paypal.com/ncp/payment/9N8RHTMEPZSEY",
} as const;

export const HDB_RENOSMART_PRODUCT = {
  key: "hdb-renosmart-planner",
  name: "HDB RenoSmart Budget & Compliance Planner (2026)",
  shortName: "HDB RenoSmart Planner",
  priceLabel: "S$19",
  priceAmount: 19,
  currency: "SGD",
  articleSlug: "hdb-renovation-cost-guide-singapore",
  masterAssetFile: "HDB-RenoSmart-Budget-Compliance-Planner-2026.xlsx",
  downloadFileName: "SGEventsHub-HDB-RenoSmart-Planner-2026.xlsx",
  thanksPath: "/thanks/hdb-renosmart-planner",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_HDB_RENOSMART",
} as const;

export const WEDDING_ANGBAO_PRODUCT = {
  key: "wedding-angbao-planner",
  name: "Singapore Wedding Cashflow & Ang Bao Planner (2026)",
  shortName: "Wedding Cashflow & Ang Bao Planner",
  priceLabel: "S$19",
  priceAmount: 19,
  currency: "SGD",
  articleSlug: "singapore-wedding-cost-ang-bao-guide",
  masterAssetFile: "singapore-wedding-cashflow-angbao-planner-2026.xlsx",
  downloadFileName: "SGEventsHub-Wedding-AngBao-Planner-2026.xlsx",
  thanksPath: "/thanks/wedding-angbao-planner",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_WEDDING_ANGBAO",
} as const;

export const PR_READINESS_PRODUCT = {
  key: "pr-readiness-audit",
  name: "Singapore PR Readiness & Document Audit (2026)",
  shortName: "PR Readiness & Document Audit",
  priceLabel: "S$19",
  priceAmount: 19,
  currency: "SGD",
  articleSlug: "singapore-pr-self-submission-guide",
  masterAssetFile: "singapore-pr-readiness-document-audit-2026.xlsx",
  downloadFileName: "SGEventsHub-PR-Readiness-Audit-2026.xlsx",
  thanksPath: "/thanks/pr-readiness-audit",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_PR_READINESS",
} as const;

export const P1_PHASE_MAPPER_PRODUCT = {
  key: "p1-phase-mapper",
  name: "Singapore P1 Phase & Priority Strategy Mapper (2026)",
  shortName: "P1 Phase & Priority Strategy Mapper",
  priceLabel: "S$17",
  priceAmount: 17,
  currency: "SGD",
  articleSlug: "p1-registration-phases-distance-guide",
  masterAssetFile: "singapore-p1-phase-priority-strategy-mapper-2026.xlsx",
  downloadFileName: "SGEventsHub-P1-Phase-Mapper-2026.xlsx",
  thanksPath: "/thanks/p1-phase-mapper",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_P1_PHASE_MAPPER",
} as const;

export const MDW_TCO_PRODUCT = {
  key: "mdw-tco-planner",
  name: "Singapore MDW Total Cost of Ownership (TCO) Planner (2026)",
  shortName: "MDW TCO Planner",
  priceLabel: "S$19",
  priceAmount: 19,
  currency: "SGD",
  articleSlug: "foreign-domestic-worker-hiring-cost-guide",
  masterAssetFile: "singapore-mdw-tco-planner-2026.xlsx",
  downloadFileName: "SGEventsHub-MDW-TCO-Planner-2026.xlsx",
  thanksPath: "/thanks/mdw-tco-planner",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_MDW_TCO",
} as const;

export const WOODLANDS_EXAM_BACKUP_PRODUCT = {
  key: "woodlands-exam-week-backup-plan",
  name: "Woodlands Exam Week Backup Plan 2026",
  shortName: "Woodlands Exam Week Backup Plan",
  priceLabel: "S$6.90",
  priceAmount: 6.9,
  currency: "SGD",
  articleSlug: "quiet-study-spots-woodlands-singapore-2026",
  masterAssetFile: "Woodlands-Exam-Week-Backup-Plan-2026.pdf",
  downloadFileName: "Woodlands-Exam-Week-Backup-Plan-2026.pdf",
  thanksPath: "/thanks/woodlands-exam-week-backup-plan",
  paypalUrl: "https://www.paypal.com/ncp/payment/PLACEHOLDER_WOODLANDS_EXAM_BACKUP",
} as const;

export type ProductConfig = typeof TRANSPORT_CALCULATOR_PRODUCT | typeof HDB_TENANT_PRODUCT | typeof HOME_BAKERY_PRODUCT | typeof HDB_RENOSMART_PRODUCT | typeof WEDDING_ANGBAO_PRODUCT | typeof PR_READINESS_PRODUCT | typeof P1_PHASE_MAPPER_PRODUCT | typeof MDW_TCO_PRODUCT | typeof WOODLANDS_EXAM_BACKUP_PRODUCT;

export const ALL_PRODUCTS = [TRANSPORT_CALCULATOR_PRODUCT, HDB_TENANT_PRODUCT, HOME_BAKERY_PRODUCT, HDB_RENOSMART_PRODUCT, WEDDING_ANGBAO_PRODUCT, PR_READINESS_PRODUCT, P1_PHASE_MAPPER_PRODUCT, MDW_TCO_PRODUCT, WOODLANDS_EXAM_BACKUP_PRODUCT] as const;

export function getProductByKey(key: string): ProductConfig | undefined {
  return ALL_PRODUCTS.find(p => p.key === key);
}

export function getProductByArticleSlug(slug: string): ProductConfig | undefined {
  return ALL_PRODUCTS.find(p => p.articleSlug === slug);
}

// LEGACY global URL resolver — retained only for the transport funnel
// verification script. Production CTAs use each product's own `paypalUrl`.
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
