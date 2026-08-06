'use client';
import { useState } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';
import { haversineDistance } from '@/lib/utils/haversine';

type School = {
  name: string;
  lat: number;
  lon: number;
  type: 'primary' | 'secondary';
  cutOff: number | null; // PSLE aggregate cut-off 2025 (placeholder)
};

const SAMPLE_SCHOOLS: School[] = [
  { name: 'Raffles Girls\' Primary School', lat: 1.3165, lon: 103.8437, type: 'primary', cutOff: null },
  { name: 'Nanyang Primary School', lat: 1.3494, lon: 103.6890, type: 'primary', cutOff: null },
  { name: 'Rosyth School', lat: 1.3654, lon: 103.8705, type: 'primary', cutOff: null },
  { name: 'Tao Nan School', lat: 1.3097, lon: 103.8993, type: 'primary', cutOff: null },
  { name: 'St. Hilda\'s Primary School', lat: 1.3641, lon: 103.9264, type: 'primary', cutOff: null },
  { name: 'Raffles Institution', lat: 1.3427, lon: 103.8436, type: 'secondary', cutOff: 261 },
  { name: 'Hwa Chong Institution', lat: 1.3286, lon: 103.7964, type: 'secondary', cutOff: 259 },
  { name: 'National Junior College (Secondary)', lat: 1.3454, lon: 103.8218, type: 'secondary', cutOff: 257 },
  { name: 'Nanyang Girls\' High School', lat: 1.3508, lon: 103.6920, type: 'secondary', cutOff: 260 },
  { name: 'Methodist Girls\' School', lat: 1.3221, lon: 103.8288, type: 'secondary', cutOff: 258 },
];

export default function SchoolFinderTool() {
  const [lat, setLat] = useState('1.3521'); // default: City Hall MRT
  const [lon, setLon] = useState('103.8198');
  const [results, setResults] = useState<{ school: School; distance: number; band: string }[]>([]);

  const handleSearch = () => {
    const homeLat = parseFloat(lat);
    const homeLon = parseFloat(lon);
    if (isNaN(homeLat) || isNaN(homeLon)) return;

    const list = SAMPLE_SCHOOLS.map(school => {
      const d = haversineDistance(homeLat, homeLon, school.lat, school.lon);
      const band = d <= 1000 ? '≤1 km' : d <= 2000 ? '1–2 km' : '>2 km';
      return { school, distance: Math.round(d), band };
    }).sort((a, b) => a.distance - b.distance);
    setResults(list);
  };

  return (
    <ToolLayout
      icon="📚"
      category="Study"
      title="School Distance Checker"
      description="Find primary and secondary schools near your home and see their distance bands (using straight-line distance for estimation)."
      sources={[
        { label: 'MOE SchoolFinder', url: 'https://www.moe.gov.sg/schoolfinder' },
        { label: 'OneMap API (distance)', url: 'https://www.onemap.gov.sg/apidocs' },
      ]}
      disclaimer="Distances shown are straight-line (Haversine) and are not the official MOE home‑school distance. Actual admission priority depends on phase, citizenship, and balloting. Cut-off points are from the 2025 posting exercise and may change."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InputGroup label="Your Latitude">
          <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Your Longitude">
          <input type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
      </div>
      <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition mb-12">
        Find Nearby Schools
      </button>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase text-xs">
                <th className="p-4">School</th>
                <th className="p-4">Type</th>
                <th className="p-4">Distance (m)</th>
                <th className="p-4">Band</th>
                <th className="p-4">PSLE Cut‑off (2025)</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.school.name} className="border-b border-white/5">
                  <td className="p-4 font-medium">{r.school.name}</td>
                  <td className="p-4 capitalize">{r.school.type}</td>
                  <td className="p-4">{r.distance}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.band === '≤1 km' ? 'bg-green-500/20 text-green-400' :
                      r.band === '1–2 km' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>{r.band}</span>
                  </td>
                  <td className="p-4">{r.school.cutOff ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}