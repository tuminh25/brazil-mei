import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const revalidate = 3600;

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1525625239513-39bc131f9979?q=80&w=1600&auto=format&fit=crop";

const topicCategories = [
  { value: 'HOUSING', label: 'Housing', icon: '🏠', href: '/guides?category=HOUSING' },
  { value: 'TRANSPORT', label: 'Transport', icon: '🚇', href: '/guides?category=TRANSPORT' },
  { value: 'MONEY', label: 'Money', icon: '💰', href: '/guides?category=MONEY' },
  { value: 'FOOD', label: 'Food', icon: '🍜', href: '/guides?category=FOOD' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: '🏥', href: '/guides?category=HEALTHCARE' },
  { value: 'STUDY', label: 'Study', icon: '📚', href: '/guides?category=STUDY' },
  { value: 'LIFESTYLE', label: 'Lifestyle', icon: '✨', href: '/guides?category=LIFESTYLE' },
  { value: 'WORK', label: 'Work', icon: '💼', href: '/guides?category=WORK' },
];

const neighborhoodData = [
  { slug: 'woodlands', name: 'Woodlands', tag: 'North', color: 'blue' },
  { slug: 'tengah', name: 'Tengah', tag: 'West', color: 'green' },
  { slug: 'jurong', name: 'Jurong', tag: 'West', color: 'orange' },
  { slug: 'punggol', name: 'Punggol', tag: 'North-East', color: 'cyan' },
  { slug: 'tampines', name: 'Tampines', tag: 'East', color: 'purple' },
];

const tools = [
  { name: 'HDB Affordability Calculator', category: 'Housing', icon: '🏠', status: 'Coming Soon' },
  { name: 'CPF Retirement Planner', category: 'Money', icon: '💰', status: 'Coming Soon' },
  { name: 'Transport Cost Calculator', category: 'Transport', icon: '🚇', status: 'Coming Soon' },
  { name: 'School Distance Checker', category: 'Study', icon: '📚', status: 'Coming Soon' },
  { name: 'Hawker Price Tracker', category: 'Food', icon: '🍜', status: 'Coming Soon' },
  { name: 'Clinic & Hospital Finder', category: 'Healthcare', icon: '🏥', status: 'Coming Soon' },
  { name: 'Salary Benchmark Tool', category: 'Work', icon: '💼', status: 'Coming Soon' },
  { name: 'Neighborhood Comparison', category: 'Neighborhood', icon: '🗺️', status: 'Coming Soon' },
];

