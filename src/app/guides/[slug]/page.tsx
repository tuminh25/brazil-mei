// src/app/guides/[slug]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';

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
    <main className={`${inter.className} min-h-screen bg-[#050505] text-[#e5e7eb] pb-32 selection:bg-blue-500/30 font-sans`}>
      <JsonLdSchema post={post} author={post.author} />

      {/* CSS NUCLEAR OVERRIDE */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .cyber-article p { font-size: 1.4rem; line-height: 2; margin-bottom: 2.5rem; color: #9ca3af; text-align: justify; }
        .cyber-article p::before { content: '✦'; color: #3b82f6; margin-right: 15px; font-weight: bold; }
        .cyber-article h2 { color: white !important; font-family: ${playfair.style.fontFamily}; font-size: 3.5rem; margin: 5rem 0 2.5rem; border-left: 8px solid #3b82f6; padding-left: 2rem; text-transform: uppercase; }
        .cyber-article h3 { color: #60a5fa !important; font-size: 2rem; margin-top: 3rem; font-weight: bold; }
        .cyber-article ul { list-style: none; padding: 0; margin-bottom: 3rem; }
        .cyber-article li { font-size: 1.3rem; color: #d1d5db; margin-bottom: 1.5rem; padding-left: 2rem; position: relative; }
        .cyber-article li::before { content: '⚡'; position: absolute; left: 0; color: #3b82f6; }
        .cyber-article strong { color: white; font-weight: 900; }
        .cyber-article div { background-color: transparent !important; color: inherit !important; border: none !important; padding: 0 !important; }
      `}} />

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-gray-900">
        <img src={displayImage} className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]"></div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <Link href="/guides" className={`${mono.className} mb-10 inline-block text-blue-400 text-xs tracking-[0.4em] uppercase hover:text-white transition`}>
            ← Back to Guides
          </Link>
          <h1 className={`${playfair.className} text-5xl md:text-[6rem] leading-[0.95] text-white font-black tracking-tighter drop-shadow-2xl mb-12`}>
            {post.title}
          </h1>

          {/* AUTHOR BYLINE TRÊN HERO */}
          {post.author && (
            <div className="flex items-center justify-center gap-4 animate-fadeIn">
              <img src={post.author.avatarUrl || ''} className="w-10 h-10 rounded-full border border-white/50" alt="" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Analysis by</p>
                <p className="text-white font-bold">{post.author.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-24 relative z-20">

        {/* SIDEBAR TRÁI: MỤC LỤC */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md">
            <p className={`${mono.className} text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-6`}>Contents</p>
            <div className="space-y-4 text-sm font-bold text-gray-500">
              <p className="hover:text-white cursor-pointer transition">01. The Situation</p>
              <p className="hover:text-white cursor-pointer transition">02. Insider Analysis</p>
              <p className="hover:text-white cursor-pointer transition">03. Key Takeaways</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-600 mb-2">Published</p>
              <p className="text-white font-mono text-xs">{new Date(post.createdAt).toLocaleDateString('en-SG')}</p>
            </div>
          </div>
        </aside>

        {/* CỘT GIỮA: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-8">

          {/* EXCERPT BOX */}
          <div className="mb-20 p-10 bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-600 rounded-r-[2rem]">
            <p className={`${playfair.className} text-2xl md:text-3xl text-white italic leading-relaxed opacity-90`}>
              {post.excerpt}
            </p>
          </div>

          <article className="cyber-article max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] text-gray-500 italic leading-relaxed uppercase tracking-widest">
              Keeping the neon lights on at SG Events Hub takes a lot of coffee and late-night scouting.
              Every booking through our partner links is a silent nod of support that helps us continue declassifying Singapore’s best spots.
            </p>
          </div>

          {/* AUTHOR BOX (CUỐI BÀI) */}
          <AuthorBox author={post.author} />

          {/* RELATED GUIDES */}
          {relatedPosts.length > 0 && (
            <div className="mt-32">
              <h3 className={`${mono.className} text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-12 text-center`}>More from {post.author?.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/50 transition-all group">
                    <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition">{g.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2">{g.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AFFILIATE BOX */}
          <div className="mt-32 p-12 md:p-20 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[4rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h3 className={`${playfair.className} text-4xl md:text-6xl font-black mb-8 text-white uppercase`}>Unlock Singapore</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <a href={getAffiliateLink(null, 'trip')} target="_blank" rel="nofollow" className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">HOTELS ON TRIP.COM</a>
              <a href={getAffiliateLink(null, 'klook')} target="_blank" rel="nofollow" className="bg-[#ff5b00] text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">ACTIVITIES ON KLOOK</a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}