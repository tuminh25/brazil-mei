// src/components/OneMapEmbed.tsx - FINAL VERSION
'use client';

interface OneMapEmbedProps {
  venueName: string;
  latitude?: number | null;
  longitude?: number | null;
}

export default function OneMapEmbed({ venueName, latitude, longitude }: OneMapEmbedProps) {
  // Generate URLs
  const coordinates = latitude && longitude ? `${latitude},${longitude}` : encodeURIComponent(venueName + ', Singapore');
  
  // Google Maps embed URL (NO API KEY NEEDED!)
  const googleMapsUrl = `https://maps.google.com/maps?q=${coordinates}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  // External links
  const googleMapsLink = latitude && longitude
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ', Singapore')}`;
  
  const oneMapLink = `https://www.onemap.gov.sg/main/v2/?searchVal=${encodeURIComponent(venueName)}`;

  return (
    <div className="space-y-4">
      {/* Interactive Google Maps Embed */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={googleMapsUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${venueName}`}
          allowFullScreen
        />
      </div>

      {/* Venue Info Card */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <p className="text-gray-900 font-semibold mb-1">Venue Address:</p>
            <p className="text-gray-700 mb-3">{venueName}</p>
            
            {latitude && longitude && (
              <p className="text-xs text-gray-500 mb-3">
                📐 GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <a 
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                <span>🌍</span> Open in Google Maps
              </a>
              <a 
                href={oneMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <span>🗺️</span> Open in OneMap
              </a>
              {latitude && longitude && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${latitude}, ${longitude}`);
                    alert('✅ GPS coordinates copied!');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                >
                  <span>📋</span> Copy GPS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🚇</span>
            <span className="font-semibold text-gray-900 text-sm">Nearest MRT</span>
          </div>
          <p className="text-xs text-gray-600">Find closest station on map</p>
        </div>
        
        <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🚌</span>
            <span className="font-semibold text-gray-900 text-sm">Bus Services</span>
          </div>
          <p className="text-xs text-gray-600">Multiple routes available</p>
        </div>
        
        <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🚗</span>
            <span className="font-semibold text-gray-900 text-sm">Parking</span>
          </div>
          <p className="text-xs text-gray-600">Check parking.sg app</p>
        </div>
      </div>

      {/* Getting Here Tips */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Getting Here:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• <strong>Interactive Map:</strong> Zoom & pan the map above to explore</li>
              <li>• <strong>Directions:</strong> Click &quot;Open in Google Maps&quot; for turn-by-turn navigation</li>
              <li>• <strong>Street View:</strong> Available via Google Maps for virtual preview</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
