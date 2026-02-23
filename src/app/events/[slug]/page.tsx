import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import InteractiveMapClient from "@/components/InteractiveMapClient";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import AffiliateCTA from "@/components/AffiliateCTA";
import { splitContentAfterTransport } from "@/lib/content-utils";


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

const getAffiliateLink = (url: string | null): string | null => {
  if (!url || url === "#" || url.trim() === "") return null; // No fallback
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
    <main className={`${inter.className} min-h-screen bg-[#050505] text-gray-300 pb-32 relative overflow-hidden`}>
      {/* AMBIENT GLOW BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            className="w-full h-full object-cover blur-[120px] opacity-[0.15] scale-150 transform-gpu"
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-transparent blur-[120px]" />
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .article-body h2 { 
          color: #60a5fa !important; 
          font-family: ${playfair.style.fontFamily} !important; 
          font-size: 1.75rem !important; 
          margin: 3.5rem 0 1.5rem !important; 
          font-weight: 900; 
          text-transform: uppercase; 
          border-left: 4px solid #3b82f6; 
          padding-left: 1.5rem;
          text-shadow: 0 0 10px rgba(59,130,246,0.5);
        }
        .article-body p { font-size: 1.125rem !important; line-height: 1.9 !important; margin-bottom: 2rem !important; color: #d1d5db !important; text-align: left; }
        .article-body strong { color: white !important; font-weight: 800; }
        .article-body img { border-radius: 1.5rem; margin: 3rem 0; border: 1px solid rgba(255,255,255,0.1); }
        
        /* Universal Affiliate Block Styling */
        .affiliate-block {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          border-radius: 2rem !important;
          padding: 2rem !important;
          margin: 3rem 0 !important;
        }
        .affiliate-button-klook { background-color: #eab308 !important; color: black !important; font-weight: 900 !important; }
        .affiliate-button-trip { background-color: #dc2626 !important; color: white !important; font-weight: 900 !important; }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh] flex items-end overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            priority
            unoptimized
            className="object-cover opacity-60"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-blue-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <p className={`${mono.className} text-blue-500 text-xs tracking-[0.4em] uppercase mb-6`}>// Insider Intelligence Report</p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase italic leading-[1.05] tracking-tighter max-w-5xl`}>
            {event.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-24 mt-24">
        {/* NỘI DUNG BÀI VIẾT */}
        <div className="lg:col-span-8">


          {(event.aiSummary || event.metaDescription) && (
            <div className="mb-16 p-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] italic text-2xl text-blue-100 leading-relaxed">
              {event.aiSummary || event.metaDescription}
            </div>
          )}

          <article className="article-body mb-20">
            {(() => {
              const { before, after } = splitContentAfterTransport(event.description || "");
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: before }} />
                  {after && (
                    <section className="my-20">
                      <AffiliateCTA
                        className="mt-0"
                        title="Decoded Recommendations"
                        description="Trusted partners for your event logistics and travel needs."
                        tripUrl={event.sourceUrl?.includes("trip.com") ? event.sourceUrl : null}
                        klookUrl={event.sourceUrl?.includes("klook.com") ? event.sourceUrl : null}
                      />
                    </section>
                  )}
                  {after && <div dangerouslySetInnerHTML={{ __html: after }} />}
                </>
              );
            })()}
          </article>


          {/* SECURE YOUR ENTRY — PREMIUM CTA */}
          <section className="relative z-20 my-16">
            <div className="bg-[#0d0d14] border border-white/10 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none rounded-[2.5rem]" />
              <div className="relative z-10 text-center">
                <p className={`${mono.className} text-[10px] text-cyan-500 font-black uppercase tracking-[0.5em] mb-4`}>// DON'T MISS OUT</p>
                <h2 className={`${playfair.className} text-4xl md:text-5xl text-white font-black uppercase mb-10 !border-none !p-0 !m-0`}>
                  Secure Your Entry
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {event.sourceUrl ? (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="relative group/btn"
                    >
                      <div className="absolute -inset-0.5 bg-cyan-500/50 rounded-2xl blur opacity-40 group-hover/btn:opacity-100 transition" />
                      <div className="relative bg-cyan-500 text-black font-black uppercase tracking-widest text-sm py-5 px-10 rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        🚀 GET TICKETS NOW
                      </div>
                    </a>
                  ) : (
                    <Link href="/events" className="relative group/btn">
                      <div className="absolute -inset-0.5 bg-white/20 rounded-2xl blur opacity-0 group-hover/btn:opacity-50 transition" />
                      <div className="relative bg-white text-black font-black uppercase tracking-widest text-sm py-5 px-10 rounded-2xl hover:scale-105 transition-all">
                        📅 VIEW ALL EVENTS
                      </div>
                    </Link>
                  )}
                </div>
                <Link
                  href="/events"
                  className={`${mono.className} inline-block mt-8 text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors`}
                >
                  View Full Calendar →
                </Link>
              </div>
            </div>
          </section>

          {/* AFFILIATE CTA SECTION: UNLOCK SINGAPORE */}
          <section id="affiliate-cta" className="relative z-30 my-10">
            <AffiliateCTA
              tripUrl={event.sourceUrl?.includes("trip.com") ? event.sourceUrl : null}
              klookUrl={event.sourceUrl?.includes("klook.com") ? event.sourceUrl : null}
            />
          </section>

          <div className="mt-10 pt-8 border-t border-white/5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed uppercase tracking-widest max-w-2xl">
              Keeping the neon lights on at SG Events Hub takes a lot of coffee and late-night scouting.
              Every booking through our partner links is a silent nod of support that helps us continue declassifying Singapore's best spots.
            </p>
          </div>

          <AuthorBox author={event.author} />
        </div>

        {/* SIDEBAR BOX */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl">
              <h3 className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-widest mb-10`}>DECODED LOGISTICS</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">OPERATIONAL SECTOR</p>
                  <p className="text-white font-black text-2xl leading-tight">{event.venue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">ACCESS PRICE</p>
                  <p className="text-green-400 font-black text-5xl tracking-tighter">{event.price}</p>
                </div>
              </div>

              {/* DYNAMIC AFFILIATE BUTTON */}
              {finalUrl && (() => {
                const isKlook = event.sourceUrl?.includes("klook.com");
                const isTrip = event.sourceUrl?.includes("trip.com");
                let btnClass = "bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)]";
                let providerName = "BOOK NOW";

                if (isKlook) {
                  btnClass = "bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.2)]";
                  providerName = "BOOK ON KLOOK (TOURS)";
                } else if (isTrip) {
                  btnClass = "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.2)]";
                  providerName = "BOOK ON TRIP.COM (HOTELS)";
                }

                return (
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full mt-12 ${btnClass} hover:scale-[1.03] py-6 rounded-3xl text-center font-black uppercase tracking-[0.2em] text-xs transition-all`}
                  >
                    {providerName}
                  </a>
                );
              })()}
            </div>

            {event.latitude && (
              <div className="h-72 rounded-[3.5rem] overflow-hidden border border-white/10 shadow-3xl">
                <InteractiveMapClient venueName={event.venue || ''} latitude={event.latitude} longitude={event.longitude} />
              </div>
            )}
          </div>
        </aside>
      </div>


    </main>
  );
}