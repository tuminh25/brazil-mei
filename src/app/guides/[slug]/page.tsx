// src/app/guides/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import AffiliateCTA from "@/components/AffiliateCTA";
import { splitContentAfterTransport } from "@/lib/content-utils";


// 1. FONT CHỮ CAO CẤP
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const dynamic = 'force-dynamic';

const getAffiliateLink = (url: string | null, type: 'klook' | 'trip'): string => {
  const K_ID = "105111";
  const T_AID = "7367361";
  const T_SID = "278066643";

  let base = url?.trim();
  if (!base || base === "#") {
    base = type === 'klook' ? "https://www.klook.com/en-SG/city/6-singapore-things-to-do/" : "https://www.trip.com/";
  }

  try {
    const urlObj = new URL(base);
    if (type === 'klook' || urlObj.hostname.includes("klook.com")) {
      urlObj.searchParams.set("aid", K_ID);
      urlObj.searchParams.set("utm_medium", "affiliate-alwayson");
      urlObj.searchParams.set("utm_source", "non-network");
      urlObj.searchParams.set("utm_campaign", K_ID);
    } else if (type === 'trip' || urlObj.hostname.includes("trip.com")) {
      urlObj.searchParams.set("Allianceid", T_AID);
      urlObj.searchParams.set("SID", T_SID);
    }
    return urlObj.toString();
  } catch (e) {
    return base;
  }
};

