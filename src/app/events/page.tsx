// src/app/events/page.tsx (BẢN V41.0 - CHỐT HẠ LOGIC THỜI GIAN)
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ sort?: string | null }> }) {
  const resolved = await searchParams;
  const sortParam = resolved.sort || "trending";
  const now = new Date();

  // LẤY DỮ LIỆU: CHỈ LẤY BÀI TƯƠNG LAI
  const events = await prisma.event.findMany({
    where: { 
      status: 'PUBLISHED',
      category: { not: 'Attraction' },
      startDate: { gte: now } // 🛡️ LÁ CHẮN: CHỈ HIỆN SỰ KIỆN SẮP DIỄN RA
    },
    orderBy: sortParam === "upcoming" ? { startDate: "asc" } : sortParam === "newest" ? { createdAt: "desc" } : { hotnessScore: "desc" },
    take: 60,
    select: { id: true, slug: true, name: true, imageUrl: true, startDate: true, venue: true, price: true, category: true, hotnessScore: true }
  }) || [];

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white py-24 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 border-l-4 border-blue-600 pl-8">
          <p className={`${mono.className} text-blue-500 text-xs font-black uppercase tracking-[0.4em] mb-4`}>// Live Intelligence</p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none`}>Upcoming <br/> Headliners</h1>
          
          <div className="flex gap-4 mt-10">
             {["trending", "upcoming", "newest"].map((s) => (
                <Link key={s} href={`/events?sort=${s}`} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${sortParam === s ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/10 hover:border-blue-500 hover:text-white'}`}>{s}</Link>
             ))}
          </div>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-all duration-500">
                 <div className="h-72 overflow-hidden relative">
                    <img src={event.imageUrl || 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                    <div className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-xl font-black text-xs uppercase text-center shadow-2xl">
                      <p>{event.startDate ? new Date(event.startDate).getDate() : '??'}</p>
                      <p className="text-[9px] border-t border-black/10 mt-1 pt-1">{event.startDate ? new Date(event.startDate).toLocaleString('en-US', { month: 'short' }) : 'TBA'}</p>
                    </div>
                 </div>
                 <div className="p-10 -mt-12 relative z-10">
                    <h2 className="text-2xl font-bold mb-6 line-clamp-2 text-white group-hover:text-blue-300 transition-colors leading-tight">{event.name}</h2>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                       <span className="text-green-400 font-black tracking-tighter text-lg">{event.price && event.price !== '0' ? `SGD ${event.price}` : 'FREE ENTRY'}</span>
                       <span className="text-[10px] font-black uppercase text-blue-500">Analyze →</span>
                    </div>
                 </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xl italic italic">No upcoming headliners found. Everything has passed or is being updated.</p>
          </div>
        )}
      </div>
    </main>
  );
}