// src/app/trending/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic';

export default async function TrendingPage() {
  // Lấy các bài viết Trending News mới nhất
  const trendingPosts = await prisma.post.findMany({
    where: { 
      status: 'PUBLISHED',
      category: 'Trending News'  
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  }) || [];

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-red-500/30 overflow-x-hidden`}>
      
      {/* HERO SECTION - RED THEME FOR URGENCY */}
      <section className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden border-b border-red-500/20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1495020686659-d4b86b726b13?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20 scale-105 saturate-0" 
            alt="Breaking News Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-orange-900/30 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className={`${mono.className} mb-8 text-red-500 text-[10px] font-black tracking-[0.6em] uppercase flex items-center justify-center gap-3`}>
             <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
             // LIVE NEWSJACK FEED
          </div>
          
          <h1 className={`${playfair.className} text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-10`}>
            Trending <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Newsjack</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 font-medium leading-relaxed">
            Real-time analysis of Singapore's hottest topics. We don't just report the news; we tell you what it means for your wallet and weekend.
          </p>
        </div>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* HEADER BAR */}
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
           <h2 className={`${mono.className} text-sm font-bold text-gray-500 uppercase tracking-widest`}>Latest Reports</h2>
           <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> Live Updates
           </div>
        </div>

        {/* POSTS LIST */}
        {trendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {trendingPosts.map((post) => (
              <Link key={post.id} href={`/guides/${post.slug}`} className="group block">
                {/* IMAGE CARD */}
                <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-white/10 mb-6 group-hover:border-red-500/50 transition-all duration-500">
                   <img 
                     src={post.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"} 
                     alt={post.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                   />
                   <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">Breaking</span>
                   </div>
                </div>

                {/* CONTENT */}
                <div>
                   <div className="flex items-center gap-3 mb-3">
                      <p className={`${mono.className} text-[10px] text-red-400 uppercase tracking-widest`}>{new Date(post.createdAt).toLocaleDateString('en-SG')}</p>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">By {post.author?.name || 'Editor'}</p>
                   </div>
                   <h3 className={`${playfair.className} text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-red-500 transition-colors`}>
                     {post.title}
                   </h3>
                   <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
                     "{post.excerpt}"
                   </p>
                   <span className="text-xs font-black uppercase tracking-widest text-white border-b border-red-500 pb-1 group-hover:text-red-500 transition-colors">Read Analysis →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-red-500/20 rounded-[3rem] bg-red-900/5">
             <p className={`${mono.className} text-red-500 text-lg uppercase tracking-widest mb-4`}>Newsroom Quiet</p>
             <p className="text-gray-400 max-w-md mx-auto">Our editors are currently investigating the next big story. Check back in a few hours.</p>
          </div>
        )}
      </div>

      {/* CTA FOOTER */}
      <section className="py-24 border-t border-white/10 bg-gradient-to-b from-black to-[#0f0505]">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`${playfair.className} text-4xl md:text-5xl font-black text-white mb-8`}>Don't Read The News. <br/><span className="text-red-600 italic">Read The Truth.</span></h2>
            <p className="text-gray-400 mb-12 text-lg">We filter out the PR noise to bring you the raw, verified facts about what's happening in Singapore.</p>
            <Link href="/events" className="inline-block bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl">
               Browse All Events
            </Link>
         </div>
      </section>

    </main>
  );
}