// src/app/trending/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic';

export default async function TrendingPage() {
  // Fetch tất cả bài viết Newsjack có status: 'PUBLISHED' và isNewsjack: true
  const trendingPosts = await prisma.post.findMany({
    where: { 
      status: 'PUBLISHED',
      category: 'Trending News'  
      isNewsjack: true 
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  }) || [];

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-red-500/30 overflow-x-hidden`}>
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden border-b border-red-500/30">
        <div className="absolute inset-0">
          {/* Background Image with Red/Orange Theme */}
          <img 
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 scale-110" 
            alt="Trending News Background" 
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-transparent to-orange-900/40"></div>
          
          {/* Animated Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className={`${mono.className} mb-6 text-red-400 text-[10px] font-black tracking-[0.6em] uppercase animate-pulse`}>// REAL-TIME NEWS ANALYSIS</div>
          <h1 className={`${playfair.className} text-5xl md:text-[8rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-8`}>
            Trending <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Newsjack</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-12">
            Breaking news, viral trends, and real-time analysis of Singapore's hottest topics.
            Stay ahead with our expert newsjacking coverage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/guides" 
              className="bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all"
            >
              View All Guides
            </Link>
            <Link 
              href="#news-grid" 
              className="bg-red-600/30 border border-red-500/50 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all"
            >
              Explore Trending
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <div id="news-grid" className="max-w-7xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className={`${mono.className} text-red-400 text-xs font-black uppercase tracking-widest`}>Singapore Newsjack</p>
            </div>
            <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-tight`}>
              TRENDING NEWS
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl">
              Real-time analysis of breaking news and viral trends in Singapore. 
              Our experts provide instant insights on the stories that matter.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Latest Update</p>
              <p className="text-white font-mono text-sm">
                {new Date().toLocaleDateString('en-SG', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">🔥</span>
            </div>
          </div>
        </div>

        {/* NEWSJACK POSTS GRID */}
        {trendingPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trendingPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/guides/${post.slug}`}
                className="group bg-gradient-to-br from-[#1a0a0a] to-[#0a0a0a] border border-red-500/20 rounded-[2.5rem] overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10"
              >
                {/* IMAGE CONTAINER */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600&q=80"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={post.title} 
                  />
                  
                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0a] via-transparent to-transparent opacity-80"></div>
                  
                  {/* HOT BADGE */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                      HOT NEWS
                    </span>
                  </div>
                  
                  {/* AUTHOR BADGE */}
                  {post.author && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <img 
                        src={post.author.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} 
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full border-2 border-red-500/50"
                      />
                      <div className="text-left">
                        <p className="text-[10px] text-gray-300 uppercase tracking-widest">By</p>
                        <p className="text-white text-sm font-bold">{post.author.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* CONTENT CONTAINER */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-[10px] font-black uppercase tracking-widest">
                      {post.category || 'Breaking News'}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                      {new Date(post.createdAt).toLocaleDateString('en-SG', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-white group-hover:text-red-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt || "Breaking news analysis from Singapore's leading experts."}
                  </p>
                  
                  {/* READ MORE BUTTON */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-red-400 text-xs font-black uppercase tracking-widest group-hover:text-red-300 transition">
                      Read Full Analysis
                    </span>
                    <svg className="w-5 h-5 text-red-500 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE - "No Trending News Yet" */
          <div className="text-center py-32 border border-red-500/20 rounded-[3rem] bg-gradient-to-br from-[#1a0a0a] to-transparent">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-900/30 to-orange-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Trending News Yet</h3>
              <p className="text-gray-400 mb-8">
                Check back later for breaking news and real-time analysis. 
                Our team is constantly monitoring Singapore's trending topics.
              </p>
              <Link 
                href="/guides" 
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
              >
                Explore Regular Guides
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* CTA SECTION */}
        <div className="mt-32 p-12 md:p-20 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20 rounded-[4rem] text-center relative overflow-hidden border border-red-500/30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <h3 className={`${playfair.className} text-4xl md:text-6xl font-black mb-8 text-white uppercase leading-tight`}>
              Want Real-Time <br/> News Alerts?
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12">
              Get instant notifications when we publish breaking news analysis. 
              Be the first to know about Singapore's trending stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://t.me/sgeventshub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.24-.02-.1.02-1.74 1.11-4.92 3.26-.47.33-.9.49-1.29.48-.43-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.78.03-.24.37-.48 1-.73z"/>
                </svg>
                Join Telegram Channel
              </a>
              <Link 
                href="/contact" 
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-black transition-all"
              >
                Contact Our News Desk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}