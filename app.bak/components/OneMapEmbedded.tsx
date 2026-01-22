 'use client'

interface Props {
  lat?: number | null
  lng?: number | null
  venueName?: string | null
}

export default function OneMapEmbedded({ lat, lng, venueName }: Props) {
  if (!lat || !lng) return null

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-3">📍 Location</h3>
      <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.onemap.gov.sg/minimap/minimap.html?lat=${lat}&lng=${lng}&zoom=16&popupWidth=200`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={`Map of ${venueName || 'venue'}`}
        />
      </div>
    </div>
  )
}

