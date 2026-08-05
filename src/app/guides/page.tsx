// src/app/guides/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

const categories = [
  { value: 'HOUSING', label: 'Housing', icon: '🏠' },
  { value: 'MONEY', label: 'Money', icon: '💰' },
  { value: 'TRANSPORT', label: 'Transport', icon: '🚇' },
  { value: 'STUDY', label: 'Study', icon: '📚' },
  { value: 'FOOD', label: 'Food', icon: '🍜' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: '🏥' },
  { value: 'WORK', label: 'Work', icon: '💼' },
  { value: 'LIFESTYLE', label: 'Lifestyle', icon: '✨' },
  { value: 'NEIGHBORHOOD', label: 'Neighborhood', icon: '🗺️' },
  { value: 'TOOLS', label: 'Tools', icon: '🔧' },
  { value: 'TRAVEL_GUIDE', label: 'Travel Guide', icon: '✈️' },
];

export const metadata: Metadata = {
  title: "Resident Guides | SG Events Hub",
  description: "Singapore resident guides for housing, transport, money, healthcare, food, study, work, and neighborhood life.",
  openGraph: {
    title: "Resident Guides | SG Events Hub",
    description: "Singapore resident guides for housing, transport, money, healthcare, food, study, work, and neighborhood life.",
  }
};

interface GuidesPageProps {
  searchParams: Promise<{ category?: string; neighborhood?: string }>;
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const { category, neighborhood } = await searchParams;
  
  const whereClause: any = { status: 'PUBLISHED' };
  if (category && categories.some(c => c.value === category)) {
    whereClause.category = category as any; // Prisma enum cast
  }
  if (neighborhood) {
    whereClause.neighborhood = neighborhood;
  }

  const [posts, categoryCounts] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true },
    }),
  ]);

  const selectedCategory = categories.find(c => c.value === category);
  const categoryCountsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-16">
          <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Intelligence
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Resident Guides
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Practical guides for living in Singapore — housing costs, MRT routes, school choices, hawker finds, clinic reviews, and neighborhood deep-dives.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-4">
            <Link
              href="/guides"
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                !category
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/guides?category=${cat.value}`}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  category === cat.value
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {categoryCountsMap.get(cat.value as any) && (
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
                    {categoryCountsMap.get(cat.value as any)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2`}>
              {posts.length} Guide{posts.length !== 1 ? 's' : ''} Found
            </p>
            {selectedCategory && (
              <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
                {selectedCategory.label}
              </h2>
            )}
            {neighborhood && !selectedCategory && (
              <h2 className={`${playfair.className} text-3xl md:text-4xl font-black tracking-tighter italic`}>
                {neighborhood} Guides
              </h2>
            )}
          </div>
          {category && (
            <Link
              href="/guides"
              className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition flex items-center gap-1`}
            >
              Clear Filter →
            </Link>
          )}
        </div>

        {/* GUIDES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/guides/${post.slug}`}
              className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={post.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-blue-600 text-white rounded-full">
                    {post.category}
                  </span>
                  {post.neighborhood && (
                    <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-600/80 text-white rounded-full">
                      {post.neighborhood}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8 -mt-10 relative z-10 flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm italic mb-8 line-clamp-3 flex-1">
                  {post.excerpt || post.content.slice(0, 200).replace(/<[^>]*>/g, '')}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.author?.avatarUrl && (
                      <img
                        src={post.author.avatarUrl}
                        className="w-7 h-7 rounded-full border border-white/10"
                        alt={post.author.name}
                      />
                    )}
                    <span className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-widest`}>
                      {post.author?.name || 'Editor'}
                    </span>
                  </div>
                  <span className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-widest`}>
                    Read Guide →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xl mb-4">
              No guides found
            </p>
            <p className="text-gray-600 max-w-md mx-auto">
              {category 
                ? `No guides in "${selectedCategory?.label}" yet. Check back soon!` 
                : 'No guides match your filters. Try adjusting your selection.'}
            </p>
            <Link
              href="/guides"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-xs text-white transition-all hover:border-blue-500 hover:text-blue-400"
            >
              Browse All Guides →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
