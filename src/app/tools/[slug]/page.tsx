// src/app/tools/[slug]/page.tsx
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

// Lazy‑load each tool component
const toolComponents: Record<string, React.ComponentType<any>> = {
  'hdb-affordability': dynamic(() => import('@/components/tools/HdbAffordabilityTool')),
  'cpf-planner': dynamic(() => import('@/components/tools/CpfPlannerTool')),
  'transport-cost': dynamic(() => import('@/components/tools/TransportCostTool')),
  'school-finder': dynamic(() => import('@/components/tools/SchoolFinderTool')),
  'hawker-prices': dynamic(() => import('@/components/tools/HawkerPriceTool')),
  'clinic-finder': dynamic(() => import('@/components/tools/ClinicFinderTool')),
  'salary-benchmark': dynamic(() => import('@/components/tools/SalaryBenchmarkTool')),
  'neighborhood-compare': dynamic(() => import('@/components/tools/NeighborhoodCompareTool')),
};

const toolMeta: Record<string, { title: string; description: string }> = {
  'hdb-affordability': {
    title: 'HDB Affordability Calculator',
    description: 'Check if you can afford that BTO or resale flat. Factors in income, CPF, grants, and loan limits.',
  },
  'cpf-planner': {
    title: 'CPF Retirement Planner',
    description: 'Project your CPF balances at 55, 65, and beyond. See how top-ups and transfers affect your payouts.',
  },
  'transport-cost': {
    title: 'Transport Cost Calculator',
    description: 'Compare MRT vs bus vs car vs Grab for your daily commute. Includes ERP, parking, and petrol costs.',
  },
  'school-finder': {
    title: 'School Distance Checker',
    description: 'Find primary/secondary schools within 1km, 1–2km of your address. Includes PSLE cut-off points.',
  },
  'hawker-prices': {
    title: 'Hawker Price Tracker',
    description: 'Track prices of your favorite hawker dishes across neighborhoods. Spot inflation trends.',
  },
  'clinic-finder': {
    title: 'Clinic & Hospital Finder',
    description: 'Locate GP clinics, polyclinics, and hospitals near you. Filter by opening hours, subsidies, and specialties.',
  },
  'salary-benchmark': {
    title: 'Salary Benchmark Tool',
    description: 'Compare your pay against industry medians by role, experience, and education level in Singapore.',
  },
  'neighborhood-compare': {
    title: 'Neighborhood Comparison',
    description: 'Side-by-side comparison of any two neighborhoods — rent, transport, amenities, schools, vibe.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = toolMeta[slug];
  if (!meta) return { title: 'Tool Not Found | SG Events Hub' };
  return {
    title: `${meta.title} | SG Events Hub`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | SG Events Hub`,
      description: meta.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Tool = toolComponents[slug];
  if (!Tool) redirect("/tools");
  return <Tool />;
}