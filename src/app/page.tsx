import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import IconsCarousel from "@/components/IconsCarousel";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. HEADLINERS: Sự kiện ngắn hạn (Events)
  const limitedEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED', category: 'Event' },
    take: 3,
    orderBy: { startDate: 'asc' }
  }) || [];

  // 2. ICONS: Địa điểm Evergreen
  const evergreenAttractions = await prisma.event.findMany({
    where: { status: 'PUBLISHED', category: 'Attraction' },
    take: 10,
    orderBy: { hotnessScore: 'desc' }
  }) || [];

  // 3. INSIDER GUIDES: CHỈ LẤY ĐÚNG 3 BÀI "Expert Guide" (Music, Itinerary, Oceanarium)
  const expertGuides = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      category: 'Expert Guide' // <--- Lọc chính xác ở đây
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  }) || [];

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden`}>

      {/* HERO SECTION - CYBER NOIR UPGRADE */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        {/* BACKGROUND IMAGE LAYER */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?q=80&w=2000"
            alt="Singapore Skyline Night"
            fill
            priority
            className="object-cover opacity-40 scale-105"
          />
        </div>

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black -z-10"></div>

        {/* AMBIENT NEON GLOW ORB */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse' />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className={`${playfair.className} text-6xl md:text-[9.5rem] font-black leading-[0.85] tracking-tighter uppercase text-white drop-shadow-2xl mb-12`}>
            Singapore <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              Unlocked
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/events" className="bg-white text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Explore Events</Link>
            <Link href="/attractions" className="bg-[#111] text-white border border-white/20 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">Top Attractions</Link>
          </div>
        </div>
      </section>

      {/* TẦNG 1: HEADLINERS */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <p className={`${mono.className} text-blue-500 text-xs font-black uppercase tracking-widest mb-4`}>Limited Time Only</p>
            <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>Headliners</h2>
          </div>
          <Link href="/events" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-all border-b border-gray-800 pb-1">Full Calendar →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {limitedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500">
              <div className="h-80 overflow-hidden relative">
                <img src={event.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
              </div>
              <div className="p-8 -mt-20 relative z-10">
                <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-white group-hover:text-blue-300 transition-colors tracking-tight">{event.name}</h3>
                <p className={`${mono.className} text-[10px] text-gray-500 uppercase tracking-widest`}>{event.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TẦNG 2: SINGAPORE ICONS (Carousel) */}
      <section className="py-32 bg-[#050505] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <p className={`${mono.className} text-purple-500 text-xs font-black uppercase tracking-widest mb-4`}>The Bucket List</p>
              <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>Icons</h2>
            </div>
            <Link href="/attractions" className="bg-white/10 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">View All Attractions →</Link>
          </div>
          <IconsCarousel events={evergreenAttractions} />
        </div>
      </section>

      {/* TẦNG 3: INSIDER GUIDES (CHỈ HIỆN 3 BÀI CHUYÊN SÂU) */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <p className={`${mono.className} text-green-500 text-xs font-black uppercase tracking-widest mb-4`}>Expert Analysis</p>
            <h2 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase text-white tracking-tighter italic`}>Insider Guides</h2>
          </div>
          {/* FIX LỖI: Link dẫn đúng đến trang Guides */}
          <Link href="/guides" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-green-400 transition-all border-b border-gray-800 pb-1">
            Read All Guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {expertGuides.map((post) => (
            <Link key={post.id} href={`/guides/${post.slug}`} className="group flex flex-col bg-[#0f1115] border border-white/5 rounded-[3rem] overflow-hidden hover:border-green-500/50 transition-all duration-500">
              <div className="h-64 overflow-hidden relative">
                <img src={post.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-90" />
              </div>
              <div className="p-10 -mt-10 relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors leading-tight">{post.title}</h3>
                <p className="text-gray-400 text-sm italic line-clamp-3 mb-8">"{post.excerpt}"</p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-gray-600">By {post.author?.name}</span>
                  <span className="text-green-500">Read Now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- TRUST BANNER --- */}
      <section className="py-32 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-[3.5rem] overflow-hidden">
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">100% Insider</h3>
            <p className="text-gray-500 leading-relaxed">Verified by a team of residents living in Singapore for 20+ years.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Real-Time Intel</h3>
            <p className="text-gray-500 leading-relaxed">Direct schedule updates and crowd analysis.</p>
          </div>
          <div className="p-16 bg-black hover:bg-[#0a0a0a] transition-all">
            <h3 className="text-white font-black text-2xl mb-4 uppercase italic">Partner Rates</h3>
            <p className="text-gray-500 leading-relaxed">Integrated with official booking portals for the lowest rates.</p>
          </div>
        </div>
      </section>

    </main>
  );
}