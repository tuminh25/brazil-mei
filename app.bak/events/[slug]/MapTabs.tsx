'use client'

import { useState } from 'react'

interface MapTabsProps {
  oneMapUrl: string
  googleMapsUrl: string
  venueName: string | null
}

export default function MapTabs({ oneMapUrl, googleMapsUrl, venueName }: MapTabsProps) {
  const [activeMap, setActiveMap] = useState<'onemap' | 'google'>('onemap')

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-4">
            <button 
              onClick={() => setActiveMap('onemap')}
              className={`border-b-2 py-2 px-4 text-sm font-medium transition-colors ${
                activeMap === 'onemap' 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
              }`}
            >
              OneMap (SG)
            </button>
            <button 
              onClick={() => setActiveMap('google')}
              className={`border-b-2 py-2 px-4 text-sm font-medium transition-colors ${
                activeMap === 'google' 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
              }`}
            >
              Google Maps
            </button>
          </nav>
        </div>
      </div>

      {/* Map Iframes */}
      <div className="rounded-lg overflow-hidden shadow-md mb-4">
        {activeMap === 'onemap' && (
          <iframe 
            src={oneMapUrl}
            width="100%" 
            height="400" 
            style={{ border: 'none' }}
            loading="lazy"
            title={`Map - ${venueName} (OneMap)`}
          />
        )}
        {activeMap === 'google' && (
          <iframe 
            src={googleMapsUrl}
            width="100%" 
            height="400" 
            style={{ border: 'none' }}
            loading="lazy"
            title={`Map - ${venueName} (Google Maps)`}
          />
        )}
      </div>
    </div>
  )
}
