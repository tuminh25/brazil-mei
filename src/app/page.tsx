import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const revalidate = 3600;

export default async function HomePage() {

  // 1. SINGAPORE ESSENTIALS: Evergreen Posts
  let essentials: any[] = [];
  try {
    essentials = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        category: 'Evergreen',
        isNewsjack: false
      },
      take: 9,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error("HomePage DB Error (essentials):", error);
  }

  // 2. LATEST UPDATES: News posts or newsjacked content
  let latestUpdates: any[] = [];
  try {
    latestUpdates = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [{ category: 'News' }, { isNewsjack: true }]
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error("HomePage DB Error (latestUpdates):", error);
  }

  const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1525625239513-39bc131f9979?q=80&w=1600&auto=format&fit=crop";

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?q=80&w=2000"
            alt="Singapore Skyline Night"
            fill
            priority
            className="object-cover opacity-40 scale-105"
          />
        </div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black -z-10" />

        {/* AMBIENT GLOW */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[140px] -z-10 mix-blend-screen animate-pulse' />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* EYEBROW */}
          <p className={`${mono.className} text-blue-400 text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Singapore's Premier Insider Guide
          </p>

          <h1 className={`${playfair.className} text-6xl md:text-[9.5rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-8`}>
            Singapore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Unlocked
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            15 masterpiece guides to Singapore's greatest attractions — crafted by insiders who live here.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/guides"
              className="bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Read All Guides
            </Link>
            <Link
              href="/trending"
              className="bg-transparent text-white border border-white/20 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              What's Trending
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SINGAPORE ESSENTIALS — EVERGREEN GRID */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <p className={`${mono.className} text-cyan-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
              Evergreen Attractions
            </p>
            <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>
              Singapore<br />Essentials
            </h2>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className={`${mono.className} flex items-center gap-2 text-[10px] text-cyan-400 font-black uppercase tracking-widest`}>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Verified Insider Content
            </div>
            <Link
              href="/guides"
              className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-400 transition-all border-b border-gray-800 pb-1"
            >
              View All Guides →
            </Link>
          </div>
        </div>

        {/* ESSENTIALS GRID */}
        {essentials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
              {essentials.map((post) => (
                <Link
                  key={post.id}
                  href={`/guides/${post.slug}`}
                  className="group relative bg-[#0a0a0a] border border-white/8 rounded-[2rem] overflow-hidden hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(6,182,212,0.12)] flex flex-col h-full"
                >
                  {/* IMAGE */}
                  <div className="overflow-hidden relative h-72">
                    <img
                      src={post.imageUrl || IMAGE_FALLBACK}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                    />
                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

                    {/* VERIFIED INSIDER BADGE */}
                    <div className={`${mono.className} absolute top-5 left-5 flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/30`}>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em]">Verified Insider</span>
                    </div>

                    {/* CATEGORY TAG */}
                    <div className={`${mono.className} absolute top-5 right-5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10`}>
                      <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Evergreen</span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="font-black mb-3 text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-tight text-xl">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        {post.author?.avatarUrl && (
                          <img
                            src={post.author.avatarUrl}
                            className="w-7 h-7 rounded-full border border-white/10"
                            alt={post.author.name}
                          />
                        )}
                        <span className={`${mono.className} text-[9px] text-gray-600 font-black uppercase tracking-widest`}>
                          {post.author?.name || 'SG Insider'}
                        </span>
                      </div>
                      <span className={`${mono.className} text-cyan-500 text-[9px] font-black uppercase tracking-widest group-hover:text-cyan-300 transition-colors`}>
                        Read Guide →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* EXPLORE ALL BUTTON */}
            <div className="flex justify-center">
              <Link
                href="/guides"
                className={`${mono.className} group relative px-16 py-6 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-xs text-white transition-all hover:border-cyan-500 hover:text-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden`}
              >
                <span className="relative z-10 italic">Explore All Guides →</span>
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-32 text-gray-600">
            <p className={`${mono.className} text-xs uppercase tracking-widest`}>Content loading — check back soon.</p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* LATEST UPDATES */}
      {/* ═══════════════════════════════════════════════ */}
      {latestUpdates.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            {/* SECTION HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <p className={`${mono.className} text-orange-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
                  Breaking &amp; New
                </p>
                <h2 className={`${playfair.className} text-4xl md:text-5xl font-black uppercase text-white tracking-tighter italic`}>
                  Latest Updates
                </h2>
              </div>
              <Link
                href="/trending"
                className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-orange-400 transition-all border-b border-gray-800 pb-1"
              >
                All Updates →
              </Link>
            </div>

            {/* UPDATES ROW */}
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
      {/* TRUST BANNER */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 border border-white/8 rounded-[3.5rem] overflow-hidden">
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <div className="text-3xl mb-6">✦</div>
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">100% Insider</h3>
            <p className="text-gray-500 leading-relaxed">Verified by Singapore residents with 20+ years of local knowledge.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <div className="text-3xl mb-6">◈</div>
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Evergreen Quality</h3>
            <p className="text-gray-500 leading-relaxed">15–20 masterpiece articles, not 100 mediocre posts. Quality over quantity.</p>
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