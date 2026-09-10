// src/app/neighborhoods/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Singapore Neighborhoods | SG Events Hub",
  description: "Explore Singapore's neighborhoods — Woodlands, Jurong, Tengah, Punggol, Tampines and more. Local insights for residents.",
  openGraph: {
    title: "Singapore Neighborhoods | SG Events Hub",
    description: "Explore Singapore's neighborhoods — Woodlands, Jurong, Tengah, Punggol, Tampines and more. Local insights for residents.",
  }
};

const neighborhoods = [
  {
    slug: "woodlands",
    name: "Woodlands",
    description: "Northern gateway with waterfront living, causeway access, and upcoming Thomson-East Coast Line connectivity.",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    tags: ["Waterfront", "Causeway", "TEL", "Nature Parks"],
  },
  {
    slug: "jurong",
    name: "Jurong",
    description: "Industrial heartland transforming into a lakeside district with Jurong Lake District, MRT connectivity, and malls.",
    imageUrl: "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=800",
    tags: ["Jurong Lake District", "Industrial", "Malls", "EWL"],
  },
  {
    slug: "tengah",
    name: "Tengah",
    description: "Singapore's first 'Forest Town' with car-free town centre, smart homes, and extensive green corridors.",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?w=800",
    tags: ["Forest Town", "Car-free", "Smart Homes", "New BTO"],
  },
  {
    slug: "punggol",
    name: "Punggol",
    description: "Waterfront town with Punggol Digital District, Coney Island, and extensive cycling paths along the coast.",
    imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800",
    tags: ["Waterfront", "Digital District", "Cycling", "Coney Island"],
  },
  {
    slug: "tampines",
    name: "Tampines",
    description: "Established eastern hub with three MRT lines, multiple malls, parks, and mature amenities for families.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    tags: ["3 MRT Lines", "Mature Estate", "Malls", "Family-friendly"],
  },
];

export default async function NeighborhoodsPage() {
  // Get article counts per neighborhood
  const neighborhoodStats = await Promise.all(
    neighborhoods.map(async (n) => {
      const count = await prisma.post.count({
        where: {
          neighborhood: n.name,
          status: 'PUBLISHED',
        },
      });
      return { ...n, articleCount: count };
    })
  );

  return (
    <main className={`${inter.className} min-h-screen bg-[var(--color-black)] text-[var(--color-text-primary)] py-20 px-6`}>
      <div className="container-wide">
        {/* HERO */}
        <div className="text-center mb-20 md:mb-24" data-animate>
          <p className={`${mono.className} text-[var(--color-blue-light)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Resident Intelligence
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic`}>
            Singapore<br />Neighborhoods
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            Every neighborhood has its rhythm. Discover transport links, housing trends, food scenes, and local secrets for where you live — or where you're moving next.
          </p>
        </div>

        {/* NEIGHBORHOOD GRID - Research Highlight Style */}
        <div className="grid-editorial-5" data-animate>
          {neighborhoodStats.map((hood) => (
            <Link
              key={hood.slug}
              href={`/neighborhoods/${hood.slug}`}
              className="card-elevated group overflow-hidden"
            >
              <div className="card-media h-64 relative">
                <img
                  src={hood.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={hood.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black)] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-[0.2em] mb-2`}>
                    {hood.articleCount} Guides
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)]">
                    {hood.name}
                  </h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 line-clamp-3">
                  {hood.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {hood.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-black)] border border-[var(--color-border)] rounded-full text-[var(--color-text-tertiary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={`${mono.className} text-[var(--color-blue-light)] text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2`}>
                  Explore {hood.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="mt-24 text-center" data-animate>
          <p className={`${mono.className} text-[var(--color-text-tertiary)] text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            More Neighborhoods Coming Soon
          </p>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-black mb-6 tracking-tighter italic`}>
            We're Mapping Every Corner of Singapore
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            From Bukit Panjang to Bedok, Choa Chu Kang to Changi. Each neighborhood hub will have dedicated guides for housing, transport, food, schools, and daily life.
          </p>
          <Link
            href="/guides"
            className="btn btn-secondary btn-md"
          >
            Browse All Guides
          </Link>
        </div>
      </div>
    </main>
  );
}