// 2. COMPONENT: AUTHOR BOX (GIAO DIỆN GLASSMORPHISM)
function AuthorBox({ author }: { author: any }) {
  if (!author) return null;
  return (
    <div className="mt-24 p-10 bg-[#111] border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all"></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <img
          src={author.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-black ring-2 ring-blue-500/50"
        />
        <div className="text-center md:text-left flex-1">
          <p className={`${mono.className} text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2`}>{author.role || "Expert Writer"}</p>
          <h3 className={`${playfair.className} text-3xl font-black text-white mb-3`}>{author.name}</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{author.bio}</p>

          {/* Social Icons */}
          {author.socialLinks && (
            <div className="flex justify-center md:justify-start gap-4 mt-4 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Connect with me</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. COMPONENT: JSON-LD SCHEMA (CHO GOOGLE HIỂU)
function JsonLdSchema({ post, author }: { post: any; author: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": author?.name || "SG Events Hub Team",
      "url": author ? `https://sgeventshub.com/author/${author.id}` : "https://sgeventshub.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SG Events Hub",
      "logo": { "@type": "ImageObject", "url": "https://sgeventshub.com/logo.png" }
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 4. LẤY DỮ LIỆU BÀI VIẾT + TÁC GIẢ
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true } // Lấy thông tin tác giả
  });

  if (!post) notFound();

  // Lấy bài viết liên quan
  const relatedPosts = await prisma.post.findMany({
    where: { NOT: { slug: slug }, authorId: post.authorId }, // Ưu tiên bài cùng tác giả
    take: 2,
    select: { title: true, slug: true, excerpt: true }
  });

  const displayImage = post.imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600&q=80";

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-[#e5e7eb] pb-32 selection:bg-blue-500/30 font-sans relative overflow-hidden`}>
      {/* AMBIENT GLOW BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            className="w-full h-full object-cover blur-[120px] opacity-[0.15] scale-150 transform-gpu"
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-transparent blur-[120px]" />
        )}
      </div>

      <JsonLdSchema post={post} author={post.author} />

      {/* CSS NUCLEAR OVERRIDE: Cyber-Noir Aesthetic */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Typography & Rhythm */
        .cyber-article { font-family: ${inter.style.fontFamily}; }
        .cyber-article p { 
          font-size: 1.4rem; 
          line-height: 2; 
          margin-bottom: 2.5rem; 
          color: #9ca3af; 
          text-align: justify; 
          position: relative;
        }
        .cyber-article p::before { 
          content: '✦'; 
          color: #3b82f6; 
          margin-right: 15px; 
          font-weight: bold; 
          opacity: 0.6;
        }
        
        .cyber-article h2 { 
          color: white !important; 
          font-family: ${playfair.style.fontFamily}; 
          font-size: 3.5rem; 
          margin: 6rem 0 3rem; 
          border-left: 8px solid #3b82f6; 
          padding-left: 2rem; 
          text-transform: uppercase; 
          letter-spacing: -0.02em;
          line-height: 1;
        }
        
        .cyber-article h3 { 
          color: #60a5fa !important; 
          font-size: 2rem; 
          margin: 4rem 0 2rem; 
          font-weight: 900; 
          text-transform: none;
        }
        
        .cyber-article ul { list-style: none; padding: 0; margin-bottom: 4rem; }
        .cyber-article li { 
          font-size: 1.3rem; 
          color: #d1d5db; 
          margin-bottom: 1.5rem; 
          padding-left: 2.5rem; 
          position: relative; 
          line-height: 1.6;
        }
        .cyber-article li::before { 
          content: '⚡'; 
          position: absolute; 
          left: 0; 
          color: #3b82f6; 
          font-weight: bold;
        }
        
        .cyber-article strong { color: white; font-weight: 900; }
        
        /* GUEST AUTHOR BLOCK */
        .guest-author-byline { 
          font-family: ${mono.style.fontFamily}; 
          text-transform: uppercase; 
          font-size: 0.75rem; 
          color: #3b82f6; 
          letter-spacing: 0.25rem; 
          margin-bottom: 4rem; 
          font-weight: 900;
          border-left: 4px solid #3b82f6;
          padding: 0.5rem 0 0.5rem 1.5rem;
          display: block;
          opacity: 0.8;
        }

        /* PREMIUM CTA CARDS */
        .premium-cta-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 2.5rem;
          margin: 6rem 0;
          border-radius: 2rem;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-cta-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.05);
          border-color: rgba(59,130,246,0.3);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
        }
        .premium-cta-card.klook::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, #ff5b000a, transparent); pointer-events: none; }
        .premium-cta-card.trip::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, #0035801a, transparent); pointer-events: none; }
        
        .cta-icon { font-size: 2.5rem; opacity: 0.8; }
        .cta-content { flex: 1; }
        .cta-content h4 { font-family: ${playfair.style.fontFamily}; font-size: 1.75rem; color: white; margin: 0 0 0.5rem 0; font-weight: 900 !important; border: none !important; padding: 0 !important; }
        .cta-content p { color: #9ca3af; font-size: 0.95rem; margin: 0 !important; }
        
        .cta-link {
          background: white;
          color: black !important;
          padding: 1.25rem 2.5rem;
          border-radius: 1.25rem;
          font-weight: 900;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-decoration: none !important;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .premium-cta-card.klook .cta-link { background: #ff5b00; color: white !important; }
        .cta-link:hover { transform: scale(1.05) translateY(-2px); }

        /* DATA GRID & PRICING */
        .data-grid-box {
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2.5rem;
          padding: 4rem;
          margin: 6rem 0;
          box-shadow: inset 0 0 60px rgba(59,130,246,0.05);
        }
        .data-grid-box h3 { 
          text-align: center; 
          text-transform: uppercase; 
          letter-spacing: 0.5em; 
          font-size: 0.75rem; 
          color: #3b82f6; 
          margin-bottom: 3.5rem !important;
          border: none !important;
        }
        .data-grid-box ul { display: grid; grid-template-cols: 1fr; gap: 2rem; padding: 0 !important; list-style: none !important; }
        @media (min-width: 768px) { .data-grid-box ul { grid-template-cols: 1fr 1fr; } }
        .data-grid-box li { 
          display: flex; 
          flex-direction: column; 
          gap: 0.5rem; 
          padding: 0 !important;
          padding-left: 0 !important;
        }
        .data-grid-box li::before { display: none !important; }
        .data-grid-box li .key { color: #6b7280; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 900; }
        .data-grid-box li .val { color: white; font-weight: 500; font-size: 1.1rem; }

        .pricing-box {
          background: linear-gradient(to bottom right, rgba(255,255,255,0.03), transparent);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 2rem;
          padding: 3rem;
          margin: 5rem 0;
          font-family: ${mono.style.fontFamily};
          color: #d1d5db;
          line-height: 1.8;
        }
        .pricing-box p { margin-bottom: 0.75rem !important; }
        .pricing-box p::before { display: none !important; }

        .author-intro-box {
          background: rgba(59,130,246,0.03);
          border: 1px dashed rgba(59,130,246,0.2);
          padding: 3.5rem;
          border-radius: 2.5rem;
          margin: 6rem 0;
          position: relative;
        }
        .intro-badge {
          position: absolute;
          top: 0;
          left: 4rem;
          transform: translateY(-50%);
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .author-intro-box p { font-style: italic; font-size: 1.25rem; color: #f3f4f6; line-height: 2 !important; margin-bottom: 2rem !important; }
        .author-intro-box p::before { display: none !important; }
        .intro-footer { text-align: right; font-size: 0.85rem; color: #6b7280; font-weight: 800; font-family: ${mono.style.fontFamily}; }

        @keyframes cinematicIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cyber-article { animation: cinematicIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-gray-900">
        <img src={displayImage} className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]"></div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <Link href="/guides" className={`${mono.className} mb-12 inline-block text-blue-400 text-xs tracking-[0.4em] uppercase hover:text-white transition`}>
            ← System Directory
          </Link>
          <h1 className={`${playfair.className} text-6xl md:text-[8rem] leading-[0.9] text-white font-black tracking-tighter drop-shadow-2xl mb-12 italic`}>
            {post.title}
          </h1>

          {/* AUTHOR BYLINE ON HERO */}
          {post.author && !post.content.includes("guest-author-byline") && (
            <div className="flex items-center justify-center gap-5">
              <img src={post.author.avatarUrl || ''} className="w-12 h-12 rounded-full border-2 border-blue-500/30" alt="" />
              <div className="text-left">
                <p className={`${mono.className} text-[10px] text-gray-500 uppercase tracking-widest font-black`}>Lead Investigator</p>
                <p className="text-white font-black text-lg">{post.author.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 mt-32 relative z-20">

        {/* LEFT SIDEBAR: STICKY TOC */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 p-10 bg-white/3 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <p className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-8`}>Node Mapping</p>
            <div className="space-y-6 text-xs font-black text-gray-500 uppercase tracking-widest">
              <p className="hover:text-blue-400 cursor-pointer transition flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500/30 rounded-full"></span> 01 Overview</p>
              <p className="hover:text-blue-400 cursor-pointer transition flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500/30 rounded-full"></span> 02 Intelligence</p>
              <p className="hover:text-blue-400 cursor-pointer transition flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500/30 rounded-full"></span> 03 Extraction</p>
            </div>
            <div className="mt-12 pt-10 border-t border-white/5">
              <p className={`${mono.className} text-[9px] text-gray-600 mb-2 uppercase`}>Timestamp</p>
              <p className="text-white font-mono text-xs">{new Date(post.createdAt).toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </aside>

        {/* CENTER: MAIN CONTENT */}
        <div className="lg:col-span-8 lg:col-start-4">



          {/* EXCERPT BOX: HIGH END BLU PRINT */}
          <div className="mb-24 p-12 bg-gradient-to-br from-blue-600/10 to-transparent border-l-[6px] border-blue-600 rounded-r-[3rem] shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
            <p className={`${playfair.className} text-3xl md:text-4xl text-white italic leading-relaxed font-black opacity-95`}>
              {post.excerpt}
            </p>
          </div>

          <article className="cyber-article max-w-none mb-12">
            {(() => {
              const { before, after } = splitContentAfterTransport(post.content);
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: before }} />
                  {after && (
                    <section className="my-24">
                      <AffiliateCTA
                        className="mt-0"
                        title="Premium Intelligence"
                        description="Access vetted booking channels for guaranteed entry and elite stay options."
                      />
                    </section>
                  )}
                  {after && <div dangerouslySetInnerHTML={{ __html: after }} />}
                </>
              );
            })()}
          </article>

          {/* READY TO EXPLORE — PREMIUM CTA */}
          <section className="relative z-20 my-16">
            <div className="bg-[#0d0d14] border border-white/10 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none rounded-[2.5rem]" />
              <div className="relative z-10 text-center">
                <p className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-[0.5em] mb-4`}>// PLAN YOUR TRIP</p>
                <h2 className={`${playfair.className} text-4xl md:text-5xl text-white font-black uppercase mb-10 !border-none !p-0 !m-0`}>
                  Ready to Explore Singapore?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://www.trip.com/?allianceid=7367361&sid=278066643"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="relative group/btn"
                  >
                    <div className="absolute -inset-0.5 bg-blue-500/30 rounded-2xl blur opacity-0 group-hover/btn:opacity-100 transition" />
                    <div className="relative bg-white text-black font-black uppercase tracking-widest text-sm py-5 px-10 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                      🏨 CHECK HOTEL PRICES
                    </div>
                  </a>
                  <a
                    href="https://www.klook.com/en-SG/?aid=105111"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="relative group/btn"
                  >
                    <div className="absolute -inset-0.5 bg-[#ff5b00]/40 rounded-2xl blur opacity-0 group-hover/btn:opacity-100 transition" />
                    <div className="relative bg-[#ff5b00] text-white font-black uppercase tracking-widest text-sm py-5 px-10 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,91,0,0.4)]">
                      🎟 BOOK TOP ACTIVITIES
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM AFFILIATE CTA: UNLOCK SINGAPORE */}
          <section id="affiliate-cta" className="relative z-30 my-10">
            <AffiliateCTA />
          </section>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className={`${mono.className} text-[10px] text-gray-600 italic leading-relaxed uppercase tracking-[0.3em] max-w-2xl mx-auto`}>
              Support the Hub: node connectivity maintained via affiliate protocols.
              Bookings via these links fuel our research and declassifying efforts.
            </p>
          </div>

          {/* AUTHOR BOX */}
          {!post.content.includes("guest-author-byline") && <AuthorBox author={post.author} />}

          {/* RELATED GUIDES */}
          {relatedPosts.length > 0 && (
            <div className="mt-32">
              <h3 className={`${mono.className} text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-12 text-center`}>
                More from {post.author?.name || "The Intelligence Node"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/10 transition-all"></div>
                    <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition relative z-10">{g.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 relative z-10">{g.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
