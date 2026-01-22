// components/OneMapComponent.tsx - OneMap integration component
'use client';

import { useEffect, useRef, useState } from 'react';

interface OneMapComponentProps {
  latitude: number;
  longitude: number;
  venue: string;
  address?: string | null;
  zoom?: number;
  width?: string;
  height?: string;
}

export default function OneMapComponent({
  latitude,
  longitude,
  venue,
  address,
  zoom = 15,
  width = '100%',
  height = '300px'
}: OneMapComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Construct OneMap iframe URL
  const oneMapUrl = `https://www.onemap.gov.sg/amm/amm.html?mapStyle=Default&zoomLevel=${zoom}&marker=postalcode:${latitude},${longitude}:${encodeURIComponent(venue)}`;

  // Alternative: Use OneMap tile service with Leaflet
  const tileUrl = `https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png`;
  
  // Simple iframe implementation
  return (
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <iframe
          ref={iframeRef}
          src={oneMapUrl}
          width={width}
          height={height}
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title={`Map of ${venue}`}
          onLoad={() => setMapLoaded(true)}
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải bản đồ...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Venue info */}
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="font-medium text-gray-900 dark:text-white">{venue}</div>
        {address && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address}</div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </div>
    </div>
  );
}