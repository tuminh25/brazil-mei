// src/components/EventCard.tsx
import Link from 'next/link'

export default function EventCard({ event }: { event: any }) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'TBA'
    return new Date(date).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  // MẸO CỦA KTS TRƯỞNG: Thêm timestamp để phá cache ảnh
  const displayImage = event.imageUrl 
    ? `${event.imageUrl}${event.imageUrl.includes('?') ? '&' : '?'}v=${new Date(event.updatedAt).getTime()}`
    : "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=800";

  return (
    <Link href={`/events/${event.slug}`} className="group block bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
      <div className="relative h-52 w-full overflow-hidden bg-gray-900">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=800"}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded">{event.category || 'Event'}</div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400">{event.name}</h3>
        <div className="text-xs text-gray-400 mb-4">📅 {formatDate(event.startDate)} | 📍 {event.venue}</div>
        <div className="flex justify-between items-center border-t border-white/5 pt-3">
          <span className="text-blue-300 font-bold text-sm">{event.price || 'Price TBA'}</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Details →</span>
        </div>
      </div>
    </Link>
  )
}