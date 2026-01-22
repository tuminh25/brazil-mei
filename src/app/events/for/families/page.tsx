// src/app/events/for/families/page.tsx

import { getEventsForFamilies } from "@/lib/data-access/events";
import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import EventSchema from "@/components/EventSchema";

export const metadata: Metadata = {
  title: "Family-Friendly Events in Singapore | SG Events Hub",
  description: "Kid-friendly activities and family events in Singapore.",
};

export default async function FamilyEventsPage() {
  const events = await getEventsForFamilies();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Family-Friendly Events in Singapore
        </h1>
        <p className="text-lg text-gray-300">
          {events.length} events found · Updated daily
        </p>
      </header>

      <EventSchema events={events.slice(0, 10) as any} />

      {events.length === 0 ? (
        <p className="text-gray-400">No events found. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
