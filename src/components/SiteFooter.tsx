import Link from "next/link";
import { ArrowRightIcon, MailIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/Icons';

const footerNavigation = {
  "Resident Guides": [
    { name: "Housing", href: "/guides?category=HOUSING" },
    { name: "Money", href: "/guides?category=MONEY" },
    { name: "Transport", href: "/guides?category=TRANSPORT" },
    { name: "Study", href: "/guides?category=STUDY" },
    { name: "Food", href: "/guides?category=FOOD" },
    { name: "Healthcare", href: "/guides?category=HEALTHCARE" },
    { name: "Work", href: "/guides?category=WORK" },
    { name: "Lifestyle", href: "/guides?category=LIFESTYLE" },
    { name: "Neighborhoods", href: "/guides?category=NEIGHBORHOOD" },
    { name: "Tools", href: "/guides?category=TOOLS" },
  ],
  "Explore": [
    { name: "Neighborhoods Hub", href: "/neighborhoods" },
    { name: "Latest Updates", href: "/latest" },
    { name: "All Guides", href: "/guides" },
    { name: "Tools", href: "/tools" },
  ],
  "Legal & Info": [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Contact Us", href: "/contact" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--color-black)] border-t border-[var(--color-border)] py-20 md:py-32 px-6">
      <div className="container-wide">
        {/* Brand Story Section - Editorial First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 mb-16 md:mb-24" data-animate>
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tighter text-[var(--color-text-primary)] italic uppercase hover:text-[var(--color-blue-light)] transition-colors mb-8 inline-block">
              <span className="text-[var(--color-text-primary)]">Singapore</span>
              <span className="text-[var(--color-blue-light)]">Resident Hub</span>
            </Link>
            
            {/* Editorial Manifesto */}
            <div className="space-y-6 max-w-xl">
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Independent.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Resident-first.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Research-driven.
              </p>
              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed font-light">
                Updated daily.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="mt-10 pt-10 border-t border-[var(--color-border)] max-w-xl">
              <p className="text-[var(--color-text-tertiary)] text-sm leading-relaxed">
                We build practical intelligence for people living in Singapore — not tourists passing through. 
                Every guide is researched, verified, and updated so you can make confident decisions about housing, 
                transport, money, healthcare, food, and daily life.
              </p>
            </div>

            {/* Social Links - Minimal */}
            <div className="mt-10 flex items-center gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="LinkedIn">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="mailto:hello@sgeventshub.com" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-blue-light)] transition-colors" aria-label="Email">
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter in Footer - Premium */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-[var(--radius-3xl)] p-8 md:p-10">
              <p className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-4" style={{ fontSize: 'var(--text-xs)' }}>
                Stay Informed
              </p>
              <h3 className="text-[var(--color-text-primary)] font-black text-xl md:text-2xl mb-4 italic leading-snug">
                Weekly Intelligence Digest
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                New guides, policy changes, and neighborhood insights. No spam. Unsubscribe anytime.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-premium w-full"
                  required
                />
                <button type="submit" className="btn btn-primary btn-md w-full">
                  Subscribe
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[var(--color-text-muted)] mt-4" style={{ fontSize: 'var(--text-micro)' }}>
                By subscribing you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20" data-animate>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Resident Guides
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Resident Guides"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Explore
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Explore"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Legal & Info
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {footerNavigation["Legal & Info"].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">
                    {item.name}
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-blue-light)] font-black uppercase tracking-[0.2em] mb-6" style={{ fontSize: 'var(--text-xs)' }}>
              Tools & Calculators
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/tools/hdb-affordability" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">HDB Affordability<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></Link></li>
              <li><Link href="/tools/cpf-planner" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">CPF Retirement Planner<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></Link></li>
              <li><Link href="/tools/transport-cost" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Transport Cost Calculator<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></Link></li>
              <li><Link href="/tools/school-finder" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">School Distance Checker<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></Link></li>
              <li><Link href="/tools/neighborhood-compare" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2">Neighborhood Comparison<ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-blue-light)' }} /></Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)] pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <p className="text-[var(--color-text-muted)] uppercase tracking-widest font-medium" style={{ fontSize: 'var(--text-micro)' }}>
              © 2026 Singapore Resident Hub. All rights reserved.
            </p>
            <p className="text-[var(--color-text-muted)] uppercase tracking-widest font-medium text-center md:text-right" style={{ fontSize: 'var(--text-micro)' }}>
              Independent resident intelligence platform dedicated to helping people living in Singapore make smarter everyday decisions through trusted research, practical guides and interactive planning tools.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}