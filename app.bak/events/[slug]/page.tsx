// src/app/events/[slug]/page.tsx

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug },
  })

  if (!event) notFound()

  const isFree = !!event.isFree
  const priceLabel = isFree
    ? 'FREE'
    : event.price
      ? event.price.startsWith('$') || event.price.startsWith('S$') || event.price.startsWith('SGD')
        ? event.price
        : `$${event.price}`
      : 'TBA'

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/events" className="text-blue-600 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <p>
          <b>📅</b>{' '}
          {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
        </p>
        <p>
          <b>📍</b> {event.venue || 'TBA'}
        </p>
        <p>
          <b>💰</b> {priceLabel}
        </p>
      </div>
    </div>
  )
}
