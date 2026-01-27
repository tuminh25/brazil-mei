// src/app/events/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export const metadata = {
  title: "Singapore Events | SG Events Hub",
  description: "Discover trending activities in Singapore with AI-powered insights.",
};

export type SortOption = "trending" | "upcoming" | "newest";

function formatEventDate(d: Date | null) {
  if (!d) return "Date TBA";
  return new Date(d).toLocaleDateString("en-SG", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function normalizeSort(input?: string | null): SortOption {
  if (input === "upcoming" || input === "newest" || input === "trending") return input;
  return "trending";
}

// HÀM TẠO ẢNH THÔNG MINH DỰA TRÊN THỂ LOẠI
function getSmartPlaceholder(name: string, category: string | null) {
    // Dùng chính cái tên sự kiện làm "khóa" để mỗi bài ra 1 ảnh khác nhau
    const id = name.length % 10; 
    const keywords = ['singapore-city', 'concert', 'festival', 'museum', 'nightlife', 'party', 'stadium', 'marina-bay', 'art-gallery', 'tourism'];
    return `https://loremflickr.com/800/600/${keywords[id]}/all?lock=${name.length}`;
}

function EventCard({ event }: { event: any }) {
  const isTrending = (event.hotnessScore ?? 0) >= 70;
  
  // LOGIC CHỐNG TRÙNG: Nếu ảnh trong DB trống, dùng ảnh thông minh
  const displayImage = event.imageUrl && event.imageUrl.startsWith('http') 
    ? event.imageUrl 
    : getSmartPlaceholder(event.name, event.category);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img src={displayImage} alt={event.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isTrending && <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase">🔥 Trending</span>}
          <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded uppercase">{event.category || 'Singapore'}</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-400">{event.name}</h3>
        <div className="space-y-1 mt-2 mb-6">
          <p className="text-xs text-gray-400">📅 {formatEventDate(event.startDate)}</p>
          <p className="text-xs text-gray-400 line-clamp-1">📍 {event.venue || 'Venue TBA'}</p>
        </div>
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-sm font-black text-blue-400">{event.price && event.price !== '0' ? `SGD ${event.price}` : 'FREE ENTRY'}</div>
          <div className="text-[10px] font-black uppercase text-white/50 group-hover:text-white">DETAILS →</div>
        </div>
      </div>
    </Link>
  );
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ sort?: string | null }> }) {
  const resolved = await searchParams;
  const sortBy = normalizeSort(resolved.sort);
  const events = await prisma.event.findMany({
  where: { 
    status: 'PUBLISHED',
    category: { not: 'Attraction' },
startDate: { gte: new Date() } // Chặn các bài cũ
},
orderBy: sortBy === "trending" ? { hotnessScore: "desc" } : sortBy === "upcoming" ? { startDate: "asc" } : { createdAt: "desc" },
    take: 60,
    select: { id: true, slug: true, name: true, imageUrl: true, startDate: true, venue: true, price: true, category: true, hotnessScore: true }
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-[#0a0f1a] border-b border-white/5 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">SG Events Hub</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl font-medium">Trending Singapore activities, powered by AI insider insights.</p>
          <div className="flex gap-4">
             {["trending", "upcoming", "newest"].map((s) => (
                <Link key={s} href={`/events?sort=${s}`} className={`px-5 py-2 rounded-full text-sm font-bold border transition ${sortBy === s ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>{s.toUpperCase()}</Link>
             ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </section>
    </main>
  );
}