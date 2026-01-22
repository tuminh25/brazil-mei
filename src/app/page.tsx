// src/app/page.tsx (BẢN FULL HOÀN CHỈNH)
import Link from "next/link";
import prisma from "@/lib/prisma";
import IconsCarousel from "@/components/IconsCarousel";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. LẤY DỮ LIỆU CẦN THIẾT
  const limitedEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED', category: 'Event' },
    take: 3,
    orderBy: { startDate: 'asc' }
  });

  const evergreenAttractions = await prisma.event.findMany({
    where: { status: 'PUBLISHED', category: 'Attraction' },
    take: 10,
    orderBy: { hotnessScore: 'desc' }
  });

  const latestGuides = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>
      
      {/* 1. HERO SECTION (MERLION KHỔNG LỒ) */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1543314223-999335f0d647?q=80&w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 scale-105" 
            alt="Singapore Merlion"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className={`${mono.className} mb-8 text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase animate-pulse`}>
             // Redefining Singapore Exploration
          </div>
          <h1 className={`${playfair.className} text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-12`}>
            Singapore <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Unlocked</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/events" className="bg-white text-black px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">Explore Events</Link>
            <Link href="/guides" className="bg-[#111] text-white border border-white/20 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">Insider Guides</Link>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING HEADLINERS (EVENTS) */}
      {limitedEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/5">
          <div className="flex justify-between items-end mb-16 gap-6">
            <h2 className={`${playfair.className} text-5xl md:text-6xl font-black uppercase text-white tracking-tighter`}>Upcoming Headliners</h2>
            <Link href="/events" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-all border-b border-gray-600 pb-1">View Calendar →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {limitedEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all">
                 <div className="h-72 overflow-hidden relative"><img src={event.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div>
                 <div className="p-8"> <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 leading-tight">{event.name}</h3> </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. SINGAPORE ICONS (ATTRACTIONS - SLIDER) */}
      {evergreenAttractions.length > 0 && (
        <section className="py-32 bg-[#050505] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className={`${playfair.className} text-5xl md:text-7xl font-black uppercase text-white mb-16`}>Singapore Icons</h2>
              <IconsCarousel events={evergreenAttractions} />
          </div>
        </section>
      )}

      {/* 4. INSIDER GUIDES (BẮT BUỘC HIỆN KHI CÓ BÀI TRONG BẢNG POST) */}
      {latestGuides.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex justify-between items-end mb-16">
            <h2 className={`${playfair.className} text-5xl md:text-6xl font-black uppercase text-white`}>Insider Guides</h2>
            <Link href="/guides" className="text-green-500 text-xs font-bold uppercase tracking-widest border-b border-green-500 pb-1 hover:text-white hover:border-white transition-all">Read All Guides →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestGuides.map((post) => (
              <Link key={post.id} href={`/guides/${post.slug}`} className="group bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-green-500/50 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                    <img src={post.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80" />
                </div>
                <div className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors leading-tight">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. TRUST BANNER */}
      <section className="py-24 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="p-8 border-l border-white/10"><h3 className="text-white font-bold text-xl mb-2 uppercase tracking-tight">Curated by Locals</h3></div>
            <div className="p-8 border-l border-white/10"><h3 className="text-white font-bold text-xl mb-2 uppercase tracking-tight">Real-Time Intel</h3></div>
            <div className="p-8 border-l border-white/10"><h3 className="text-white font-bold text-xl mb-2 uppercase tracking-tight">Direct Deals</h3></div>
         </div>
      </section>
    </main>
  );
}