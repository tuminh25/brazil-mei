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
    icon: "🏠",
    href: "/tools/hdb-affordability",
    category: "Housing",
    status: "Coming Soon",
  },
  {
    name: "CPF Retirement Planner",
    description: "Project your CPF balances at 55, 65, and beyond. See how top-ups and transfers affect your payouts.",
    icon: "💰",
    href: "/tools/cpf-planner",
    category: "Money",
    status: "Coming Soon",
  },
  {
    name: "Transport Cost Calculator",
    description: "Compare MRT vs bus vs car vs Grab for your daily commute. Includes ERP, parking, and petrol costs.",
    icon: "🚇",
    href: "/tools/transport-cost",
    category: "Transport",
    status: "Coming Soon",
  },
  {
    name: "School Distance Checker",
    description: "Find primary/secondary schools within 1km, 1-2km of your address. Includes PSLE cut-off points.",
    icon: "📚",
    href: "/tools/school-finder",
    category: "Study",
    status: "Coming Soon",
  },
  {
    name: "Hawker Price Tracker",
    description: "Track prices of your favorite hawker dishes across neighborhoods. Spot inflation trends.",
    icon: "🍜",
    href: "/tools/hawker-prices",
    category: "Food",
    status: "Coming Soon",
  },
  {
    name: "Clinic & Hospital Finder",
    description: "Locate GP clinics, polyclinics, and hospitals near you. Filter by opening hours, subsidies, and specialties.",
    icon: "🏥",
    href: "/tools/clinic-finder",
    category: "Healthcare",
    status: "Coming Soon",
  },
  {
    name: "Salary Benchmark Tool",
    description: "Compare your pay against industry medians by role, experience, and education level in Singapore.",
    icon: "💼",
    href: "/tools/salary-benchmark",
    category: "Work",
    status: "Coming Soon",
  },
  {
    name: "Neighborhood Comparison",
    description: "Side-by-side comparison of any two neighborhoods — rent, transport, amenities, schools, vibe.",
    icon: "🗺️",
    href: "/tools/neighborhood-compare",
    category: "Neighborhood",
    status: "Coming Soon",
  },
];

export default function ToolsPage() {
  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-20">
          <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Utilities
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Tools & Calculators
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices, and daily expenses.
          </p>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group p-8 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl mt-1">{tool.icon}</span>
                <div>
                  <span className={`${mono.className} text-blue-400 text-[9px] font-black uppercase tracking-widest mb-2 block`}>
                    {tool.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className={`${mono.className} text-[9px] font-bold uppercase tracking-widest ${
                  tool.status === 'Live' ? 'text-green-400' : 'text-gray-500'
                }`}>
                  {tool.status}
                </span>
                <span className={`${mono.className} text-blue-500 text-[9px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform`}>
                  Open Tool →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 text-center">
          <p className={`${mono.className} text-gray-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Built for Residents, by Residents
          </p>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-black mb-6 tracking-tighter italic`}>
            Have a Tool Idea?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            We're building tools based on what Singapore residents actually need. Tell us what calculator or finder would make your life easier.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg"
          >
            Suggest a Tool
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className={`${mono.className} text-[10px] text-gray-600 italic uppercase tracking-[0.3em] max-w-2xl mx-auto`}>
            All calculators provide estimates only. Always verify with official sources (HDB, CPF Board, LTA, MOE, MOH) before making financial decisions.
          </p>
        </div>
      </div>
    </main>
  );
}