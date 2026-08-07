// src/app/tools/page.tsx
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: "Singapore Resident Tools | SG Events Hub",
  description: "Practical calculators and tools for Singapore residents — HDB affordability, CPF planner, transport cost calculator, school finder, and more.",
  openGraph: {
    title: "Singapore Resident Tools | SG Events Hub",
    description: "Practical calculators and tools for Singapore residents — HDB affordability, CPF planner, transport cost calculator, school finder, and more.",
  }
};

const tools = [
  {
    name: "HDB Affordability Calculator",
    description: "Check if you can afford that BTO or resale flat. Factors in income, CPF, grants, and loan limits.",
    icon: "calculator",
    href: "/tools/hdb-affordability",
    category: "Housing",
    status: "Live",
  },
  {
    name: "CPF Retirement Planner",
    description: "Project your CPF balances at 55, 65, and beyond. See how top-ups and transfers affect your payouts.",
    icon: "planner",
    href: "/tools/cpf-planner",
    category: "Money",
    status: "Live",
  },
  {
    name: "Transport Cost Calculator",
    description: "Compare MRT vs bus vs car vs Grab for your daily commute. Includes ERP, parking, and petrol costs.",
    icon: "transportCost",
    href: "/tools/transport-cost",
    category: "Transport",
    status: "Live",
  },
  {
    name: "School Distance Checker",
    description: "Find primary/secondary schools within 1km, 1-2km of your address. Includes PSLE cut-off points.",
    icon: "school",
    href: "/tools/school-finder",
    category: "Study",
    status: "Live",
  },
  {
    name: "Hawker Price Tracker",
    description: "Track prices of your favorite hawker dishes across neighborhoods. Spot inflation trends.",
    icon: "hawker",
    href: "/tools/hawker-prices",
    category: "Food",
    status: "Live",
  },
  {
    name: "Clinic & Hospital Finder",
    description: "Locate GP clinics, polyclinics, and hospitals near you. Filter by opening hours, subsidies, and specialties.",
    icon: "clinic",
    href: "/tools/clinic-finder",
    category: "Healthcare",
    status: "Live",
  },
  {
    name: "Salary Benchmark Tool",
    description: "Compare your pay against industry medians by role, experience, and education level in Singapore.",
    icon: "salary",
    href: "/tools/salary-benchmark",
    category: "Work",
    status: "Live",
  },
  {
    name: "Neighborhood Comparison",
    description: "Side-by-side comparison of any two neighborhoods — rent, transport, amenities, schools, vibe.",
    icon: "map",
    href: "/tools/neighborhood-compare",
    category: "Neighborhood",
    status: "Live",
  },
];

export default function ToolsPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="container-wide">
        {/* HERO */}
        <div className="text-center mb-20 md:mb-24" data-animate>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Utilities
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Tools & Calculators
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices, and daily expenses.
          </p>
        </div>

        {/* TOOLS GRID - Tool Highlight Cards */}
        <div className="grid-editorial-4" data-animate>
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="card group p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
                  <span className="text-2xl">{tool.icon === 'calculator' && '🏠' || tool.icon === 'planner' && '💰' || tool.icon === 'transportCost' && '🚇' || tool.icon === 'school' && '📚' || tool.icon === 'hawker' && '🍜' || tool.icon === 'clinic' && '🏥' || tool.icon === 'salary' && '💼' || tool.icon === 'map' && '🗺️'}</span>
                </div>
                <div>
                  <span className={`${mono.className} font-black uppercase tracking-widest mb-1 block`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-blue-light)] transition-colors">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <span className={`${mono.className} font-black uppercase tracking-widest`} style={{ 
                  color: tool.status === 'Live' ? 'var(--color-green-light)' : 'var(--color-text-tertiary)', 
                  fontSize: 'var(--text-micro)' 
                }}>
                  {tool.status}
                </span>
                <span className={`${mono.className} font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`} style={{ color: 'var(--color-blue-light)', fontSize: 'var(--text-micro)' }}>
                  Open Tool
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 text-center" data-animate>
          <p className={`${mono.className} text-[var(--color-text-tertiary)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Built for Residents, by Residents
          </p>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-black mb-6 tracking-tighter italic`}>
            Have a Tool Idea?
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            We're building tools based on what Singapore residents actually need. Tell us what calculator or finder would make your life easier.
          </p>
          <Link
            href="/contact"
            className="btn btn-primary btn-md"
          >
            Suggest a Tool
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-20 pt-10 border-t border-[var(--color-border)] text-center">
          <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic uppercase tracking-[0.3em] max-w-2xl mx-auto`}>
            All calculators provide estimates only. Always verify with official sources (HDB, CPF Board, LTA, MOE, MOH) before making financial decisions.
          </p>
        </div>
      </div>
    </main>
  );
}