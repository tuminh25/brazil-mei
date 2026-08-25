// src/components/PaidProductCTA.tsx
// Premium-but-restrained sales block for paid digital products.
// Visually consistent with AffiliateCTA (gradient border card, mono badges,
// Playfair editorial heading). Server component — no client JS.
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';
import { ALL_PRODUCTS, getPayPalCheckoutUrl, type ProductConfig } from "@/config/products";

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
};

export default function PaidProductCTA({ productKey }: PaidProductCTAProps) {
  // STRICT product resolution: render nothing unless the key maps to a
  // configured product. Never fall back to another product's price/copy.
  const product = ALL_PRODUCTS.find(p => p.key === productKey);
  if (!product) return null;

  const checkoutUrl = getPayPalCheckoutUrl();
  const configured = checkoutUrl.length > 0;
  const bullets = VALUE_BULLETS[product.key];
  if (!bullets) return null;
  const copy = CTA_COPY[product.key];
  if (!copy) return null;

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
                <p>Instant digital download · Works with Excel and Google Sheets</p>
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