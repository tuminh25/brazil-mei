// src/components/PaidProductCTA.tsx
// Premium-but-restrained sales block for paid digital products.
// Visually consistent with AffiliateCTA (gradient border card, mono badges,
// Playfair editorial heading). Server component — no client JS.
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';
import { ALL_PRODUCTS, type ProductConfig } from "@/config/products";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

interface PaidProductCTAProps {
  productKey: string;
}

const VALUE_BULLETS: Record<string, string[]> = {
  "transport-calculator": [
    "Personalised cost comparison — your numbers, not national averages",
    "1-year and 10-year total cost view",
    "Break-even analysis: when a car beats MRT + Grab for you",
    "Sensitivity testing for depreciation, petrol and Grab spend",
  ],
  "hdb-tenant-pack": [
    "True monthly cost for up to 3 rental options — rent, utilities, Wi-Fi, transport, stamp duty",
    "Total lease cost + average monthly cost (one-off costs amortised)",
    "Side-by-side comparison — spot the cheapest real option",
    "Viewing checklist, pre-signing verification, and message templates included",
  ],
  "home-bakery-calculator": [
    "Ingredient database with automatic cost-per-gram/ml/unit conversion",
    "Recipe costing with packaging, labour and overhead allocation",
    "Suggested pricing at your target margin, with profit per item and batch",
    "Monthly profit projection plus a home vs shared-kitchen upgrade scenario",
  ],
  "hdb-renosmart-planner": [
    "Personalised renovation budget — your flat, your scope, your floor area",
    "Planning range with contingency and GST — no hidden surprises",
    "Cash requirement & payment milestones tied to your total",
    "Compliance checker: BTO toilet hacking, permits, structural rules",
  ],
  "wedding-angbao-planner": [
    "Total wedding budget with banquet, bridal, photography, décor, rings, and customs",
    "Three ang bao scenarios (conservative / expected / optimistic) with surplus/shortfall",
    "Break-even ang bao per guest and guest count needed to cover costs",
    "Upfront cash requirement and payment milestone timeline",
  ],
  "pr-readiness-audit": [
    "Complete ICA document checklist across 7 categories with required/optional flags",
    "Auto-calculated readiness score by category and overall",
    "Prioritised action plan for missing documents with recommended steps",
    "Profile section for personal, employment, education, and family details",
  ],
  "p1-phase-mapper": [
    "All P1 registration phases (1 to 3) with eligibility, dates, and documents",
    "School shortlist with distance categories and priority planning",
    "Personalised action plan with deadlines and status tracking",
    "Child profile with citizenship, sibling, alumni, and volunteer details",
  ],
  "mdw-tco-planner": [
    "Full first-year and ongoing annual cost breakdown (salary, levy, insurance, living expenses)",
    "Placement loan breakdown: agency fee, employer cash outlay, salary recovery, net cost",
    "Medical and personal accident insurance minimums per MOM (S$60k each)",
    "Affordability check against household income with monthly/annual views",
  ],
  "woodlands-exam-week-backup-plan": [
    "Woodlands/North study-space decision matrix with 6 verified venues",
    "Plan A → B → C → D backup hierarchy for exam-week conditions",
    "Opening-hour and booking checks for every listed venue",
    "Quietness / power / Wi-Fi / AC considerations per venue",
    "Late-hour fallback logic with verified 24-hour options",
    "Exam-week checklist and emergency decision rules",
  ],
};

const DOWNLOAD_DESCRIPTIONS: Record<string, string> = {
  "transport-calculator": "Instant digital download · Works with Excel and Google Sheets",
  "hdb-tenant-pack": "Instant digital download · Works with Excel and Google Sheets",
  "home-bakery-calculator": "Instant digital download · Works with Excel and Google Sheets",
  "hdb-renosmart-planner": "Instant digital download · Works with Excel and Google Sheets",
  "wedding-angbao-planner": "Instant digital download · Works with Excel and Google Sheets",
  "pr-readiness-audit": "Instant digital download · Works with Excel and Google Sheets",
  "p1-phase-mapper": "Instant digital download · Works with Excel and Google Sheets",
  "mdw-tco-planner": "Instant digital download · Works with Excel and Google Sheets",
  "woodlands-exam-week-backup-plan": "Instant digital download · PDF — works on any device",
};

