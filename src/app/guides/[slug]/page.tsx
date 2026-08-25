// src/app/guides/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import AffiliateCTA from "@/components/AffiliateCTA";
import { TableOfContents } from "@/components/TableOfContents";
import { addHeadingIds, findDecisionPointHeading, splitContentAtHeading } from "@/lib/content-utils";
import { ResidentTools } from "@/components/ResidentTools";
import PaidProductCTA from "@/components/PaidProductCTA";
import { getProductByArticleSlug } from "@/config/products";
import type { Metadata } from "next";
import { getVersionedImageUrl, getVersionedOgImages, getPostImageUrl } from "@/lib/image-utils";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return {
        title: "Singapore Resident Guides",
        description: "Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhoods.",
      };
    }

    // Versioned image URL for cache busting
    const versionedImageUrl = getVersionedImageUrl(post.imageUrl, post.updatedAt);
    const versionedOgImages = getVersionedOgImages(post.imageUrl, post.updatedAt);

    return {
      title: post.title,
      description: post.excerpt || post.metaDescription || undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.metaDescription || undefined,
        images: versionedOgImages,
      },
      other: {
        'article:section': post.category,
        'article:tag': post.tags?.join(', ') || '',
      },
    };
  } catch (error) {
    console.error("Error generating metadata for slug:", slug, error);
    return {
      title: "Singapore Resident Guides",
      description: "Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhoods.",
    };
  }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

