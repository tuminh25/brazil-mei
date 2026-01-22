// src/app/events/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import InteractiveMapClient from "@/components/InteractiveMapClient";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. LẤY DỮ LIỆU ĐẦY ĐỦ (BAO GỒM AUTHOR)
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!event) notFound();

  const relatedEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED', slug: { not: slug }, category: { not: 'Attraction' } },
    take: 3,
    orderBy: { hotnessScore: 'desc' },
    select: { id: true, name: true, slug: true, venue: true, imageUrl: true, category: true }
  });

  const displayImage = event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178f50002e87?auto=format&fit=crop&w=2000&q=80";
  const cleanPitch = event.marketingPitch?.split('http')[0].split('🔗')[0].trim() || event.aiSummary;
  
  // --- HÀM THÔNG MINH: TỰ ĐỘNG GẮN ID VÀ ĐỔI MÀU NÚT ---
  const getAffiliateLink = (url: string) => {
    if (!url || url === "#") return "#";
    const K_ID = "105111"; const T_AID = "7367361"; const T_SID = "278066643";
    const sep = url.includes('?') ? '&' : '?';
    
    if (url.includes("klook.com") && !url.includes("aid=")) return `${url}${sep}aid=${K_ID}&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=${K_ID}`;
    if (url.includes("trip.com") && !url.includes("Allianceid=")) return `${url}${sep}Allianceid=${T_AID}&SID=${T_SID}`;
    return url;
  };

  const finalSourceUrl = getAffiliateLink(event.sourceUrl || "");
  const isTrip = finalSourceUrl.includes("trip.com");
  const isKlook = finalSourceUrl.includes("klook.com");
  
  const buttonLabel = isTrip ? "BOOK ON TRIP.COM" : isKlook ? "BOOK ON KLOOK" : "OFFICIAL BOOKING";
  const buttonClass = isTrip ? "bg-[#002d72] hover:bg-[#003da5]" : isKlook ? "bg-[#ff5b00] hover:bg-[#ff7b30]" : "bg-white text-black hover:bg-gray-200";

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-[#e5e7eb] pb-32 selection:bg-blue-500/30`}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-content p { font-size: 1.25rem; line-height: 1.9; margin-bottom: 2rem; color: #d1d5db; text-align: justify; }
        .editorial-content p::before { content: '◆'; color: #3b82f6; margin-right: 15px; font-size: 0.8rem; vertical-align: 2px; }
        .editorial-content h2 { 
          color: white !important; font-family: ${playfair.style.fontFamily}; 
          font-size: 2.5rem !important; margin: 4rem 0 1.5rem !important; 
          border-bottom: 1px solid #333; padding-bottom: 1rem; text-transform: uppercase;
        }
        .editorial-content strong { color: white; font-weight: 700; border-bottom: 1px solid rgba(59, 130, 246, 0.3); }
        .editorial-content div { background: transparent !important; padding: 0 !important; color: inherit !important; }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-gray-900 border-b border-white/5">
        <img src={displayImage} className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent"></div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <Link href="/events" className="mb-8 inline-block text-blue-400 text-xs font-bold tracking-[0.2em] uppercase hover:underline">← Back to Events</Link>
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold leading-tight text-white mb-6 drop-shadow-2xl`}>{event.name}</h1>
          
          {/* Tác giả */}
          {event.author && (
            <div className="flex items-center justify-center gap-3 mt-8">
               <img src={event.author.avatarUrl || ''} className="w-8 h-8 rounded-full border border-white/50" />
               <p className="text-sm text-gray-300 font-medium">Analyzed by <span className="text-white border-b border-blue-500">{event.author.name}</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20 relative z-20">
        <div className="lg:col-span-8">
          
          {/* SUMMARY */}
          {event.aiSummary && (
            <div className="mb-16 p-8 bg-[#111] border-l-4 border-blue-600 rounded-r-3xl shadow-xl">
               <p className={`${playfair.className} text-2xl text-white italic leading-relaxed opacity-90`}>"{event.aiSummary}"</p>
            </div>
          )}

          {/* ARTICLE */}
          <article className="editorial-content max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description || "" }} />
          </article>

          {/* AUTHOR BOX (CUỐI BÀI) */}
          {event.author && (
            <div className="mt-16 mb-12 flex items-center gap-5 p-6 border-t border-b border-white/10 bg-white/5 rounded-2xl">
              <img src={event.author.avatarUrl || ''} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
              <div>
                <p className={`${mono.className} text-[10px] text-blue-500 uppercase tracking-widest mb-1`}>Reviewer</p>
                <h4 className="text-lg font-bold text-white leading-none mb-1">{event.author.name}</h4>
                <p className="text-gray-500 text-xs">{event.author.bio}</p>
              </div>
            </div>
          )}

          {/* REVENUE BOX - SMART BUTTON */}
          <div className="mt-24 p-12 bg-white text-black rounded-[3rem] text-center shadow-2xl">
              <h3 className={`${playfair.className} text-4xl font-black mb-6 uppercase`}>Unlock Singapore</h3>
              <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto italic">"{cleanPitch}"</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href={`https://www.trip.com/hotels/list?city=65&searchTerm=${encodeURIComponent(event.venue || 'Singapore')}&allianceid=7367361&sid=278066643`} target="_blank" className="bg-[#002d72] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">Hotel Deals</a>
                
                {/* NÚT CHÍNH THÔNG MINH */}
                <a href={finalSourceUrl} target="_blank" className={`${buttonClass} text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all uppercase`}>
                  {buttonLabel}
                </a>
              </div>
          </div>
        </div>

        {/* SIDEBAR LOGISTICS */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-28">
            <div className="bg-[#111] border border-white/10 p-8 rounded-[2rem] shadow-xl">
               <h3 className="text-xs font-black mb-8 uppercase tracking-[0.2em] text-blue-500 border-b border-white/10 pb-4">Event Essentials</h3>
               <div className="space-y-8 text-sm uppercase">
                  <div><p className="text-[10px] text-gray-500 font-bold mb-1">When</p><p className={`${playfair.className} text-2xl text-white`}>{event.startDate?.toDateString()}</p></div>
                  <div><p className="text-[10px] text-gray-500 font-bold mb-1">Where</p><p className="text-lg text-white font-medium">{event.venue}</p></div>
                  <div><p className="text-[10px] text-gray-500 font-bold mb-1">Ticket</p><p className="text-3xl font-bold text-green-400">{event.price}</p></div>
               </div>
               
               {/* NÚT SIDEBAR CŨNG THÔNG MINH */}
               <a href={finalSourceUrl} target="_blank" className={`block w-full mt-10 ${buttonClass} text-white py-4 rounded-xl text-center font-black text-sm uppercase tracking-wider hover:opacity-80 transition-all`}>
                 {buttonLabel}
               </a>
            </div>
            
            {event.latitude && (
              <div className="mt-8 bg-white/5 border border-white/10 p-2 rounded-[2rem] h-[300px] overflow-hidden">
                 <InteractiveMapClient venueName={event.venue || ''} latitude={event.latitude} longitude={event.longitude} />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MORE TRENDING EVENTS */}
      {relatedEvents.length > 0 && (
        <section className="mt-48 pt-24 border-t border-white/5 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
             <h2 className={`${playfair.className} text-4xl md:text-5xl text-white mb-16 uppercase tracking-tighter text-center`}>More Trending Events</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedEvents.map((re) => (
                  <Link key={re.id} href={`/events/${re.slug}`} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all">
                     <div className="h-64 overflow-hidden relative">
                        <img src={re.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                        <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-blue-600/90 text-white text-[9px] font-black uppercase rounded-lg">{re.category || 'Event'}</span></div>
                     </div>
                     <div className="p-8 -mt-12 relative z-10">
                        <h3 className="text-xl font-bold mb-4 line-clamp-2 text-white group-hover:text-blue-400 transition-colors leading-tight">{re.name}</h3>
                        <p className={`${mono.className} text-xs text-gray-500 uppercase tracking-widest`}>{re.venue || 'Singapore'}</p>
                     </div>
                  </Link>
                ))}
             </div>
          </div>
        </section>
      )}
    </main>
  );
}