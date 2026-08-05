// src/app/neighborhoods/[slug]/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

const neighborhoodData: Record<string, { name: string; description: string; imageUrl: string; tags: string[]; mrtLines: string[]; highlights: string[] }> = {
  woodlands: {
    name: "Woodlands",
    description: "Woodlands is Singapore's northern gateway — a major residential town with direct causeway access to Malaysia, waterfront living at Woodlands Waterfront Park, and expanding MRT connectivity via the Thomson-East Coast Line. It's a practical choice for cross-border commuters and families seeking larger homes near nature.",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1600",
    tags: ["Waterfront", "Causeway", "TEL", "Nature Parks", "Cross-border"],
    mrtLines: ["North-South Line", "Thomson-East Coast Line"],
    highlights: [
      "Woodlands Waterfront Park — 1.5km coastal promenade with Johor Bahru views",
      "Admiralty Park — largest nature area in the north with 26 slides",
      "Woodlands Checkpoint — busiest land crossing to Malaysia",
      "Upcoming Woodlands North Coast innovation corridor",
    ],
  },
  jurong: {
    name: "Jurong",
    description: "Jurong is transforming from industrial heartland into the Jurong Lake District — Singapore's second CBD. With the Jurong Region Line, lakeside living, major malls (JEM, Westgate, IMM), and the upcoming High-Speed Rail terminus, it's a high-growth area for residents and investors.",
    imageUrl: "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600",
    tags: ["Jurong Lake District", "Second CBD", "JRL", "Malls", "High-Speed Rail"],
    mrtLines: ["East-West Line", "Jurong Region Line (upcoming)"],
    highlights: [
      "Jurong Lake Gardens — 90ha lakeside gardens with boardwalks",
      "JEM / Westgate / IMM — three major malls connected",
      "Jurong Region Line — 24 stations connecting west by 2029",
      "NTU / NUS campuses — education hub",
    ],
  },
  tengah: {
    name: "Tengah",
    description: "Tengah is Singapore's first 'Forest Town' — a blank-slate new town designed around a car-free town centre, 5km forest corridor, smart home infrastructure, and centralized cooling. Early BTO buyers get first-mover advantage in a town built for the future.",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?w=1600",
    tags: ["Forest Town", "Car-free Centre", "Smart Homes", "Centralized Cooling", "New BTO"],
    mrtLines: ["Jurong Region Line (upcoming)"],
    highlights: [
      "Plantation District — first district with community farming",
      "Car-free town centre — pedestrian/cycling only",
      "Centralized cooling — district cooling system (no AC compressors)",
      "Forest corridor — 5km ecological link to nature reserves",
    ],
  },
  punggol: {
    name: "Punggol",
    description: "Punggol is the waterfront town of the northeast — home to Punggol Digital District (Singapore's first enterprise district), Coney Island, extensive cycling paths, and the upcoming Cross Island Line. Young families and tech professionals are drawn to its modern layout and coastal lifestyle.",
    imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1600",
    tags: ["Waterfront", "Digital District", "Cycling", "Coney Island", "CRL"],
    mrtLines: ["North-East Line", "Punggol LRT", "Cross Island Line (upcoming)"],
    highlights: [
      "Punggol Waterway Park — 4.2km riverside park with bridges",
      "Punggol Digital District — JTC's smart business park with SIT campus",
      "Coney Island — rustic 50ha island park, cycling & birdwatching",
      "80km cycling network — most extensive in Singapore",
    ],
  },
  tampines: {
    name: "Tampines",
    description: "Tampines is a mature eastern hub with three MRT lines (EWL, DTL, upcoming CRL), three major malls (Tampines Mall, Century Square, Tampines 1), extensive parks, and established schools. It's a self-contained town where residents rarely need to leave for daily needs.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600",
    tags: ["3 MRT Lines", "Mature Estate", "3 Malls", "Family-friendly", "Schools"],
    mrtLines: ["East-West Line", "Downtown Line", "Cross Island Line (upcoming)"],
    highlights: [
      "Tampines Hub — integrated community & sports complex",
      "Bedok Reservoir — water sports & jogging loops",
      "Three malls within 500m — Tampines Mall, Century Square, Tampines 1",
      "Top schools — Temasek Poly, multiple primary/secondary schools",
    ],
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const data = neighborhoodData[slug];
  
  if (!data) {
    return {
      title: "Neighborhood Not Found | SG Events Hub",
      description: "Explore Singapore's neighborhoods — Woodlands, Jurong, Tengah, Punggol, Tampines and more.",
    };
  }

  return {
    title: `${data.name} Neighborhood Guide | SG Events Hub`,
    description: data.description,
    openGraph: {
      title: `${data.name} Neighborhood Guide | SG Events Hub`,
      description: data.description,
      images: data.imageUrl ? [data.imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(neighborhoodData).map((slug) => ({ slug }));
}

export default async function NeighborhoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = neighborhoodData[slug];

  if (!data) redirect("/neighborhoods");

  // Get articles for this neighborhood
  const articles = await prisma.post.findMany({
    where: {
      neighborhood: data.name,
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { title: true, slug: true, excerpt: true, imageUrl: true, category: true, createdAt: true },
  });

  // Get article counts by category for this neighborhood
  const categoryCounts = await prisma.post.groupBy({
    by: ['category'],
    where: {
      neighborhood: data.name,
      status: 'PUBLISHED',
    },
    _count: { category: true },
  });

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-[#e5e7eb] pb-32`}>
      {/* AMBIENT GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={data.imageUrl}
          className="w-full h-full object-cover blur-[120px] opacity-[0.08] scale-150"
          alt=""
        />
      </div>

      {/* HERO */}
      <div className="relative w-full h-[70vh] min-h-[500px] flex flex-col items-center justify-end overflow-hidden border-b border-white/5">
        <img
          src={data.imageUrl}
          className="absolute inset-0 w-full h-full object-cover"
          alt={data.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-16 text-center">
          <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4`}>
            Neighborhood Hub
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-[7rem] leading-[0.9] text-white font-black tracking-tighter drop-shadow-2xl mb-6 italic`}>
            {data.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              MRT: {data.mrtLines.join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16 relative z-10">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-16">
          {/* OVERVIEW */}
          <section>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-black mb-6 tracking-tighter italic`}>
              Living in {data.name}
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed">
              <p>{data.description}</p>
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <section>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-black mb-6 tracking-tighter italic`}>
              Key Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/30 transition-colors"
                >
                  <p className="text-gray-300 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ARTICLES BY CATEGORY */}
          {categoryCounts.length > 0 && (
            <section>
              <h2 className={`${playfair.className} text-3xl md:text-4xl font-black mb-6 tracking-tighter italic`}>
                Guides by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryCounts.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/guides?category=${cat.category}&neighborhood=${data.name}`}
                    className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">{cat.category}</span>
                      <span className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {cat._count.category} guides →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* LATEST ARTICLES */}
          {articles.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
                  Latest {data.name} Guides
                </h2>
                <Link
                  href={`/guides?neighborhood=${data.name}`}
                  className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition`}
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/guides/${article.slug}`}
                    className="group p-0 bg-[#0a0a0a] rounded-[2rem] border border-white/5 hover:border-cyan-500/40 transition-all overflow-hidden"
                  >
                    {article.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={article.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt=""
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className={`${mono.className} flex items-center gap-2 mb-3`}>
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                        <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">{article.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-cyan-300 transition">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            {/* QUICK FACTS */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem]">
              <h3 className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6`}>
                Quick Facts
              </h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Region</dt>
                  <dd className="text-white font-medium">{data.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">MRT Lines</dt>
                  <dd className="text-white font-medium">{data.mrtLines.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Guides Published</dt>
                  <dd className="text-white font-medium">{articles.length}+</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Categories Covered</dt>
                  <dd className="text-white font-medium">{categoryCounts.length}</dd>
                </div>
              </dl>
            </div>

            {/* NAVIGATION */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem]">
              <h3 className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6`}>
                Explore
              </h3>
              <nav className="space-y-3">
                <Link
                  href={`/guides?neighborhood=${data.name}`}
                  className="block p-4 bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-bold">All {data.name} Guides</p>
                  <p className="text-gray-500 text-sm mt-1">Browse by category</p>
                </Link>
                <Link
                  href="/neighborhoods"
                  className="block p-4 bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-bold">Compare Neighborhoods</p>
                  <p className="text-gray-500 text-sm mt-1">See all neighborhood hubs</p>
                </Link>
                <Link
                  href="/guides"
                  className="block p-4 bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-bold">All Resident Guides</p>
                  <p className="text-gray-500 text-sm mt-1">Housing, Money, Transport & more</p>
                </Link>
              </nav>
            </div>

            {/* NEARBY NEIGHBORHOODS */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem]">
              <h3 className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6`}>
                Nearby Areas
              </h3>
              <ul className="space-y-2">
                {Object.entries(neighborhoodData)
                  .filter(([key]) => key !== slug)
                  .slice(0, 4)
                  .map(([key, hood]) => (
                    <li key={key}>
                      <Link
                        href={`/neighborhoods/${key}`}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-[1.5rem] hover:bg-white/10 transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full group-hover:bg-blue-500 transition-colors" />
                        <span className="text-white font-medium text-sm">{hood.name}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}