const getAffiliateLink = (url: string | null, type: 'klook' | 'trip'): string => {
  const K_ID = "105111";
  const T_AID = "7367361";
  const T_SID = "278066643";

  let base = url?.trim();
  if (!base || base === "#") {
    base = type === 'klook'
      ? "https://www.klook.com/en-SG/city/6-singapore-things-to-do/"
      : "https://www.trip.com/";
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
}

// BREADCRUMB SCHEMA
function BreadcrumbSchema({ post }: { post: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.sgeventshub.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resident Guides",
        "item": "https://www.sgeventshub.com/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `https://www.sgeventshub.com/guides?category=${post.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `https://www.sgeventshub.com/guides/${post.slug}`
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ORGANIZATION SCHEMA
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SG Events Hub",
    "url": "https://www.sgeventshub.com",
    "logo": "https://www.sgeventshub.com/icon.png",
    "sameAs": [
      "https://twitter.com/sgeventshub",
      "https://www.facebook.com/sgeventshub",
      "https://www.instagram.com/sgeventshub"
    ],
    "description": "Singapore Resident Intelligence — practical guides for housing, transport, money, healthcare, food, study, work, and neighborhood life."
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// INSIDER INTELLIGENCE BOX - Premium Editorial
function InsiderIntelligenceBox({ post }: { post: any }) {
  const hasData = post.insiderPrice || post.bestTime || post.secretTip;
  if (!hasData) return null;

  return (
    <div className="my-20 relative group" data-animate>
      {/* HEADER BADGE */}
      <div className="absolute -top-4 left-10 z-10 flex items-center gap-2 glass-strong px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.2)] transition-transform group-hover:scale-105">
        <span className="w-2 h-2 bg-[var(--color-cyan)] rounded-full animate-pulse" />
        <span className={`${mono.className} text-[var(--color-cyan-light)] text-[10px] font-black uppercase tracking-[0.3em]`}>
          Planning Report
        </span>
      </div>

      <div className="card-elevated rounded-[var(--radius-3xl)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">

          {/* LEFT COLUMN: STATS (1/3) */}
          <div className="md:col-span-4 p-10 md:p-12 space-y-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-black)]/50">
            
            {/* PRICE */}
            {post.insiderPrice && (
              <div className="relative pl-12">
                <span className="absolute left-0 top-0 text-2xl opacity-80">💰</span>
                <div className={`${mono.className} text-[9px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-2`}>
                  Admission Price
                </div>
                <p className="text-[var(--color-text-primary)] font-bold text-xl leading-tight">
                  {post.insiderPrice}
                </p>
              </div>
            )}

            {/* BEST TIME */}
            {post.bestTime && (
              <div className="relative pl-12">
                <span className="absolute left-0 top-0 text-2xl opacity-80">🕐</span>
                <div className={`${mono.className} text-[9px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-2`}>
                   Best Time
                </div>
                <p className="text-[var(--color-text-primary)] font-bold text-xl leading-tight">
                  {post.bestTime}
                </p>
              </div>
            )}

            {/* READING TIME */}
            <div className="relative pl-12">
              <span className="absolute left-0 top-0 text-2xl opacity-80">📖</span>
              <div className={`${mono.className} text-[9px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-2`}>
                 Read Time
              </div>
              <p className="text-[var(--color-text-primary)] font-bold text-xl leading-tight">
                {Math.ceil((post.content?.length || 0) / 1000)} min
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: SECRET TIP (2/3) */}
          <div className="md:col-span-8 p-12 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[var(--color-blue)]/[0.02] to-transparent relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-[var(--color-blue)]/30 rounded-full hidden md:block" />
            
            <div className={`${mono.className} text-[10px] text-[var(--color-cyan-light)] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3`}>
               <span className="w-8 h-[1px] bg-[var(--color-cyan)]/30" /> Key Planning Tip
            </div>
            
            <div className="relative">
              {/* QUOTE MARK DECOR */}
              <span className="absolute -top-8 -left-6 text-6xl text-[var(--color-white)]/5 font-serif select-none">“</span>
              <p className="text-[var(--color-text-secondary)] text-lg md:text-xl leading-[2] italic font-medium relative z-10">
                {post.secretTip || '—'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// AUTHOR BOX - Premium
function AuthorBox({ author }: { author: any }) {
  if (!author) return null;
  return (
    <div className="mt-24 card-elevated rounded-[var(--radius-3xl)] p-10 relative overflow-hidden group" data-animate>
      <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-blue)]/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-[var(--color-blue)]/20 transition-all" />
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <img
          src={author.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-black)] ring-2 ring-[var(--color-blue)]/50"
        />
        <div className="text-center md:text-left flex-1">
          <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-[0.3em] mb-2`}>{author.role || "Expert Writer"}</p>
          <h3 className={`${playfair.className} text-3xl font-black text-[var(--color-text-primary)] mb-3`}>{author.name}</h3>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xl">{author.bio}</p>
          {author.socialLinks && (
            <div className="flex justify-center md:justify-start gap-4 mt-4 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-widest">Connect with me</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// JSON-LD SCHEMA (Article)
function JsonLdSchema({ post, author }: { post: any; author: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "articleSection": post.category,
    "keywords": post.tags?.join(', ') || '',
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

// PREMIUM ARTICLE STYLES
const articleStyles = `
  .editorial-article { font-family: ${inter.style.fontFamily}; }
  .editorial-article p {
    font-size: 1.125rem;
    line-height: 1.85;
    margin-bottom: 2rem;
    color: #a3a3a3;
    text-align: justify;
  }
  .editorial-article p:first-of-type::first-letter {
    float: left;
    font-family: ${playfair.style.fontFamily};
    font-size: 4.5rem;
    line-height: 1;
    font-weight: 900;
    color: #ffffff;
    margin: 0.1em 0.1em 0 0;
    padding: 0;
  }
  .editorial-article h2 {
    color: #ffffff !important;
    font-family: ${playfair.style.fontFamily};
    font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem);
    margin: 4rem 0 1.5rem;
    padding-left: 1.5rem;
    border-left: 4px solid #2563eb;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .editorial-article h3 {
    color: #60a5fa !important;
    font-size: 1.5rem;
    margin: 3rem 0 1rem;
    font-weight: 900;
  }
  .editorial-article ul { list-style: none; padding: 0; margin-bottom: 2.5rem; }
  .editorial-article li {
    font-size: 1.1rem;
    color: #d1d5db;
    margin-bottom: 1rem;
    padding-left: 2rem;
    position: relative;
    line-height: 1.7;
  }
  .editorial-article li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #2563eb;
    font-weight: bold;
  }
  .editorial-article strong { color: #ffffff; font-weight: 900; }
  .editorial-article blockquote {
    border-left: 3px solid #2563eb;
    background: rgba(37, 99, 235, 0.03);
    padding: 2rem 2.5rem;
    border-radius: 0 1.5rem 1.5rem 0;
    margin: 3rem 0;
    font-family: ${playfair.style.fontFamily};
    font-size: 1.25rem;
    line-height: 1.75;
    font-style: italic;
    color: #f3f4f6;
    position: relative;
  }
  .editorial-article blockquote::before {
    content: '❝';
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 4rem;
    color: #2563eb;
    opacity: 0.15;
  }
  .editorial-article blockquote footer {
    margin-top: 1rem;
    font-family: ${mono.style.fontFamily};
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    font-weight: 700;
    text-transform: uppercase;
    color: #737373;
  }
  .editorial-article blockquote footer strong { color: #ffffff; }
  
  .editorial-article table {
    width: 100%;
    border-collapse: collapse;
    margin: 2.5rem 0;
    font-size: 0.95rem;
  }
  .editorial-article th,
  .editorial-article td {
    padding: 1rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .editorial-article th {
    background: rgba(255,255,255,0.02);
    font-weight: 900;
    font-family: ${mono.style.fontFamily};
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #a3a3a3;
  }
  .editorial-article td { color: #d1d5db; }
  .editorial-article tr:last-child td { border-bottom: none; }
  .editorial-article tr:hover td { background: rgba(255,255,255,0.01); }
  
  .editorial-article .callout {
    padding: 1.5rem 2rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255,255,255,0.06);
    background: #111;
    margin: 2.5rem 0;
  }
  .editorial-article .callout-info { border-color: #2563eb; background: rgba(37, 99, 235, 0.05); }
  .editorial-article .callout-warning { border-color: #f97316; background: rgba(249, 115, 22, 0.05); }
  .editorial-article .callout-success { border-color: #22c55e; background: rgba(34, 197, 94, 0.05); }
  .editorial-article .callout-title {
    font-family: ${mono.style.fontFamily};
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .editorial-article .callout-info .callout-title { color: #3b82f6; }
  .editorial-article .callout-warning .callout-title { color: #fb923c; }
  .editorial-article .callout-success .callout-title { color: #4ade80; }
  .editorial-article .callout-content { font-size: 0.95rem; line-height: 1.7; color: #a3a3a3; }
  
  .editorial-article .stat-box {
    padding: 2rem;
    background: #111;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 2rem;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .editorial-article .stat-box:hover {
    border-color: #2563eb;
    box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 0 40px rgba(37,99,235,0.15);
    transform: translateY(-4px);
  }
  .editorial-article .stat-value {
    font-family: ${playfair.style.fontFamily};
    font-size: 2.5rem;
    line-height: 1.1;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .editorial-article .stat-label {
    font-family: ${mono.style.fontFamily};
    font-size: 0.6875rem;
    letter-spacing: 0.2em;
    font-weight: 900;
    text-transform: uppercase;
    color: #737373;
  }
  
  @keyframes cinematicIn {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .editorial-article { animation: cinematicIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) notFound();

  // INTERNAL LINKING: Priority - Same neighborhood → Same category → Newest
  const relatedPosts = await prisma.post.findMany({
    where: {
      NOT: { slug: slug },
      status: 'PUBLISHED',
    },
    take: 6,
    orderBy: [
      { neighborhood: post.neighborhood ? 'desc' : 'asc' },
      { category: post.category ? 'desc' : 'asc' },
      { createdAt: 'desc' },
    ],
    select: { title: true, slug: true, excerpt: true, imageUrl: true, category: true, neighborhood: true, createdAt: true },
  });

  // Sort in JS for precise priority: same neighborhood + same category first
  const sortedRelated = relatedPosts.sort((a, b) => {
    const aSameNeighborhood = a.neighborhood === post.neighborhood;
    const bSameNeighborhood = b.neighborhood === post.neighborhood;
    const aSameCategory = a.category === post.category;
    const bSameCategory = b.category === post.category;
    
    if (aSameNeighborhood && aSameCategory && !(bSameNeighborhood && bSameCategory)) return -1;
    if (bSameNeighborhood && bSameCategory && !(aSameNeighborhood && aSameCategory)) return 1;
    if (aSameNeighborhood && !bSameNeighborhood) return -1;
    if (bSameNeighborhood && !aSameNeighborhood) return 1;
    if (aSameCategory && !bSameCategory) return -1;
    if (bSameCategory && !aSameCategory) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 3);

  const displayImage = post.imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600&q=80";

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] pb-32 selection:bg-[var(--color-blue)]/30 font-sans relative overflow-hidden`}>

      {/* AMBIENT GLOW BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            className="w-full h-full object-cover blur-[120px] opacity-[0.12] scale-150 transform-gpu"
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-purple)]/20 via-[var(--color-blue)]/10 to-transparent blur-[120px]" />
        )}
      </div>

      {/* SCHEMAS */}
      <JsonLdSchema post={post} author={post.author} />
      <BreadcrumbSchema post={post} />
      <OrganizationSchema />

      {/* PREMIUM ARTICLE STYLES */}
      <style dangerouslySetInnerHTML={{ __html: articleStyles }} />

      {/* ════════════════════════════════════════════════════════════════════════════════
         HERO — Full-Screen, High-Res, Cinematic
         ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full min-h-[80vh] max-h-[90vh] flex flex-col items-center justify-end overflow-hidden border-b border-[var(--color-border)]" data-animate>
        {/* FULL-BLEED HIGH-RES BACKGROUND IMAGE */}
        <img
          src={displayImage}
          className="absolute inset-0 w-full h-full object-cover"
          alt={post.title}
        />

        {/* CINEMATIC GRADIENTS */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/50 to-[var(--color-black)]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-black)]/40 via-transparent to-[var(--color-black)]/40" />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 noise-overlay" />

        {/* BACK LINK */}
        <div className="absolute top-10 left-10 z-20">
          <Link
            href="/guides"
            className={`${mono.className} flex items-center gap-2 text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.4em] hover:text-[var(--color-text-primary)] transition bg-[var(--color-black)]/40 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--color-border)]`}
          >
            ← All Guides
          </Link>
        </div>

        {/* VERIFIED INSIDER BADGE — TOP RIGHT */}
        <div className="absolute top-10 right-10 z-20">
          <div className={`${mono.className} flex items-center gap-2 glass-strong px-5 py-2.5 rounded-full`}>
            <span className="w-2 h-2 bg-[var(--color-cyan)] rounded-full animate-pulse" />
            <span className="text-[var(--color-cyan-light)] text-[9px] font-black uppercase tracking-[0.3em]">✦ Planning Guide</span>
          </div>
        </div>

        {/* HERO CONTENT — BOTTOM ALIGNED */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 text-center">
          {/* CATEGORY & NEIGHBORHOOD */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className={`${mono.className} text-[var(--color-cyan-light)] text-[10px] font-black uppercase tracking-[0.5em]`}>
              {post.category} · Singapore
            </span>
            {post.neighborhood && (
              <span className={`${mono.className} text-[var(--color-green-light)] text-[10px] font-black uppercase tracking-[0.5em]`}>
                {post.neighborhood}
              </span>
            )}
          </div>

          {/* TITLE — Dominant Editorial Headline */}
          <h1 className={`${playfair.className} text-5xl md:text-[7rem] leading-[0.9] text-[var(--color-text-primary)] font-black tracking-tighter drop-shadow-2xl mb-10 italic text-balance`}>
            {post.title}
          </h1>

          {/* AUTHOR BYLINE */}
          {post.author && !post.content.includes("guest-author-byline") && (
            <div className="flex items-center justify-center gap-4">
              <img
                src={post.author.avatarUrl || ''}
                className="w-10 h-10 rounded-full border-2 border-[var(--color-blue)]/40"
                alt=""
              />
              <div className="text-left">
                <p className="text-[var(--color-text-primary)] font-black text-base">{post.author.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════
         MAIN CONTENT LAYOUT
         ══════════════════════════════════════════════════════════════════════════════ */}
      <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-20 mt-20 relative z-20">

        {/* LEFT SIDEBAR: STICKY TOC - Dynamic from H2 headings */}
        <TableOfContents content={post.content} />

        {/* CENTER: MAIN CONTENT */}
        <div className="lg:col-span-8 lg:col-start-4">

          {/* EXCERPT LEAD */}
          {post.excerpt && (
            <div className="mb-16 p-10 bg-gradient-to-br from-[var(--color-blue)]/10 to-transparent border-l-[6px] border-[var(--color-blue)] rounded-r-[var(--radius-3xl)] shadow-[0_20px_50px_rgba(37,99,235,0.08)]" data-animate>
              <p className={`${playfair.className} text-2xl md:text-3xl text-[var(--color-text-primary)] italic leading-relaxed font-black opacity-95`}>
                {post.excerpt}
              </p>
            </div>
          )}

          {/* ★ INSIDER INTELLIGENCE BOX ★ */}
          <InsiderIntelligenceBox post={post} />

          {/* MAIN ARTICLE CONTENT - with contextual tool injection */}
          {(() => {
            // Paid product sales block — injected for articles that have a matching product.
            // Injected right before the "Common Mistakes" H2 (after Side-by-Side for transport, or equivalent for others).
            const product = getProductByArticleSlug(post.slug);
            if (product) {
              const decisionPointIndex = findDecisionPointHeading(post.content, post.category);
              const { beforeHtml, afterHtml } = decisionPointIndex >= 0
                ? splitContentAtHeading(post.content, decisionPointIndex)
                : { beforeHtml: "", afterHtml: post.content };
              const salesBlockMatch = afterHtml.search(/<h2[^>]*>[^<]*Common Mistakes/i);
              const midHtml = salesBlockMatch >= 0 ? afterHtml.slice(0, salesBlockMatch) : afterHtml;
              const tailHtml = salesBlockMatch >= 0 ? afterHtml.slice(salesBlockMatch) : "";
              return (
                <>
                  {beforeHtml && (
                    <article className="editorial-article max-w-none mb-12" data-animate>
                      <div dangerouslySetInnerHTML={{ __html: addHeadingIds(beforeHtml) }} />
                    </article>
                  )}

                  {decisionPointIndex >= 0 && <ResidentTools category={post.category} />}

                  <article className="editorial-article max-w-none mb-12" data-animate>
                    <div dangerouslySetInnerHTML={{ __html: addHeadingIds(midHtml) }} />
                  </article>

                  <PaidProductCTA productKey={product.key} />

                  {tailHtml && (
                    <article className="editorial-article max-w-none mb-12" data-animate>
                      <div dangerouslySetInnerHTML={{ __html: addHeadingIds(tailHtml) }} />
                    </article>
                  )}
                </>
              );
            }

            const decisionPointIndex = findDecisionPointHeading(post.content, post.category);
            if (decisionPointIndex >= 0) {
              const { beforeHtml, afterHtml } = splitContentAtHeading(post.content, decisionPointIndex);
              return (
                <>
                  <article className="editorial-article max-w-none mb-12" data-animate>
                    <div dangerouslySetInnerHTML={{ __html: addHeadingIds(beforeHtml) }} />
                  </article>
                  
                  {/* CONTEXTUAL RESIDENT TOOL - Injected at decision point */}
                  <ResidentTools category={post.category} />
                  
                  <article className="editorial-article max-w-none mb-12" data-animate>
                    <div dangerouslySetInnerHTML={{ __html: addHeadingIds(afterHtml) }} />
                  </article>
                </>
              );
            } else {
              return (
                <article className="editorial-article max-w-none mb-12" data-animate>
                  <div dangerouslySetInnerHTML={{ __html: addHeadingIds(post.content) }} />
                </article>
              );
            }
          })()}

          {/* USEFUL RESIDENT TOOLS - Auto-mapped by category (end of article) */}
          <ResidentTools category={post.category} />

          {/* PREMIUM ARTICLE CTA */}
          <section className="my-24" data-animate>
            <AffiliateCTA
              className="mt-0"
              tripUrl={post.tripUrl}
              klookUrl={post.klookUrl}
              title="Premium Intelligence"
              description="Access vetted booking channels for guaranteed entry and elite stay options."
            />
          </section>

          <div className="mt-10 pt-10 border-t border-[var(--color-border)] text-center">
            <p className={`${mono.className} text-[10px] text-[var(--color-text-muted)] italic leading-relaxed uppercase tracking-[0.3em] max-w-2xl mx-auto`}>
              Support the Hub: bookings via these links help fund our ongoing research.
            </p>
          </div>

          {/* AUTHOR BOX */}
          {!post.content.includes("guest-author-byline") && <AuthorBox author={post.author} />}

          {/* RELATED GUIDES - Auto Internal Linking */}
          {sortedRelated.length > 0 && (
            <div className="mt-32" data-animate>
              <h3 className={`${mono.className} text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.4em] mb-12 text-center`}>
                More Guides You'll Find Useful
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedRelated.map((g, index) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="card-elevated group p-0 overflow-hidden"
                  >
                    {g.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={g.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt=""
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className={`${mono.className} flex items-center gap-2 mb-3`}>
                        <span className="w-1.5 h-1.5 bg-[var(--color-cyan)] rounded-full" />
                        <span className="text-[var(--color-cyan-light)] text-[9px] font-black uppercase tracking-widest">{g.category}</span>
                        {g.neighborhood && (
                          <>
                            <span className="w-1 h-1 bg-[var(--color-gray-600)] rounded-full mx-1" />
                            <span className="text-[var(--color-green-light)] text-[9px] font-black uppercase tracking-widest">{g.neighborhood}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 leading-tight group-hover:text-[var(--color-cyan-light)] transition">
                        {g.title}
                      </h4>
                      <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">{g.excerpt || g.title}</p>
                      {index === 0 && g.neighborhood === post.neighborhood && g.category === post.category && (
                        <span className="inline-block mt-3 px-2 py-1 text-[8px] font-black uppercase tracking-widest bg-[var(--color-green)]/20 text-[var(--color-green-light)] rounded-full">
                          Same neighborhood & category
                        </span>
                      )}
                    </div>
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