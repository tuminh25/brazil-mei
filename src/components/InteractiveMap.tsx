"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  venueName: string;
  latitude?: number | null;
  longitude?: number | null;
}

export default function InteractiveMap({
  venueName,
  latitude,
  longitude,
}: InteractiveMapProps) {
  const mapId = useMemo(
    () => `map-${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    // Fix Leaflet default icon issue (Next + bundlers)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const lat = latitude ?? 1.3521;
    const lng = longitude ?? 103.8198;

    // Important: ensure container exists
    const el = document.getElementById(mapId);
    if (!el) return;

    const map = L.map(mapId, {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>${escapeHtml(venueName || "Event location")}</b>`).openPopup();

    return () => {
      map.remove();
    };
  }, [mapId, venueName, latitude, longitude]);

  const googleMapsLink =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          (venueName || "Singapore") + ", Singapore"
        )}`;

  const oneMapLink = `https://www.onemap.gov.sg/main/v2/?searchVal=${encodeURIComponent(
    venueName || "Singapore"
  )}`;

  const hasCoords = latitude != null && longitude != null;

  return (
    <div className="space-y-4">
      {/* Map */}
      <div
        id={mapId}
        className="w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
        style={{ zIndex: 0 }}
      />

      {/* Venue Info */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white font-semibold mb-1">
              Venue
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-3">
              {venueName || "Venue TBA"}
            </p>

            {hasCoords ? (
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                GPS: {latitude!.toFixed(4)}, {longitude!.toFixed(4)}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                🧭 Open in Google Maps
              </a>

              <a
                href={oneMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                🗺️ Open in OneMap
              </a>

              {hasCoords ? (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${latitude},${longitude}`);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                >
                  📌 Copy GPS
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Transport Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🚇</span>
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              Nearest MRT
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Find closest station on map.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🚌</span>
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              Bus services
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Multiple routes available.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🅿️</span>
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              Parking
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Check parking options nearby.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/40 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
              Map controls
            </h4>
            <ul className="text-xs text-gray-700 dark:text-gray-200 space-y-1">
              <li>
                <span className="font-semibold">Zoom:</span> Use +/- or mouse
                wheel.
              </li>
              <li>
                <span className="font-semibold">Pan:</span> Click and drag.
              </li>
              <li>
                <span className="font-semibold">Open directions:</span> Use the
                buttons above.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(input: string) {
  return (input || "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return ch;
    }
  });
}
