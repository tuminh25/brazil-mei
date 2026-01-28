// src/app/guides/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  let allPosts = [];
  let dbUrlSample = "";

  try {
    // 1. LẤY TẤT CẢ - KHÔNG LỌC BẤT KỲ CÁI GÌ
    allPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Lấy thử 1 đoạn DB URL để Sếp đối chiếu (đã che mật khẩu)
    dbUrlSample = process.env.DATABASE_URL?.split('@')[1] || "Not Found";
  } catch (e) {
    console.error(e);
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white py-20 px-6`}>
      <div className="max-w-7xl mx-auto">
        
        {/* KHUNG KIỂM TRA CHO SẾP */}
        <div className="mb-20 p-8 border-2 border-dashed border-blue-500 rounded-3xl bg-blue-900/10">
          <h2 className="text-2xl font-black text-blue-400 mb-4 uppercase">🛠 KTS Trưởng: Database Audit</h2>
          <div className="space-y-2 text-lg">
            <p>1. Vercel đang kết nối tới Server: <code className="text-yellow-400">{dbUrlSample}</code></p>
            <p>2. Tổng số dòng tìm thấy trong bảng <b className="text-white">Post</b>: <span className="text-5xl font-black text-blue-500">{allPosts.length}</span></p>
            <p className="text-sm text-gray-500 mt-4 italic"> Nếu số này là 3, nghĩa là bài Micron/Cricket chưa hề vào Database này!</p>
          </div>
        </div>

        <h1 className={`${playfair.className} text-6xl font-black mb-12 italic`}>Insider Guides</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div key={post.id} className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-blue-500 text-xs font-black uppercase mb-2">{post.status} | {post.category}</p>
                <h3 className="text-xl font-bold mb-4">{post.title}</h3>
                <Link href={`/guides/${post.slug}`} className="text-blue-400 text-sm hover:underline">View Live Article →</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}