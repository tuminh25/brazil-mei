'use client';
import { useState, useMemo } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';
import { haversineDistance } from '@/lib/utils/haversine';

type Facility = {
  name: string;
  type: 'GP' | 'Polyclinic' | 'Hospital' | 'Dental';
  lat: number;
  lon: number;
  chas: boolean;
  subsidy: 'public' | 'private' | null;
  specialty: string[];
};

const SAMPLE_FACILITIES: Facility[] = [
  { name: 'Singapore General Hospital', type: 'Hospital', lat: 1.2808, lon: 103.8342, chas: false, subsidy: 'public', specialty: ['Emergency', 'General Medicine', 'Surgery'] },
  { name: 'National University Hospital', type: 'Hospital', lat: 1.2950, lon: 103.7807, chas: false, subsidy: 'public', specialty: ['Emergency', 'Paediatrics'] },
  { name: 'Raffles Medical (Changi Airport)', type: 'GP', lat: 1.3588, lon: 103.9895, chas: true, subsidy: null, specialty: ['GP'] },
  { name: 'Polyclinic @ Outram', type: 'Polyclinic', lat: 1.2819, lon: 103.8367, chas: true, subsidy: 'public', specialty: ['Family Medicine'] },
  { name: 'Unity Denticare (Jurong East)', type: 'Dental', lat: 1.3329, lon: 103.7436, chas: true, subsidy: 'public', specialty: ['General Dentistry'] },
  { name: 'Mount Elizabeth Hospital', type: 'Hospital', lat: 1.3053, lon: 103.8330, chas: false, subsidy: null, specialty: ['Cardiology', 'Oncology'] },
  { name: 'Central 24-HR Clinic (Hougang)', type: 'GP', lat: 1.3704, lon: 103.8932, chas: true, subsidy: null, specialty: ['GP', 'Minor Surgery'] },
];

export default function ClinicFinderTool() {
  const [lat, setLat] = useState('1.3521');
  const [lon, setLon] = useState('103.8198');
  const [typeFilter, setTypeFilter] = useState('All');
  const [chasOnly, setChasOnly] = useState(false);
  const [results, setResults] = useState<{ facility: Facility; distance: number }[]>([]);

  const types = ['All', ...Array.from(new Set(SAMPLE_FACILITIES.map(f => f.type)))];

  const handleSearch = () => {
    const homeLat = parseFloat(lat);
    const homeLon = parseFloat(lon);
    if (isNaN(homeLat) || isNaN(homeLon)) return;

    const filtered = SAMPLE_FACILITIES.filter(f => {
      if (typeFilter !== 'All' && f.type !== typeFilter) return false;
      if (chasOnly && !f.chas) return false;
      return true;
    }).map(f => ({
      facility: f,
      distance: Math.round(haversineDistance(homeLat, homeLon, f.lat, f.lon)),
    })).sort((a, b) => a.distance - b.distance);

    setResults(filtered);
  };

  return (
    <ToolLayout
      icon="🏥"
      category="Healthcare"
      title="Clinic & Hospital Finder"
      description="Locate GP clinics, polyclinics, hospitals, and dental clinics near you. Filter by type and CHAS subsidy."
      sources={[
        { label: 'MOH Health Facilities', url: 'https://www.moh.gov.sg/others/resources-and-statistics/health-facilities/' },
        { label: 'CHAS Clinics (data.gov.sg)', url: 'https://gbbp.data.gov.sg/datasets?agencies=Ministry+of+Health+(MOH)&resultId=512' },
        { label: 'OneMap API', url: 'https://www.onemap.gov.sg/apidocs' },
      ]}
      disclaimer="Facility data is a limited sample. Always verify opening hours and availability directly with the provider. This tool does not provide medical advice."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <InputGroup label="Your Latitude"><input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Your Longitude"><input type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Facility Type">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </InputGroup>
        <div className="flex items-end mb-1">
          <label className="flex items-center gap-3 cursor-pointer bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            <input type="checkbox" checked={chasOnly} onChange={e => setChasOnly(e.target.checked)} className="accent-blue-500" />
            <span className="text-sm">CHAS participating only</span>
          </label>
        </div>
      </div>
      <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition mb-12">
        Find Facilities
      </button>

      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((r, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{r.facility.name}</h3>
                <div className="text-xs text-gray-400 mt-1">{r.facility.type} · {r.facility.subsidy ?? 'Private'} · {r.facility.chas ? 'CHAS' : 'Non-CHAS'}</div>
                <div className="text-xs text-gray-500 mt-1">Specialties: {r.facility.specialty.join(', ')}</div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <span className="text-2xl font-black">{r.distance} m</span>
                <div className="text-xs text-gray-500">straight-line distance</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}