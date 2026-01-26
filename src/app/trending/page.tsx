// src/app/trending/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

export default async function TrendingPage() {
  const trendingPosts = await prisma.post.findMany({
    where: { 
      status: 'PUBLISHED', 
      isNewsjack: true 
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER SECTION - ĐÃ SỬA TÊN */}
        <div className="mb-16 border-b border-white/10 pb-8 text-center md:text-left">
          <p className={`${mono.className} text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-4 animate-pulse`}>
            Live Coverage
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-9xl font-black uppercase text-white tracking-tighter`}>
            Trending <br className="md:hidden" /> <span className="text-red-600">News</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl text-lg">
            Real-time analysis of Singapore's hottest topics. 
            We explain what it means for your wallet and weekend.
          </p>
        </div>

        {/* LIST POSTS */}
        <div className="grid grid-cols-1 gap-8">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <Link key={post.id} href={`/guides/${post.slug}`} className="group relative block bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden hover:border-red-500/50 transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                    <img src={post.imageUrl || ''} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded">Breaking</span>
                      <span className="text-gray-500 text-xs font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">{post.title}</h2>
                    <p className="text-gray-400 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5">
                       {post.author?.avatarUrl && <img src={post.author.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" alt=""/>}
                       <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Analysis by</p>
                          <p className="text-xs text-white font-bold">{post.author?.name || 'Editorial Team'}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No trending news at the moment. Check back later.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}