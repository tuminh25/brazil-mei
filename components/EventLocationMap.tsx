'use client'

import dynamic from 'next/dynamic'

interface EventLocationMapProps {
  latitude: number | null
  longitude: number | null
  venue: string | null
  venueAddress: string | null
}

const EventMap = dynamic(() => import('@/components/EventMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  ),
})

function googleMapsSearchLink(lat: number | null, lng: number | null, address: string | null, venue: string | null) {
  if (lat != null && lng != null) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  if (address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  if (venue) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} Singapore`)}`
  return null
}

function oneMapLink(lat: number | null, lng: number | null) {
  if (lat != null && lng != null) return `https://www.onemap.gov.sg/main/v2/?lat=${lat}&lng=${lng}`
  return null
}

export default function EventLocationMap({ latitude, longitude, venue, venueAddress }: EventLocationMapProps) {
  const hasCoords = latitude != null && longitude != null
  const hasAddress = !!venueAddress && venueAddress.trim().length > 0
  const gLink = googleMapsSearchLink(latitude, longitude, venueAddress, venue)
  const oLink = oneMapLink(latitude, longitude)

  if (!hasCoords && !hasAddress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🗺️ Location Map</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">No location details available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🗺️ Location Map</h3>

      {hasCoords ? (
        <>
          <EventMap latitude={latitude!} longitude={longitude!} venue={venue || 'Event Location'} address={venueAddress} />
          <div className="flex flex-wrap gap-3 mt-4">
            {gLink && (
              <a
                href={gLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <span>Open in Google Maps</span>
                <span>→</span>
              </a>
            )}
            {oLink && (
              <a
                href={oLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              >
                <span>Open in OneMap</span>
                <span>→</span>
              </a>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-700 dark:text-gray-300">{venueAddress}</div>
          </div>
          {gLink && (
            <a
              href={gLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <span>View on Google Maps</span>
              <span>→</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
