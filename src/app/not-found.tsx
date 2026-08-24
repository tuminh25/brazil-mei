import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>Page Not Found | SG Events Hub</title>
        <meta name="robots" content="noindex" />
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-white flex items-center justify-center px-6`}>
        <main className="max-w-md mx-auto text-center">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-[0.4em] mb-4`}>
            404 — Not Found
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-black tracking-tighter italic mb-6`}>
            Page Not Found
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <nav className="space-y-4" aria-label="Recovery navigation">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-blue)] text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-[var(--color-blue-light)] transition-colors"
            >
              Back to Homepage
            </Link>
            <div className="grid grid-cols-2 gap-3 text-left">
              <Link
                href="/guides"
                className="block p-4 bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-blue)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-cyan-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Browse Guides</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Housing, Transport, Money, Food & more</p>
              </Link>
              <Link
                href="/neighborhoods"
                className="block p-4 bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-green)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-green-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Explore Neighborhoods</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Woodlands, Jurong, Tengah, Punggol, Tampines</p>
              </Link>
              <Link
                href="/tools"
                className="block p-4 bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-purple)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-purple-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Resident Tools</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Calculators for HDB, CPF, Transport</p>
              </Link>
              <Link
                href="/latest"
                className="block p-4 bg-[var(--color-black-soft)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-orange)]/50 transition-colors"
              >
                <p className={`${mono.className} text-[var(--color-orange-light)] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>Latest Updates</p>
                <p className="text-sm text-[var(--color-text-secondary)]">New guides & policy changes</p>
              </Link>
            </div>
          </nav>
          <p className={`${mono.className} text-[var(--color-text-muted)] text-[10px] uppercase tracking-[0.3em] mt-10`}>
            SG Events Hub — Singapore Resident Intelligence
          </p>
        </main>
      </body>
    </html>
  );
}