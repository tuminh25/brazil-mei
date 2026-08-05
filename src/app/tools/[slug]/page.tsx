import { redirect } from "next/navigation";
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

const toolsData: Record<string, { name: string; description: string; category: string; icon: string }> = {
  'hdb-affordability-calculator': {
    name: 'HDB Affordability Calculator',
    description: 'Check if you can afford that BTO or resale flat. Factors in income, CPF, grants, and loan limits.',
    category: 'Housing',
    icon: '🏠',
  },
  'cpf-retirement-planner': {
    name: 'CPF Retirement Planner',
    description: 'Project your CPF balances at 55, 65, and beyond. See how top-ups and transfers affect your payouts.',
    category: 'Money',
    icon: '💰',
  },
  'transport-cost-calculator': {
    name: 'Transport Cost Calculator',
    description: 'Compare MRT vs bus vs car vs Grab for your daily commute. Includes ERP, parking, and petrol costs.',
    category: 'Transport',
    icon: '🚇',
  },
  'school-distance-checker': {
    name: 'School Distance Checker',
    description: 'Find primary/secondary schools within 1km, 1-2km of your address. Includes PSLE cut-off points.',
    category: 'Study',
    icon: '📚',
  },
  'hawker-price-tracker': {
    name: 'Hawker Price Tracker',
    description: 'Track prices of your favorite hawker dishes across neighborhoods. Spot inflation trends.',
    category: 'Food',
    icon: '🍜',
  },
  'clinic-hospital-finder': {
    name: 'Clinic & Hospital Finder',
    description: 'Locate GP clinics, polyclinics, and hospitals near you. Filter by opening hours, subsidies, and specialties.',
    category: 'Healthcare',
    icon: '🏥',
  },
  'salary-benchmark-tool': {
    name: 'Salary Benchmark Tool',
    description: 'Compare your pay against industry medians by role, experience, and education level in Singapore.',
    category: 'Work',
    icon: '💼',
  },
  'neighborhood-comparison': {
    name: 'Neighborhood Comparison',
    description: 'Side-by-side comparison of any two neighborhoods — rent, transport, amenities, schools, vibe.',
    category: 'Neighborhood',
    icon: '🗺️',
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData[slug];

  if (!tool) {
    return {
      title: "Tool Not Found | SG Events Hub",
      description: "Practical calculators and tools for Singapore residents.",
    };
  }

  return {
    title: `${tool.name} | SG Events Hub`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | SG Events Hub`,
      description: tool.description,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(toolsData).map((slug) => ({ slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsData[slug];

  if (!tool) redirect("/tools");

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* BACK LINK */}
        <div className="mb-12">
          <Link
            href="/tools"
            className={`${mono.className} flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.4em] hover:text-white transition inline-flex`}
          >
            ← All Tools
          </Link>
        </div>

        {/* TOOL HEADER */}
        <div className="text-center mb-16">
          <span className="text-6xl block mb-6">{tool.icon}</span>
          <span className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block`}>
            {tool.category}
          </span>
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-black mb-6 tracking-tighter italic`}>
            {tool.name}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* COMING SOON NOTICE */}
        <div className="max-w-3xl mx-auto text-center p-12 bg-[#0a0a0a] border border-white/10 rounded-[3rem]">
          <div className={`${mono.className} text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4`}>
            Coming Soon
          </div>
          <h2 className={`${playfair.className} text-3xl md:text-4xl font-black mb-6 tracking-tighter italic`}>
            This tool is under development
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            We're building this calculator with real Singapore data — HDB prices, CPF rates, LTA transport costs, MOE school data, and MOH clinic listings.
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem]">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-white font-medium">Researching official data sources</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem]">
              <span className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-gray-400">Building calculation engine</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem]">
              <span className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-gray-400">Designing resident-friendly interface</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-[1.5rem]">
              <span className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-gray-400">Testing with real Singapore scenarios</span>
            </div>
          </div>
          <p className={`${mono.className} text-[10px] text-gray-600 mt-10 uppercase tracking-[0.3em]`}>
            Want this tool faster? <Link href="/contact" className="text-blue-400 hover:underline">Tell us</Link>.
          </p>
        </div>

        {/* RELATED TOOLS */}
        <section className="mt-24">
          <h3 className={`${mono.className} text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-12 text-center`}>
            Other Useful Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(toolsData)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, t]) => (
                <Link
                  key={key}
                  href={`/tools/${key}`}
                  className="group p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 text-center"
                >
                  <span className="text-4xl block mb-4">{t.icon}</span>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {t.name}
                  </h4>
                  <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]`}>
                    {t.category}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}