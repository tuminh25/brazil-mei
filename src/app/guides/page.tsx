// src/app/guides/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  console.log("Guides Page Rendering... [VERCEL DEBUG]");
  
  // 1. LẤY TẤT CẢ BÀI VIẾT LÀ EXPERT GUIDE
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { 
        status: 'PUBLISHED',
        category: 'Expert Guide' 
      },
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });
  } catch (error) {
    console.error("Guides Page DB Error:", error);
  }
  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* TIÊU ĐỀ NÀY KHÁC TRANG CHỦ, KHÔNG CÓ HERO */}
        <h1 className={`${playfair.className} text-6xl md:text-8xl font-black mb-12 tracking-tighter uppercase italic text-center`}>
          Insider Guides
        </h1>
        
        <p className="text-center text-gray-500 mb-20 uppercase tracking-[0.5em] text-xs">Verified Travel Intelligence</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/guides/${post.slug}`} className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500 transition-all duration-500 shadow-2xl">
               <div className="h-72 overflow-hidden relative">
                  <img src={post.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
               </div>
               <div className="p-10 -mt-12 relative z-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-gray-500 text-sm italic mb-8 line-clamp-3">"{post.excerpt}"</p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.author?.name}</span>
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Read Full Guide →</span>
                  </div>
               </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
            <div className="text-center py-40 border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-600 font-bold uppercase tracking-widest">No expert guides found. Please check database category.</p>
            </div>
        )}
      </div>
    </main>
  );
}