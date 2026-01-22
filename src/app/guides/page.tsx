// src/app/guides/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function GuidesPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">Singapore Insider Guides</h1>
        <p className="text-gray-400 text-xl mb-12 font-medium">Expert tips, local trends, and survival guides for your Singapore journey.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => {
            // MẸO CỦA KTS TRƯỞNG: Nếu ảnh bị trống hoặc là link placeholder cũ, tự đổi sang ảnh ngẫu nhiên siêu đẹp
            const isMissingImage = !post.imageUrl || post.imageUrl.includes('photo-1525625239513');
            const displayImage = isMissingImage 
              ? `https://loremflickr.com/800/600/singapore,city,lifestyle/all?lock=${post.id}` 
              : post.imageUrl;

            return (
              <Link 
                key={post.id} 
                href={`/guides/${post.slug}`} 
                className="group flex flex-col bg-[#111827] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-500"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={displayImage || ''} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-60" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                      {post.category || 'EXPERT GUIDE'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mt-4 line-clamp-3 text-sm leading-relaxed italic">
                    "{post.excerpt}"
                  </p>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                       <span>{new Date(post.createdAt).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1 group-hover:gap-3 transition-all">
                      READ FULL GUIDE <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 font-bold uppercase tracking-widest">Our experts are currently writing new guides...</p>
          </div>
        )}
      </div>
    </main>
  );
}