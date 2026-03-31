import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await prisma.event.findFirst({ where: { slug } })
  if (!event) notFound()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/events" className="text-blue-600 mb-4 inline-block">← Back</Link>
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><b>📅</b> {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}</p>
        <p><b>📍</b> {event.venue || 'TBA'}</p>
        <p><b>💰</b> {event.isFree ? 'FREE' : event.price ? `$${event.price}` : 'TBA'}</p>
      </div>
    </div>
  )
}