const CTA_COPY: Record<string, { heading: string; blurb: string; noun: string; footer: string }> = {
  "transport-calculator": {
    heading: "Before you commit to a car, run the numbers.",
    blurb: "Enter your own transport habits, car costs and assumptions. Compare your estimated 1-year and 10-year costs, find your break-even point, and test how the decision changes under different assumptions.",
    noun: "Calculator",
    footer: "The article shows typical costs · The calculator applies them to your household",
  },
  "hdb-tenant-pack": {
    heading: "Before you sign a lease, know the true cost.",
    blurb: "Compare the true monthly and total lease cost of up to 3 rental options. Inspect units with a detailed viewing checklist. Verify eligibility and documentation before signing. Use ready-to-copy message templates for clear communication.",
    noun: "Pack",
    footer: "The article outlines your options · The pack helps you verify and protect them",
  },
  "home-bakery-calculator": {
    heading: "Price your bakes for profit, not for guesses.",
    blurb: "Cost every ingredient, recipe and batch precisely — including packaging, your time and overheads. Set prices at your target margin, project monthly profit, and stress-test a shared-kitchen upgrade before committing.",
    noun: "Calculator",
    footer: "The article covers the rules · The calculator makes the business add up",
  },
  "hdb-renosmart-planner": {
    heading: "Before you renovate, know the true cost.",
    blurb: "Enter your flat type, floor area, and renovation scope. Get a personalised budget with GST and contingency, see your cash requirement and payment milestones, and check HDB compliance warnings — all in one workbook.",
    noun: "Planner",
    footer: "The article explains renovation costs · The planner applies them to your flat",
  },
  "wedding-angbao-planner": {
    heading: "Before you book the banquet, know the true cash flow.",
    blurb: "Enter your guest count, venue tier, and vendor quotes. See three ang bao scenarios, break-even points, and the upfront cash you must cover before the wedding day — so guest contributions never become your budget's safety net.",
    noun: "Planner",
    footer: "The article outlines costs and norms · The planner applies them to your wedding",
  },
  "pr-readiness-audit": {
    heading: "Before you submit to ICA, know your document gaps.",
    blurb: "Build your profile, check off every required and supporting document across 7 categories, and get an auto-prioritised action plan for anything missing. No guessing — just a clear readiness score and next steps.",
    noun: "Audit",
    footer: "The article lists ICA requirements · The audit tracks your compliance",
  },
  "p1-phase-mapper": {
    heading: "Before you register for P1, map your real options.",
    blurb: "Enter your child's profile and address. See which phase applies, shortlist schools by actual road-distance tiers, and build a timeline with deadlines. Never register in Phase 2C when an earlier phase actually applies.",
    noun: "Mapper",
    footer: "The article explains phases and distance rules · The mapper applies them to your child",
  },
  "mdw-tco-planner": {
    heading: "Before you hire a helper, know the full cost.",
    blurb: "Enter your helper type, salary, and levy tier. See the complete first-year and ongoing annual cost — including placement loan recovery, insurance minimums, and living expenses — so the monthly salary isn't the only number you plan for.",
    noun: "Planner",
    footer: "The article breaks down MDW costs · The planner applies them to your household",
  },
  "woodlands-exam-week-backup-plan": {
    heading: "Know where to go next before your usual study spot fills up.",
    blurb: "You already know the obvious study spots. The problem starts when you arrive and your first choice is full, too noisy, closed, or simply doesn't fit what you need. The Woodlands Exam Week Backup Plan gives you a practical Plan A → B → C → D system so you can switch quickly instead of starting the search again.",
    noun: "Backup Plan",
    footer: "The article lists study spots · The backup plan tells you what to do when they're full",
  },
};

export default function PaidProductCTA({ productKey }: PaidProductCTAProps) {
  // STRICT product resolution: render nothing unless the key maps to a
  // configured product. Never fall back to another product's price/copy.
  const product = ALL_PRODUCTS.find(p => p.key === productKey);
  if (!product) return null;

  // Per-product PayPal URL — no shared/global fallback. Each product can
  // only ever link to its own dedicated PayPal payment page.
  const checkoutUrl = product.paypalUrl;
  const configured = typeof checkoutUrl === "string" && /^https:\/\/(www\.)?paypal\.com\//.test(checkoutUrl);
  const bullets = VALUE_BULLETS[product.key];
  if (!bullets) return null;
  const copy = CTA_COPY[product.key];
  if (!copy) return null;
  const downloadDesc = DOWNLOAD_DESCRIPTIONS[product.key] || "Instant digital download";

  return (
    <div className="relative group my-24" data-animate>
      {/* Outer glow — same treatment as AffiliateCTA */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-purple)] rounded-[var(--radius-3xl)] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative p-1 md:p-[2px] bg-gradient-to-br from-[var(--color-white)]/15 via-[var(--color-blue)]/20 to-transparent rounded-[var(--radius-3xl)] overflow-hidden">
        <div className="relative card-elevated rounded-[var(--radius-3xl)] p-10 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-blue)]/10 blur-[120px] rounded-full -mr-40 -mt-40 animate-pulse"></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className={`${mono.className} px-4 py-2 bg-[var(--color-blue)]/10 border border-[var(--color-blue)]/30 rounded-full text-[10px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] flex items-center gap-2`}>
                <span className="w-2 h-2 bg-[var(--color-cyan)] rounded-full" />
                Digital Product
              </span>
              <span className={`${mono.className} px-4 py-2 bg-[var(--color-green)]/10 border border-[var(--color-green)]/30 rounded-full text-[10px] text-[var(--color-green-light)] font-black uppercase tracking-[0.3em]`}>
                One-time · {product.priceLabel}
              </span>
            </div>

            <h3 className={`${playfair.className} text-4xl md:text-6xl font-black text-[var(--color-text-primary)] mb-6 tracking-tight leading-tight italic text-balance text-center`}>
              {copy.heading}
            </h3>

            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-center">
              {copy.blurb}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 max-w-3xl mx-auto mb-12">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-5">
              {configured ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="btn btn-primary btn-lg w-full sm:w-auto"
                >
                  Get the {copy.noun} — {product.priceLabel}
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Payment link configuration pending"
                  className="btn btn-primary btn-lg w-full sm:w-auto opacity-60 cursor-not-allowed select-none"
                >
                  Get the {copy.noun} — {product.priceLabel}
                </span>
              )}

              <div className={`${mono.className} flex flex-col items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-tertiary)] text-center`}>
                {!configured && (
                  <p className="text-[var(--color-orange)] normal-case tracking-normal text-xs mb-1">
                    PayPal checkout is being connected — check back shortly.
                  </p>
                )}
                <p>{downloadDesc}</p>
                <p>Estimates only — not financial advice.</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center">
              <p className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-[0.35em]`}>
                {copy.footer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}