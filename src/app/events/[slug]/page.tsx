// src/app/events/[slug]/page.tsx (V40.0 - ANTI-CRASH)
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import InteractiveMapClient from "@/components/InteractiveMapClient";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

function AuthorBox({ author }: { author: any }) {
  if (!author) return null; // Chốt chặn 1: Không có tác giả thì không hiện gì
  return (
    <div className="mt-20 mb-16 p-8 bg-[#111] border border-white/10 rounded-[2rem] flex flex-col md:flex-row gap-8 items-start shadow-2xl">
      <img src={author.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-black ring-2 ring-blue-600/50 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
          <h4 className="text-2xl font-black text-white">{author.name}</h4>
          <span className="hidden md:block text-gray-600">•</span>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full w-fit">{author.role || "Expert Editor"}</p>
        </div>
        <p className="text-gray-400 text-base leading-relaxed italic border-l-2 border-blue-500/50 pl-4">"{author.bio || "Singapore local expert."}"</p>
      </div>
    </div>
  );
}

const getAffiliateLink = (url: string | null): string => {
  if (!url || url === "#" || url.trim() === "") return "#";
  const K_ID = "105111"; const T_AID = "7367361"; const T_SID = "278066643";
  let affUrl = url.trim();
  const sep = affUrl.includes('?') ? '&' : '?';
  if (affUrl.includes("klook.com") && !affUrl.includes("aid=")) return `${affUrl}${sep}aid=${K_ID}&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=${K_ID}`;
  if (affUrl.includes("trip.com") && !affUrl.includes("Allianceid=")) return `${affUrl}${sep}Allianceid=${T_AID}&SID=${T_SID}`;
  return affUrl;
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Chốt chặn 2: Try-catch để không bao giờ sập trang do lỗi Prisma
  let event;
  try {
    event = await prisma.event.findUnique({ 
      where: { slug },
      include: { author: true }
    });
  } catch (e) {
    console.error("Database Fetch Error", e);
    notFound();
  }

  if (!event) notFound();

  // Chốt chặn 3: Lấy bài liên quan an toàn
  let relatedEvents: any[] = [];
  try {
    relatedEvents = await prisma.event.findMany({
      where: { status: 'PUBLISHED', slug: { not: slug } },
      take: 3,
      orderBy: { hotnessScore: 'desc' },
      select: { id: true, name: true, slug: true, venue: true, imageUrl: true, category: true }
    });
  } catch (e) {
    relatedEvents = [];
  }

  const displayImage = event.imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200";
  const cleanPitch = event.marketingPitch?.split('http')[0].split('🔗')[0].trim() || event.aiSummary;
  const finalUrl = getAffiliateLink(event.sourceUrl);

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-[#e5e7eb] pb-32 selection:bg-blue-500/30`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cyber-article p { font-size: 1.4rem !important; line-height: 2 !important; margin-bottom: 3rem !important; color: #9ca3af !important; text-align: justify; }
        .cyber-article p::before { content: '✦'; color: #3b82f6; margin-right: 15px; font-weight: bold; }
        .cyber-article h2 { color: white !important; font-family: ${playfair.style.fontFamily} !important; font-size: 3rem !important; margin: 6rem 0 3rem !important; border-left: 8px solid #3b82f6 !important; padding-left: 2rem !important; text-transform: uppercase; }
        .cyber-article div, .cyber-article section { background-color: transparent !important; color: inherit !important; border: none !important; padding: 0 !important; }
        .cyber-article strong { color: white !important; font-weight: 900 !important; }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[75vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-gray-900">
        <img src={displayImage} className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]"></div>
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <Link href="/events" className={`${mono.className} mb-12 inline-block text-blue-500 text-xs tracking-[0.5em] uppercase`}>// Singapore Intelligence Hub</Link>
          <h1 className={`${playfair.className} text-5xl md:text-[8rem] font-black leading-[0.85] text-white uppercase italic drop-shadow-2xl`}>{event.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-24 relative z-20">
        <div className="lg:col-span-8">
          {/* CHEAT SHEET */}
          <div className="mb-24 p-1 bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-[3.5rem] shadow-2xl text-center">
             <div className="p-10 md:p-16 bg-[#0a0a0a] rounded-[3.4rem]">
                <p className={`${playfair.className} text-3xl md:text-5xl text-white leading-tight italic`}>&ldquo;{event.aiSummary}&rdquo;</p>
             </div>
          </div>

          {/* CONTENT BODY */}
          <article className="cyber-article max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description || "" }} />
          </article>

          {/* AUTHOR BOX */}
          <AuthorBox author={event.author} />

          {/* REVENUE BOX */}
          <div className="mt-32 p-12 md:p-20 bg-blue-600 rounded-[4rem] text-center shadow-2xl relative overflow-hidden">
              <h3 className={`${playfair.className} text-5xl md:text-7xl text-white mb-10 uppercase`}>Unlock Singapore</h3>
              <p className="text-white text-2xl italic mb-14 opacity-95 max-w-2xl mx-auto font-medium leading-relaxed">"{cleanPitch}"</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href={`https://www.trip.com/hotels/list?city=65&searchTerm=${encodeURIComponent(event.venue || 'Singapore')}&allianceid=7367361&sid=278066643`} target="_blank" className="bg-white text-black px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl uppercase">Book Hotels</a>
                <a href={finalUrl} target="_blank" className="bg-black text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl uppercase">Book Now</a>
              </div>
          </div>
        </div>

        {/* SIDEBAR LOGISTICS */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="bg-[#111] border border-white/10 p-12 rounded-[3.5rem] shadow-2xl">
               <h3 className={`${mono.className} text-[9px] font-black mb-12 uppercase tracking-[0.4em] text-blue-500 text-center uppercase`}>📋 Logistics</h3>
               <div className="space-y-10 font-mono text-sm uppercase">
                  <div><p className="text-gray-600 mb-2 tracking-widest uppercase">Schedule</p><p className="font-black text-xl text-white uppercase">{event.startDate?.toDateString() || 'Check Details'}</p></div>
                  <div><p className="text-gray-600 mb-2 tracking-widest uppercase">Location</p><p className="font-black text-xl text-white leading-tight uppercase">{event.venue}</p></div>
                  <div><p className="text-gray-600 mb-2 tracking-widest uppercase">Ticket Price</p><p className="font-black text-4xl text-green-400 leading-none">{event.price}</p></div>
               </div>
               <a href={finalUrl} target="_blank" className="block w-full mt-10 bg-blue-600 text-white py-6 rounded-3xl text-center font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl uppercase">Book Now</a>
            </div>
            
            {event.latitude && (
              <div className="bg-white/5 border border-white/10 p-2 rounded-[3.5rem] h-[350px] overflow-hidden shadow-2xl">
                 <InteractiveMapClient venueName={event.venue || ''} latitude={event.latitude} longitude={event.longitude} />
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* FAQ SECTION - ANTI CRASH CHECK */}
      {event.aiFaq && Array.isArray(event.aiFaq) && (event.aiFaq as any[]).length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mt-48">
          <h2 className={`${playfair.className} text-6xl text-center mb-20 text-white uppercase tracking-tighter`}>Insider FAQ</h2>
          <div className="space-y-6">
            {(event.aiFaq as any[]).map((faq: any, i: number) => (
              <details key={i} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all hover:bg-white/10 hover:border-blue-500/30">
                <summary className="p-10 cursor-pointer font-bold text-2xl flex justify-between items-center list-none text-blue-100 uppercase tracking-tighter">
                  <span>{faq.question || faq.q}</span>
                  <span className="text-blue-500 text-3xl group-open:rotate-180 transition-transform font-mono">↓</span>
                </summary>
                <div className={`${playfair.className} px-10 pb-10 text-gray-400 text-2xl border-t border-white/5 pt-8 italic leading-relaxed`}>{faq.answer || faq.a}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* RELATED EVENTS - ANTI CRASH CHECK */}
      {relatedEvents.length > 0 && (
        <section className="mt-48 pt-24 border-t border-white/5 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
             <h2 className={`${playfair.className} text-5xl md:text-6xl text-white mb-16 uppercase tracking-tighter text-center`}>More Trending Events</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedEvents.map((re: any) => (
                  <Link key={re.id} href={`/events/${re.slug}`} className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all">
                     <div className="h-64 overflow-hidden relative">
                        <img src={re.imageUrl || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                     </div>
                     <div className="p-8">
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