// src/app/guides/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic'; // ÉP PHẢI LẤY DỮ LIỆU MỚI NHẤT

export default async function GuidesPage() {
  // LẤY TẤT CẢ BÀI VIẾT, KHÔNG LỌC CATEGORY ĐỂ TRÁNH SÓT TIN
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  }) || [];

  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase italic`}>
          Singapore Insider Guides
        </h1>
        <p className="text-gray-400 text-xl mb-20 max-w-2xl border-l-2 border-blue-500 pl-6">
          Exclusive analysis, local trends, and deep dives into the pulse of the city. Found {posts.length} articles.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/guides/${post.slug}`} className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
               <div className="h-72 overflow-hidden relative">
                  <img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-6 left-6">
                     <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {post.category || 'Expert Guide'}
                     </span>
                  </div>
               </div>
               <div className="p-10 -mt-12 relative z-10">
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed italic mb-6">
                    "{post.excerpt}"
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex items-center gap-2">
                        <img src={post.author?.avatarUrl || ''} className="w-6 h-6 rounded-full border border-white/20" alt=""/>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.author?.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Read Now →</span>
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}