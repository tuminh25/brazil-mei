// src/app/events/for/couples/page.tsx

import prisma from "@/lib/prisma";
import type { Metadata } from 'next'
import EventCard from '@/components/EventCard'
import EventSchema from '@/components/EventSchema'

export const metadata: Metadata = {
  title: 'Events for Couples',
  description: 'Singapore events that are great for couples.',
}

export default async function CouplesPage() {
  // Heuristic đơn giản: lọc theo tags/category/name/description có keyword.
  // Bạn có thể chỉnh keyword sau.
  const keywords = ['couple', 'date', 'romantic', 'valentine', 'pair']

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { category: { in: ['Romance', 'Food', 'Arts', 'Music'] } },
        ...keywords.map((k) => ({ name: { contains: k, mode: 'insensitive' as const } })),
        ...keywords.map((k) => ({ description: { contains: k, mode: 'insensitive' as const } })),
      ],
    },
    orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
    take: 50,
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Events for Couples</h1>

      <EventSchema events={events as any[]} />

      {events.length === 0 ? (
        <p className="text-gray-600">No couple-friendly events found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event as any} />
          ))}
        </div>
      )}
    </div>
  )
}
