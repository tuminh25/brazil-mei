// src/app/events/free/page.tsx

import { getEventsFree } from '@/lib/data-access/events'
import EventCard from '@/components/EventCard'

export default async function FreeEventsPage() {
  const events = await getEventsFree()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Free Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No free events found yet.</p>
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
