// src/components/SimpleLocationCard.tsx - NEW SIMPLE VERSION
interface SimpleLocationCardProps {
    venueName: string;
    latitude?: number | null;
    longitude?: number | null;
  }
  
  export default function SimpleLocationCard({ venueName, latitude, longitude }: SimpleLocationCardProps) {
    const googleMapsLink = latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ', Singapore')}`;
    
    const oneMapLink = `https://www.onemap.gov.sg/main/v2/?searchVal=${encodeURIComponent(venueName)}`;
  
    return (
      <div className="space-y-4">
        {/* Map Placeholder with Gradient */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="text-center text-white p-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-2">View Location on Map</h3>
              <p className="text-sm opacity-90 mb-4">Click below to open interactive map</p>
              <div className="flex gap-3 justify-center">
                <a 
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-600 text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  🌍 Open Google Maps
                </a>
                <a 
                  href={oneMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-800 text-white text-base font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
                >
                  🗺️ Open OneMap
                </a>
              </div>
            </div>
          </div>
        </div>
  
        {/* Venue Info Card */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📍</div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold mb-1">Venue Address:</p>
              <p className="text-gray-700 mb-3">{venueName}</p>
              
              {latitude && longitude && (
                <>
                  <p className="text-xs text-gray-500 mb-3">
                    📐 GPS Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${latitude}, ${longitude}`);
                      alert('✅ GPS coordinates copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                  >
                    <span>📋</span> Copy GPS Coordinates
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
  
        {/* Transport Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white border-2 border-red-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🚇</div>
            <h4 className="font-semibold text-gray-900 mb-1">By MRT</h4>
            <p className="text-sm text-gray-600">Find nearest MRT station using map</p>
          </div>
          
          <div className="p-4 bg-white border-2 border-blue-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🚌</div>
            <h4 className="font-semibold text-gray-900 mb-1">By Bus</h4>
            <p className="text-sm text-gray-600">Multiple bus routes available</p>
          </div>
          
          <div className="p-4 bg-white border-2 border-green-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🚗</div>
            <h4 className="font-semibold text-gray-900 mb-1">By Car</h4>
            <p className="text-sm text-gray-600">Parking nearby - check parking.sg</p>
          </div>
        </div>
  
        {/* Tips */}
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex items-start gap-2">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Quick Tips:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Use Google Maps or OneMap for turn-by-turn navigation</li>
                <li>• Check TransitLink for public transport schedules</li>
                <li>• Allow extra time during peak hours (7-9 AM, 5-8 PM)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  