'use client'

interface EventMapProps {
  latitude: number
  longitude: number
  venue: string
  address?: string | null
}

export default function EventMap({ latitude, longitude, venue, address }: EventMapProps) {
  // OneMap AMM embed
  const oneMapIframeUrl = `https://www.onemap.gov.sg/amm/amm.html?mapStyle=Default&zoomLevel=17&marker=${latitude},${longitude}!isd351&popupWidth=260&popupHeight=120`

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <iframe
        title={`Map - ${venue}`}
        src={oneMapIframeUrl}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
      />
      {(venue || address) && (
        <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{venue}</div>
          {address && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{address}</div>}
        </div>
      )}
    </div>
  )
}
