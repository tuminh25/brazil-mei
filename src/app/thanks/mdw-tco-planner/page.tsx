// src/app/thanks/mdw-tco-planner/page.tsx
// Post-Purchase thank-you page for the MDW Total Cost of Ownership (TCO) Planner.
// PayPal Auto-Return lands here. The page mints a short-lived signed
// download token; the download route enforces signature + expiry.
//
// KNOWN LIMITATION (MVP): reaching this page is not server-verified proof of
// PayPal payment. Tokens only provide expiring file access.
import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import { MDW_TCO_PRODUCT } from "@/config/products";
import { createDownloadToken } from "@/lib/download-token";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your MDW TCO Planner Is Ready — SGEventsHub",
  robots: { index: false, follow: false },
};

export default function MDWTCOPlannerThanksPage() {
  const product = MDW_TCO_PRODUCT;
  let token: string | null = null;
  let configError = false;
  try {
    token = createDownloadToken(product.key);
  } catch {
    configError = true;
  }

  return (
    <main className="min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl">
        <div className={`${mono.className} text-[10px] text-[var(--color-cyan-light)] font-black uppercase tracking-[0.4em] mb-6 text-center`}>
          SGEventsHub · Digital Product
        </div>

        <div className="card-elevated rounded-[var(--radius-3xl)] p-10 md:p-14">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-center">
            Your MDW TCO Planner is ready.
          </h1>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-10 text-center">
            Thank you for supporting SGEventsHub. Download your copy of the{" "}
            <strong className="text-[var(--color-text-primary)]">{product.name}</strong> below.
            Payments are processed securely by PayPal — we never see or store your card details.
          </p>

          {configError ? (
            <div className="rounded-2xl border border-[var(--color-orange)]/40 bg-[var(--color-orange)]/10 p-6 mb-8 text-center">
              <p className="text-sm leading-relaxed">
                Downloads are temporarily unavailable (configuration issue). Please contact us and we will send you the file directly.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 mb-8">
              <a href={`/api/download/mdw-tco-planner?token=${encodeURIComponent(token!)}`} className="btn btn-primary btn-lg w-full sm:w-auto" download>
                Download the Planner ({product.priceLabel} · .xlsx)
              </a>
              <p className={`${mono.className} text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-tertiary)] text-center`}>
                Download links expire after 30 minutes — refresh this page for a new one.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-[var(--color-border)] p-6 mb-8">
            <h2 className="text-base font-bold mb-3">Getting started</h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed list-none pl-0">
              <li>• Opens in Microsoft Excel and Google Sheets.</li>
              <li>• Start on the START HERE tab, then enter helper type, salary, and levy tier on INPUTS.</li>
              <li>• FIRST-YEAR COST breaks down salary, levy, insurance, agency fee, and living expenses.</li>
              <li>• PLACEMENT LOAN shows agency fee, employer cash outlay, salary recovery, and net cost.</li>
              <li>• INSURANCE flags MOM minimums (S$60k medical, S$60k personal accident).</li>
              <li>• AFFORDABILITY checks monthly/annual cost against household income.</li>
            </ul>
          </div>

          <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed text-center mb-8">
            Planning tool only — not financial or legal advice. Need help? <Link href="/contact" className="underline hover:text-[var(--color-text-secondary)]">Contact us</Link> with your PayPal receipt email and we&apos;ll sort you out.
          </p>

          <p className={`${mono.className} text-[9px] uppercase tracking-[0.35em] text-[var(--color-text-tertiary)] text-center`}>
            © SGEventsHub · Personal planning tool
          </p>
        </div>
      </div>
    </main>
  );
}