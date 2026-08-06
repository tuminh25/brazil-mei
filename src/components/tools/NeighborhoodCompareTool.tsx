'use client';
import { useState } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';

type Neighborhood = {
  name: string;
  affordability: number;
  transport: number;
  schools: number;
  healthcare: number;
  parks: number;
  amenities: number;
  safety: number;
};

const NEIGHBORHOODS: Neighborhood[] = [
  { name: 'Tiong Bahru', affordability: 65, transport: 85, schools: 70, healthcare: 80, parks: 60, amenities: 90, safety: 85 },
  { name: 'Tampines', affordability: 80, transport: 80, schools: 75, healthcare: 70, parks: 70, amenities: 85, safety: 80 },
  { name: 'Jurong East', affordability: 85, transport: 75, schools: 65, healthcare: 75, parks: 65, amenities: 80, safety: 75 },
  { name: 'Serangoon', affordability: 70, transport: 80, schools: 80, healthcare: 65, parks: 55, amenities: 85, safety: 80 },
  { name: 'Bukit Timah', affordability: 40, transport: 60, schools: 90, healthcare: 70, parks: 90, amenities: 70, safety: 90 },
  { name: 'Woodlands', affordability: 90, transport: 65, schools: 60, healthcare: 60, parks: 75, amenities: 80, safety: 75 },
];

const METRICS = [
  { key: 'affordability', label: 'Affordability' },
  { key: 'transport', label: 'Transport' },
  { key: 'schools', label: 'Schools' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'parks', label: 'Parks & Greenery' },
  { key: 'amenities', label: 'Amenities/Food' },
  { key: 'safety', label: 'Safety' },
];

export default function NeighborhoodCompareTool() {
  const [a, setA] = useState(NEIGHBORHOODS[0].name);
  const [b, setB] = useState(NEIGHBORHOODS[1].name);

  const neighborhoodA = NEIGHBORHOODS.find(n => n.name === a)!;
  const neighborhoodB = NEIGHBORHOODS.find(n => n.name === b)!;

  const composite = (n: Neighborhood) =>
    (n.affordability * 0.25 + n.transport * 0.2 + n.schools * 0.15 + n.healthcare * 0.1 + n.parks * 0.1 + n.amenities * 0.15 + n.safety * 0.05).toFixed(1);

  return (
    <ToolLayout
      icon="🗺️"
      category="Neighborhood"
      title="Neighborhood Comparison"
      description="Compare key quality-of-life scores across two neighborhoods. All scores are on a 0–100 scale (higher is better)."
      sources={[
        { label: 'URA Planning Areas', url: 'https://www.ura.gov.sg/maps/' },
        { label: 'SingStat Geographic Distribution', url: 'https://www.singstat.gov.sg/find-data/explore-data-themes/population/geographic-distribution/latest-news-data' },
        { label: 'data.gov.sg datasets', url: 'https://data.gov.sg' },
      ]}
      disclaimer="Scores are derived from public data and community feedback. They are not official rankings. Safety score is a placeholder unless official crime data is published at the planning-area level."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InputGroup label="Neighborhood A">
          <select value={a} onChange={e => setA(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            {NEIGHBORHOODS.map(n => <option key={n.name}>{n.name}</option>)}
          </select>
        </InputGroup>
        <InputGroup label="Neighborhood B">
          <select value={b} onChange={e => setB(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            {NEIGHBORHOODS.map(n => <option key={n.name}>{n.name}</option>)}
          </select>
        </InputGroup>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Side-by-side comparison */}
        {[neighborhoodA, neighborhoodB].map((n, i) => (
          <div key={i} className="space-y-4">
            <h2 className="text-2xl font-black">{n.name}</h2>
            <div className="text-sm text-gray-400">Composite Score: <span className="text-white font-bold">{composite(n)}</span></div>
            {METRICS.map(m => (
              <div key={m.key} className="space-y-1">
                <div className="flex justify-between text-xs uppercase text-gray-500">
                  <span>{m.label}</span>
                  <span>{n[m.key as keyof Neighborhood]}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${n[m.key as keyof Neighborhood]}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}