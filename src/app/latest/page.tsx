// src/app/latest/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import type { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Latest Singapore Resident Guides | SG Events Hub",
  description: "The newest guides for living in Singapore — housing updates, transport changes, policy news, and neighborhood developments.",
  openGraph: {
    title: "Latest Singapore Resident Guides | SG Events Hub",
    description: "The newest guides for living in Singapore — housing updates, transport changes, policy news, and neighborhood developments.",
  }
};

export default async function LatestPage() {
  // Get latest 20 published posts
  const latestPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { author: true },
  });

  // Group by month for timeline view
  const postsByMonth = latestPosts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const monthKey = date.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(post);
    return acc;
  }, {} as Record<string, typeof latestPosts>);

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-20">
          <p className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.4em] mb-4`}>
            Fresh Intelligence
          </p>
          <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic`}>
            Latest Guides
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            The newest resident guides, policy updates, and neighborhood insights. Updated daily.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="space-y-16">
          {Object.entries(postsByMonth).map(([month, posts]) => (
            <section key={month} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-full h-[1px] bg-white/10" />
                <span className={`${mono.className} text-blue-400 text-xs font-black uppercase tracking-[0.3em] bg-[#050505] px-4`}>
                  {month}
                </span>
                <div className="w-full h-[1px] bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/guides/${post.slug}`}
                    className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={post.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest bg-blue-600 text-white rounded-full">
                          {post.category}
                        </span>
                        {post.neighborhood && (
                          <span className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest bg-green-600/80 text-white rounded-full">
                            {post.neighborhood}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-widest mb-2`}>
                        {new Date(post.createdAt).toLocaleDateString('en-SG', { day: '2-digit', month: 'short' })}
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-400 transition-colors leading-tight flex-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm italic line-clamp-2 mb-4 flex-1">
                        {post.excerpt || post.content.slice(0, 150).replace(/<[^>]*>/g, '')}
                      </p>
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-widest`}>
                          {post.author?.name || 'Editor'}
                        </span>
                        <span className={`${mono.className} text-blue-500 text-[9px] font-black uppercase tracking-widest`}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-xs text-white transition-all hover:border-blue-500 hover:text-blue-400"
          >
            Browse All Guides →
          </Link>
        </div>
      </div>
    </main>
  );
}