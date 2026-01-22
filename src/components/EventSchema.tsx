// src/components/EventSchema.tsx

export default function EventSchema({ events }: { events: any[] }) {
  if (!events || events.length === 0) return null

  const validEvents = events.filter((event) => event?.startDate)
  if (validEvents.length === 0) return null

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: validEvents.slice(0, 10).map((event, index) => {
      const startDate = event.startDate ? new Date(event.startDate).toISOString() : undefined
      const endDate = event.endDate ? new Date(event.endDate).toISOString() : undefined

      const venue = event.venue ?? null
      const venueAddress = event.venueAddress ?? null

      const isFree =
        !!event.isFree ||
        (typeof event.price === 'string' && event.price.toLowerCase().includes('free')) ||
        event.price === '0'

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Event',
          name: event.name,
          startDate,
          endDate,
          location: venue
            ? {
                '@type': 'Place',
                name: venue,
                address: venueAddress || undefined,
              }
            : undefined,
          image: event.imageUrl || undefined,
          url: event.sourceUrl || undefined,
          offers: isFree
            ? {
                '@type': 'Offer',
                price: 0,
                priceCurrency: 'SGD',
              }
            : event.price
              ? {
                  '@type': 'Offer',
                  price: event.price,
                  priceCurrency: 'SGD',
                }
              : undefined,
        },
      }
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
