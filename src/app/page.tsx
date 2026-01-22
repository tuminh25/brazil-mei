// src/app/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import IconsCarousel from "@/components/IconsCarousel";
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // SỬA LỖI TẠI ĐÂY: Thêm kiểu dữ liệu any[] để TypeScript không phàn nàn
  let posts: any[] = []; 
  let dbStatus = "Checking...";

  try {
    // 1. Kiểm tra kết nối DB và lấy bài viết
    posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });
    dbStatus = "CONNECTED ✅";
  } catch (error) {
    dbStatus = "CONNECTION FAILED ❌";
    console.error("DB Error:", error);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white`}>
      {/* --- PHẦN HERO DEBUG --- */}
      <section className="py-20 text-center border-b border-white/10">
        <h1 className={`${playfair.className} text-4xl md:text-7xl font-black uppercase px-4`}>
          BOSS TEST MODE: {dbStatus}
        </h1>
        <p className="text-blue-500 font-mono mt-4">DATABASE REPORT: {posts.length} POSTS FOUND</p>
      </section>

      {/* --- MỤC INSIDER GUIDES --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className={`${playfair.className} text-5xl mb-12 uppercase`}>Insider Guides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/guides/${post.slug}`} className="group bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500 transition-all">
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400">{post.title}</h3>
                  <p className="text-gray-500 text-sm italic line-clamp-3">"{post.excerpt}"</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 p-20 border border-dashed border-white/20 rounded-3xl text-center">
              <p className="text-gray-500 font-black text-xl">DỮ LIỆU ĐANG TRỐNG HOẶC CHƯA CÓ TRẠNG THÁI PUBLISHED.</p>
              <p className="text-sm text-gray-700 mt-4 italic">Kiểm tra lại Database Neon ngay Sếp nhé!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}