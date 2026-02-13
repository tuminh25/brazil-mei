import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import InteractiveMapClient from "@/components/InteractiveMapClient";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

function AuthorBox({ author }: { author: any }) {
  if (!author) return null;
  return (
    <div className="mt-12 mb-12 p-6 bg-[#0f0f0f] border border-white/5 rounded-3xl flex items-center gap-6">
      <img src={author.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"} className="w-16 h-16 rounded-full object-cover border border-blue-500/50" alt="" />
      <div>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">Expert Analysis by</p>
        <h4 className="text-xl font-bold text-white leading-none">{author.name}</h4>
      </div>
    </div>
  );
}

const getAffiliateLink = (url: string | null): string => {
  if (!url || url === "#" || url.trim() === "") return "https://www.klook.com/en-SG/city/6-singapore-things-to-do/?aid=105111";
  const K_ID = "105111";
  const T_AID = "7367361";
  const T_SID = "278066643";
  let affUrl = url.trim();

  if (affUrl.includes("klook.com")) {
    const urlObj = new URL(affUrl);
    urlObj.searchParams.set("aid", K_ID);
    urlObj.searchParams.set("utm_medium", "affiliate-alwayson");
    urlObj.searchParams.set("utm_source", "non-network");
    urlObj.searchParams.set("utm_campaign", K_ID);
    return urlObj.toString();
  }

  if (affUrl.includes("trip.com")) {
    const urlObj = new URL(affUrl);
    urlObj.searchParams.set("Allianceid", T_AID);
    urlObj.searchParams.set("SID", T_SID);
    return urlObj.toString();
  }

  return affUrl;
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!event) notFound();

  const finalUrl = getAffiliateLink(event.sourceUrl);

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-gray-300 pb-32`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .article-body h2 { color: white !important; font-family: ${playfair.style.fontFamily} !important; font-size: 1.75rem !important; margin: 2.5rem 0 1.25rem !important; font-weight: 900; text-transform: uppercase; border-left: 4px solid #3b82f6; padding-left: 1.5rem; }
        .article-body p { font-size: 1.125rem !important; line-height: 1.8 !important; margin-bottom: 1.75rem !important; color: #d1d5db !important; text-align: left; }
        .article-body strong { color: white !important; font-weight: 800; }
        .article-body img { border-radius: 1.5rem; margin: 2.5rem 0; border: 1px solid rgba(255,255,255,0.1); }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[65vh] flex items-end overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            priority
            unoptimized
            className="object-cover opacity-50"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-blue-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className={`${mono.className} text-blue-500 text-xs tracking-[0.4em] uppercase mb-4`}>// Insider Intelligence Report</p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic leading-[1.1] tracking-tighter max-w-4xl`}>
            {event.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
        {/* NỘI DUNG BÀI VIẾT */}
        <div className="lg:col-span-8">
          <div className="mb-12 p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2rem] italic text-xl text-blue-100">
            "{event.aiSummary || event.metaDescription}"
          </div>

          <article className="article-body mb-12">
            <div dangerouslySetInnerHTML={{ __html: event.description || "" }} />
          </article>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed uppercase tracking-widest">
              Keeping the neon lights on at SG Events Hub takes a lot of coffee and late-night scouting.
              Every booking through our partner links is a silent nod of support that helps us continue declassifying Singapore’s best spots.
            </p>
          </div>

          <AuthorBox author={event.author} />
        </div>

        {/* SIDEBAR BOX */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <div className="bg-[#0f0f0f] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
              <h3 className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-widest mb-8`}>Logistics Data</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-white font-bold text-lg leading-tight">{event.venue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Pricing</p>
                  <p className="text-green-400 font-black text-3xl">{event.price}</p>
                </div>
              </div>
              <a href={finalUrl} target="_blank" className="block w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-center font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Book Now via Partner
              </a>
            </div>

            {event.latitude && (
              <div className="h-64 rounded-[2.5rem] overflow-hidden border border-white/10">
                <InteractiveMapClient venueName={event.venue || ''} latitude={event.latitude} longitude={event.longitude} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}