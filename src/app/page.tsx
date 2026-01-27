// src/app/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import IconsCarousel from "@/components/IconsCarousel";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '800'] });

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function HomePage() {
  let limitedEvents: any[] = [];
  let evergreenAttractions: any[] = [];
  let latestGuides: any[] = [];

  try {
    // 1. HEADLINERS (Sự kiện ngắn hạn)
    limitedEvents = await prisma.event.findMany({
      where: { status: 'PUBLISHED', category: 'Event' },
      take: 6,
      orderBy: { startDate: 'asc' }
    });

    // 2. ICONS (Địa điểm Evergreen)
    evergreenAttractions = await prisma.event.findMany({
      where: { status: 'PUBLISHED', category: 'Attraction' },
      take: 10,
      orderBy: { hotnessScore: 'desc' }
    });

    // 3. GUIDES (Bài viết chuyên sâu)
    latestGuides = await prisma.post.findMany({
      where: { 
        status: 'PUBLISHED',
        category: { not: 'Trending News' } 
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database Error:", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1543314223-999335f60647?q=80&w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 scale-105" 
            alt="Singapore Merlion"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className={`${mono.className} mb-8 text-blue-400 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse`}>
             // Redefining Singapore Exploration
          </div>
          
          <h1 className={`${playfair.className} text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-12`}>
            Singapore <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Unlocked</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/events" className="bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Explore Events
            </Link>
            <Link href="/attractions" className="bg-[#111] text-white border border-white/20 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Top Attractions
            </Link>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING HEADLINERS (Dòng tin Newsjack đỏ đã bị loại bỏ ở đây) */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className={`${mono.className} text-blue-500 text-xs font-black uppercase tracking-widest mb-4`}>Don't Miss Out</p>
            <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase text-white tracking-tighter`}>Upcoming Headliners</h2>
          </div>
          <Link href="/events" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-all border-b border-gray-600 pb-1">
            View Calendar →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {limitedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500">
               <div className="h-80 overflow-hidden relative">
                  <img src={event.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-lg">
                    <p>{event.startDate ? event.startDate.getDate() : 'TBA'}</p>
                    <p className="text-[8px]">{event.startDate ? event.startDate.toLocaleString('en-US', { month: 'short' }) : ''}</p>
                  </div>
               </div>
               <div className="p-8 -mt-20 relative z-10">
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-white group-hover:text-blue-300 transition-colors leading-tight">{event.name}</h3>
                  <p className={`${mono.className} text-xs text-gray-500 uppercase tracking-widest`}>{event.venue || 'Singapore'}</p>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SINGAPORE ICONS (Slider) */}
      <section className="py-32 bg-[#050505]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                  <p className={`${mono.className} text-purple-500 text-xs font-black uppercase tracking-widest mb-4`}>The Bucket List</p>
                  <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase text-white tracking-tighter`}>Singapore Icons</h2>
               </div>
               <Link href="/attractions" className="bg-white/10 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">View All Icons →</Link>
            </div>
            <IconsCarousel events={evergreenAttractions} />
         </div>
      </section>

      {/* 4. INSIDER GUIDES */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className={`${mono.className} text-green-500 text-xs font-black uppercase tracking-widest mb-4`}>Expert Analysis</p>
            <h2 className={`${playfair.className} text-5xl md:text-6xl font-black uppercase text-white tracking-tighter`}>Insider Guides</h2>
          </div>
          <Link href="/guides" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-all border-b border-gray-600 pb-1">Read All Guides →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {latestGuides.map((post) => (
            <Link key={post.id} href={`/guides/${post.slug}`} className="group bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-green-500/50 transition-all duration-500">
               <div className="h-64 overflow-hidden relative">
                  <img src={post.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80" />
               </div>
               <div className="p-8">
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 text-white group-hover:text-green-400 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">"{post.excerpt}"</p>
               </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}