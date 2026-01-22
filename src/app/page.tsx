// src/app/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Playfair_Display, Inter } from 'next/font/google';
import { Post } from '@prisma/client';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['700', '900'], 
  style: 'italic' 
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '700'] 
});

export const dynamic = 'force-dynamic';

// Định nghĩa kiểu dữ liệu cho Post
interface PostCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  status: string;
}

export default async function HomePage() {
  let posts: PostCard[] = [];
  let dbStatus = "Checking...";
  let errorMessage = "";

  try {
    // Kiểm tra kết nối DB và lấy bài viết với kiểu rõ ràng
    const rawPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        status: true,
      }
    });
    
    posts = rawPosts as PostCard[];
    dbStatus = posts.length > 0 ? "CONNECTED ✅" : "CONNECTED ⚠️";
    
  } catch (error: any) {
    dbStatus = "CONNECTION FAILED ❌";
    errorMessage = error.message || "Unknown database error";
    console.error("DB Error:", error);
    
    // Fallback data để trang không bị sập
    posts = [];
  }

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30`}>
      {/* PHẦN HERO DEBUG */}
      <section className="py-32 text-center border-b border-white/10 bg-gradient-to-b from-blue-900/20 to-black">
        <h1 className={`${playfair.className} text-4xl md:text-7xl font-black uppercase px-4 text-white mb-6`}>
          CYBER-NOIR HQ: {dbStatus}
        </h1>
        <div className="space-y-4">
          <p className="text-blue-400 font-mono text-xl tracking-widest">
            DATABASE REPORT: {posts.length} POSTS FOUND
          </p>
          {errorMessage && (
            <p className="text-red-400 font-mono text-sm max-w-2xl mx-auto bg-red-900/20 p-4 rounded-lg">
              ERROR: {errorMessage}
            </p>
          )}
        </div>
      </section>

      {/* MỤC INSIDER GUIDES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className={`${playfair.className} text-5xl mb-12 uppercase text-white border-l-4 border-blue-600 pl-6`}>
          Insider Guides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/guides/${post.slug}`} 
                className="group bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500 transition-all p-10 shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="mb-6">
                  <span className="inline-block px-4 py-1 bg-blue-900/30 text-blue-400 text-xs font-black rounded-full uppercase tracking-widest">
                    PUBLISHED
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-base italic line-clamp-3 leading-relaxed">
                  {post.excerpt ? `"${post.excerpt}"` : "No excerpt available"}
                </p>
                <div className="mt-8 flex items-center text-xs font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-300 transition-colors">
                  Read Article <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 p-20 border border-dashed border-white/20 rounded-[3rem] text-center bg-gradient-to-br from-white/5 to-black">
              <div className="mb-8">
                <div className="text-6xl mb-4">📭</div>
                <h3 className={`${playfair.className} text-3xl text-white mb-4`}>
                  Database Empty
                </h3>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {dbStatus.includes("FAILED") 
                  ? "Database connection failed. Check your DATABASE_URL environment variable."
                  : "No published posts found in the database. Add some content or check post status."}
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="/api/health" 
                  className="px-8 py-4 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/50 rounded-full text-blue-300 font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
                >
                  Check API Health
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white font-black uppercase tracking-widest text-sm transition-all"
                >
                  Retry Connection
                </button>
              </div>
              
              {/* Debug Info */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-600 text-sm font-mono">
                  Status: {dbStatus} | Posts: {posts.length} | Time: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER DEBUG */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-600 font-mono text-sm">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${dbStatus.includes('✅') ? 'bg-green-500' : dbStatus.includes('⚠️') ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span>DB: {dbStatus}</span>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Build: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local'}
          </div>
        </div>
      </footer>
    </main>
  );
}