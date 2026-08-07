'use client';

import Link from "next/link";
import { ArrowRightIcon } from '@/components/ui/Icons';
import { IBM_Plex_Mono } from 'next/font/google';

const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

// Map categories to relevant tools
const categoryToolMap: Record<string, Array<{ name: string; href: string; description: string }>> = {
  HOUSING: [
    { name: "HDB Affordability Calculator", href: "/tools/hdb-affordability", description: "Check your HDB eligibility and budget" },
    { name: "CPF Retirement Planner", href: "/tools/cpf-planner", description: "Plan CPF usage for housing" },
  ],
  MONEY: [
    { name: "CPF Retirement Planner", href: "/tools/cpf-planner", description: "Project your CPF savings and payouts" },
    { name: "Salary Benchmark", href: "/tools/salary-benchmark", description: "Compare your pay against industry standards" },
  ],
  HEALTHCARE: [
    { name: "Clinic & Hospital Finder", href: "/tools/clinic-finder", description: "Find nearby clinics and hospitals" },
  ],
  TRANSPORT: [
    { name: "Transport Cost Calculator", href: "/tools/transport-cost", description: "Calculate MRT, bus, and ride-hailing costs" },
    { name: "Neighborhood Comparison", href: "/tools/neighborhood-compare", description: "Compare commute times across areas" },
  ],
  FOOD: [
    { name: "Hawker Price Tracker", href: "/tools/hawker-price", description: "Track hawker dish prices across centres" },
    { name: "Neighborhood Comparison", href: "/tools/neighborhood-compare", description: "Compare food scenes across neighborhoods" },
  ],
  WORK: [
    { name: "Salary Benchmark", href: "/tools/salary-benchmark", description: "Compare your pay against industry standards" },
    { name: "CPF Retirement Planner", href: "/tools/cpf-planner", description: "Plan CPF contributions and retirement" },
  ],
  LIFESTYLE: [
    { name: "Neighborhood Comparison", href: "/tools/neighborhood-compare", description: "Compare lifestyle amenities across areas" },
  ],
  STUDY: [
    { name: "School Distance Checker", href: "/tools/school-finder", description: "Find schools near your home" },
    { name: "Neighborhood Comparison", href: "/tools/neighborhood-compare", description: "Compare education options across areas" },
  ],
  NEIGHBORHOOD: [
    { name: "Neighborhood Comparison", href: "/tools/neighborhood-compare", description: "Compare neighborhoods side by side" },
  ],
  TOOLS: [
    { name: "HDB Affordability Calculator", href: "/tools/hdb-affordability", description: "Check your HDB eligibility and budget" },
    { name: "CPF Retirement Planner", href: "/tools/cpf-planner", description: "Project your CPF savings and payouts" },
    { name: "Transport Cost Calculator", href: "/tools/transport-cost", description: "Calculate MRT, bus, and ride-hailing costs" },
  ],
};

interface ResidentToolsProps {
  category: string;
}

export function ResidentTools({ category }: ResidentToolsProps) {
  const tools = categoryToolMap[category] || categoryToolMap.TOOLS;
  
  if (!tools || tools.length === 0) return null;

  return (
    <section className="my-24" data-animate>
      <h3 className={`${mono.className} text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.4em] mb-12 text-center`}>
        Useful Resident Tools
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="card-elevated group p-6 flex items-start gap-4 transition-all hover:border-[var(--color-blue)]/30"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--color-black)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-blue)]/10 transition-colors border border-[var(--color-border)]">
              <svg className="w-6 h-6" style={{ color: 'var(--color-blue-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-cyan-light)] transition">
                {tool.name}
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">{tool.description}</p>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-[var(--color-blue-light)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}