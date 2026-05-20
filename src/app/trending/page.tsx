// src/app/trending/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Trending Singapore Planning Guides & News | SG Events Hub",
  description: "Real-time coverage and planning guides for Singapore's latest trending events, attractions, and hot topics.",
  openGraph: {
    title: "Trending Singapore Planning Guides & News | SG Events Hub",
    description: "Real-time coverage and planning guides for Singapore's latest trending events, attractions, and hot topics.",
  }
};

export default async function TrendingPage() {
  console.log("Trending Page Rendering... [VERCEL DEBUG]");
  
  // LẤY TIN TỨC: Linh hoạt hơn để tránh sót bài
  let trendingPosts: any[] = [];
  try {
    trendingPosts = await prisma.post.findMany({
      where: {
        isNewsjack: true,
        status: 'PUBLISHED'
      },
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error("Trending Page DB Error:", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white pt-32 pb-20 selection:bg-red-500/30`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER SECTION */}
        <div className="mb-16 border-b border-white/10 pb-12 text-center md:text-left">
          <p className={`${mono.className} text-red-500 text-xs font-black uppercase tracking-[0.4em] mb-4 animate-pulse flex items-center gap-2`}>
            <span className="w-2 h-2 bg-red-600 rounded-full"></span> Live Coverage
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-9xl font-black uppercase text-white tracking-tighter leading-none`}>
            Trending <span className="text-red-600 italic">News</span>
          </h1>
          <p className="mt-8 text-gray-400 max-w-2xl text-xl leading-relaxed font-medium">
            Real-time analysis of Singapore's hottest topics.
            We explain what it means for your wallet and weekend.
          </p>
        </div>

        {/* LIST POSTS */}
        <div className="grid grid-cols-1 gap-12">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <Link key={post.id} href={`/guides/${post.slug}`} className="group relative block bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-600/50 hover:shadow-[0_0_50px_rgba(220,38,38,0.15)] transition-all duration-500 p-2">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* IMAGE */}
                  <div className="md:w-2/5 h-72 md:h-[400px] relative overflow-hidden rounded-[2rem]">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                    />
                    <div className="absolute inset-0 bg-red-950/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full shadow-xl">
                      Breaking
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-gray-500 text-xs font-black uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                      <span className="text-red-500 text-xs font-black uppercase tracking-widest">{post.category}</span>
                    </div>

                    <h2 className={`${playfair.className} text-3xl md:text-5xl font-bold text-white mb-6 group-hover:text-red-500 transition-colors leading-tight tracking-tight`}>
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-lg line-clamp-3 mb-10 leading-relaxed italic">
                      "{post.excerpt}"
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="flex items-center gap-3">
                        {post.author?.avatarUrl && <img src={post.author.avatarUrl} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt="" />}
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Analysis by</p>
                          <p className="text-sm text-white font-black">{post.author?.name || 'Desmond Ho'}</p>
                        </div>
                      </div>
                      <div className="text-red-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Read Full Report →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-40 bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-600 font-black uppercase tracking-widest text-xl italic">
                Scanning the horizon for trending news...
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}