export default async function HomePage() {
  // 1. TODAY'S SINGAPORE: 8 newest resident articles (non-travel, non-newsjack)
  let todaysSingapore: any[] = [];
  try {
    todaysSingapore = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' as any },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (todaysSingapore):", error);
  }

  // 2. NEIGHBORHOODS: with article counts
  let neighborhoodsWithCounts: any[] = [];
  try {
    neighborhoodsWithCounts = await Promise.all(
      neighborhoodData.map(async (n) => {
        const count = await prisma.post.count({
          where: { neighborhood: n.name, status: 'PUBLISHED' },
        });
        return { ...n, articleCount: count };
      })
    );
  } catch (error) {
    console.error("HomePage DB Error (neighborhoods):", error);
    neighborhoodsWithCounts = neighborhoodData.map(n => ({ ...n, articleCount: 0 }));
  }

  // 3. TOPIC CATEGORIES: with article counts
  let topicsWithCounts: any[] = [];
  try {
    const categoryCounts = await prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED', category: { not: 'TRAVEL_GUIDE' as any } },
      _count: { category: true },
    });
    const countsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: countsMap.get(t.value as any) || 0 }));
  } catch (error) {
    console.error("HomePage DB Error (topics):", error);
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: 0 }));
  }

  // 4. FEATURED GUIDES: High-quality evergreen (non-newsjack, non-travel, with insider data)
  let featuredGuides: any[] = [];
  try {
    featuredGuides = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' },
        OR: [
          { insiderPrice: { not: null } },
          { bestTime: { not: null } },
          { secretTip: { not: null } },
        ],
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (featured):", error);
  }

  // 5. LATEST UPDATES: Newsjacked or travel guides only (3 items)
  let latestUpdates: any[] = [];
  try {
    latestUpdates = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { isNewsjack: true },
          { category: 'TRAVEL_GUIDE' },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (latestUpdates):", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?q=80&w=2000"
            alt="Singapore Skyline Night"
            fill
            priority
            className="object-cover opacity-40 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black -z-10" />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[140px] -z-10 mix-blend-screen animate-pulse' />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <p className={`${mono.className} text-blue-400 text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Singapore Resident Intelligence
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-[9.5rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-8`}>
            Singapore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Unlocked
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Practical guides for living in Singapore — housing, transport, money, food, healthcare, and neighborhood intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/guides"
              className="bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Browse All Guides
            </Link>
            <Link
              href="/neighborhoods"
              className="bg-transparent text-white border border-white/20 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Explore Neighborhoods
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TODAY'S SINGAPORE — 8 NEWEST RESIDENT ARTICLES */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
              Updated Today
            </p>
            <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
              Today's<br />Singapore
            </h2>
          </div>
          <Link
            href="/latest"
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-all border-b border-gray-800 pb-1"
          >
            View All Latest →
          </Link>
        </div>

        {todaysSingapore.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {todaysSingapore.map((post, i) => (
              <Link
                key={post.id}
                href={`/guides/${post.slug}`}
                className={`group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className={`overflow-hidden relative ${i === 0 ? 'h-[400px]' : 'h-64'}`}>
                  <img
                    src={post.imageUrl || IMAGE_FALLBACK}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={post.title}
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
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className={`font-black mb-3 text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight ${i === 0 ? 'text-3xl' : 'text-xl'}`}>
                    {post.title}
                  </h3>
                  {post.excerpt && post.excerpt.trim() !== "" && (
                    <p className={`text-gray-500 text-sm leading-relaxed mb-6 flex-1 ${i === 0 ? 'line-clamp-3' : 'line-clamp-2'}`}>
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.author?.avatarUrl && (
                        <img src={post.author.avatarUrl} className="w-6 h-6 rounded-full border border-white/10" alt={post.author.name} />
                      )}
                      <span className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-widest`}>
                        {post.author?.name || 'Editor'}
                      </span>
                    </div>
                    <span className={`${mono.className} text-blue-500 text-[9px] font-black uppercase tracking-widest`}>
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xl mb-4">No resident guides yet</p>
            <p className="text-gray-600 max-w-md mx-auto">Publish your first guide to see it here.</p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* NEIGHBORHOODS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                Where You Live
              </p>
              <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                Neighborhoods
              </h2>
            </div>
            <Link
              href="/neighborhoods"
              className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-all border-b border-gray-800 pb-1"
            >
              All Neighborhoods →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {neighborhoodsWithCounts.map((hood) => (
              <Link
                key={hood.slug}
                href={`/neighborhoods/${hood.slug}`}
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-2 h-2 rounded-full bg-${hood.color}-500`} />
                  <span className={`${mono.className} text-${hood.color}-400 text-[9px] font-black uppercase tracking-widest`}>
                    {hood.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">
                  {hood.name}
                </h3>
                <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2`}>
                  {hood.articleCount} Guides
                </p>
                <span className={`${mono.className} text-gray-500 text-[9px] uppercase tracking-widest`}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* BROWSE BY TOPIC */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            What You Need
          </p>
          <h2 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Browse by Topic
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Every guide is categorized so you can find exactly what matters to your daily life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topicsWithCounts.map((topic) => (
            <Link
              key={topic.value}
              href={topic.href}
              className="group p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 text-center"
            >
              <span className="text-4xl block mb-4">{topic.icon}</span>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {topic.label}
              </h3>
              <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]`}>
                {topic.count} Guides
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURED GUIDES — HIGH QUALITY EVERGREEN */}
      {/* ═══════════════════════════════════════════════ */}
      {featuredGuides.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <p className={`${mono.className} text-cyan-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                  Planning Intelligence
                </p>
                <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                  Featured<br />Guides
                </h2>
              </div>
              <Link
                href="/guides"
                className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-400 transition-all border-b border-gray-800 pb-1"
              >
                All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGuides.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.imageUrl || IMAGE_FALLBACK}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-cyan-600 text-white rounded-full">
                        {post.category}
                      </span>
                      {post.neighborhood && (
                        <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-600/80 text-white rounded-full">
                          {post.neighborhood}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className={`${mono.className} flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/30 inline-flex`}>
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em]">Planning Report</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-widest`}>
                        {post.author?.name || 'Editor'}
                      </span>
                      <span className={`${mono.className} text-cyan-500 text-[9px] font-black uppercase tracking-widest`}>
                        Read Report →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* USEFUL TOOLS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Utilities
          </p>
          <h2 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Tools & Calculators
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Practical calculators for the decisions that matter — housing affordability, CPF planning, transport costs, school choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl mt-1">{tool.icon}</span>
                <div>
                  <span className={`${mono.className} text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1 block`}>
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className={`${mono.className} text-[9px] font-bold uppercase tracking-widest text-gray-500`}>
                  {tool.status}
                </span>
                <span className={`${mono.className} text-blue-500 text-[9px] font-black uppercase tracking-widest`}>
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-xs text-white transition-all hover:border-blue-500 hover:text-blue-400"
          >
            View All Tools →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* LATEST UPDATES — NEWS ONLY */}
      {/* ═══════════════════════════════════════════════ */}
      {latestUpdates.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <p className={`${mono.className} text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                  Breaking & New
                </p>
                <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
                  Latest<br />Updates
                </h2>
              </div>
              <Link
                href="/latest"
                className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-orange-400 transition-all border-b border-gray-800 pb-1"
              >
                All Updates →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestUpdates.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="group flex gap-5 p-6 bg-[#0d0d0d] border border-white/5 rounded-[1.5rem] hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-[1rem] overflow-hidden flex-shrink-0 bg-white/5 relative">
                    <img
                      src={post.imageUrl || IMAGE_FALLBACK}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`${mono.className} flex items-center gap-2 mb-2`}>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      <span className="text-orange-400 text-[8px] font-black uppercase tracking-widest">New</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-orange-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className={`${mono.className} text-gray-600 text-[9px] mt-2 uppercase tracking-widest`}>
                      {new Date(post.createdAt).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* NEWSLETTER CTA */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center">
            <p className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4`}>
              Stay Informed
            </p>
            <h2 className={`${playfair.className} text-4xl md:text-6xl font-black mb-6 tracking-tighter italic`}>
              Get Singapore Intelligence in Your Inbox
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Weekly digest of new guides, policy changes, and neighborhood insights. No spam. Unsubscribe anytime.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-black border border-white/10 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className={`${mono.className} text-[10px] text-gray-600 mt-6 uppercase tracking-[0.3em]`}>
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TRUST BANNER */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 border border-white/8 rounded-[3.5rem] overflow-hidden">
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <div className="text-3xl mb-6">✦</div>
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Research-Driven Guides</h3>
            <p className="text-gray-500 leading-relaxed">Built from extensive source research and regular updates.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <div className="text-3xl mb-6">◈</div>
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Resident-First</h3>
            <p className="text-gray-500 leading-relaxed">Built for people living in Singapore, not tourists passing through.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <div className="text-3xl mb-6">⬡</div>
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Partner Rates</h3>
            <p className="text-gray-500 leading-relaxed">Integrated with Trip.com and Klook for the best booking rates available.</p>
          </div>
        </div>
      </section>

    </main>
  );
}