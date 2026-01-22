// src/app/events/near/bugis-mrt/page.tsx

import { getEventsNearBugis } from '@/lib/data-access/events'
import EventCard from '@/components/EventCard'

export default async function NearBugisPage() {
  const events = await getEventsNearBugis()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Events near Bugis MRT</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No nearby events found yet.</p>
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
