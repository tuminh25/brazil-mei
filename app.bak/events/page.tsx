// app/events/page.tsx - Giữ nguyên, chỉ cần đảm bảo dùng event.venue
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Helper functions (server component safe)
const formatDate = (date: Date | null) => {
  if (!date) return 'Date TBA'
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

const formatPrice = (price: string | null, isFree: boolean | null) => {
  if (isFree) return 'Free'
  if (price) {
    // Check if price already contains currency symbol
    if (/^[A-Z]{3}\s/.test(price) || price.startsWith('S$') || price.startsWith('$')) {
      return `From ${price}`
    }
    return `From S$${price}`
  }
  return 'Price TBA'
}

export default async function EventsPage() {
  // Lấy TẤT CẢ events
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
  })

  console.log('Total events found:', events.length)
  console.log('Sample event:', events[0] ? {
    name: events[0].name,
    startDate: events[0].startDate,
    venue: events[0].venue,
    price: events[0].price,
    isFree: events[0].isFree,
  } : 'No events')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Singapore Events ({events.length})
          </h1>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link 
              key={event.id}
              href={`/events/${event.slug}`}
              className="block bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Event Image */}
              {event.imageUrl && (
                <div className="aspect-video bg-slate-200 dark:bg-slate-700">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Event Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {event.name}
                </h2>
                
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>📅 {formatDate(event.startDate)}</p>
                  <p>📍 {event.venue || 'Venue TBA'}</p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatPrice(event.price, event.isFree)}
                  </p>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {event.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}