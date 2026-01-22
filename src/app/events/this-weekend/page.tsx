// src/app/events/this-weekend/page.tsx

import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = {
  title: "This Weekend in Singapore | SG Events Hub",
  description: "Events happening this weekend in Singapore.",
};

function startOfWeekend(now = new Date()) {
  const d = new Date(now);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diffToSat = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diffToSat);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function ThisWeekendPage() {
  const sat = startOfWeekend();
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  sun.setHours(23, 59, 59, 999);

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: sat,
        lte: sun,
      },
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    take: 50,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">This Weekend</h1>
        <p className="text-gray-300">{events.length} events found</p>
      </header>

      {events.length === 0 ? (
        <p className="text-gray-400">No weekend events found yet.</p>
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
