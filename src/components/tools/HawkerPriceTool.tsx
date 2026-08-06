'use client';
import { useState, useMemo } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';

type PriceEntry = {
  centre: string;
  area: string;
  dish: string;
  price: number; // SGD
  date: string; // ISO
};

const SAMPLE_DATA: PriceEntry[] = [
  { centre: 'Maxwell Food Centre', area: 'Tanjong Pagar', dish: 'Chicken Rice', price: 4.00, date: '2026-07-15' },
  { centre: 'Maxwell Food Centre', area: 'Tanjong Pagar', dish: 'Laksa', price: 4.50, date: '2026-07-15' },
  { centre: 'Chinatown Complex', area: 'Chinatown', dish: 'Chicken Rice', price: 3.80, date: '2026-07-10' },
  { centre: 'Chinatown Complex', area: 'Chinatown', dish: 'Char Kway Teow', price: 4.20, date: '2026-07-10' },
  { centre: 'Old Airport Road Food Centre', area: 'Kallang', dish: 'Hokkien Mee', price: 5.50, date: '2026-07-12' },
  { centre: 'Old Airport Road Food Centre', area: 'Kallang', dish: 'Chicken Rice', price: 4.50, date: '2026-07-12' },
  { centre: 'Tiong Bahru Market', area: 'Tiong Bahru', dish: 'Chwee Kueh', price: 2.00, date: '2026-07-14' },
  { centre: 'Tiong Bahru Market', area: 'Tiong Bahru', dish: 'Laksa', price: 4.00, date: '2026-07-14' },
  { centre: 'Amoy Street Food Centre', area: 'Tanjong Pagar', dish: 'Fish Soup', price: 5.00, date: '2026-07-16' },
  { centre: 'Amoy Street Food Centre', area: 'Tanjong Pagar', dish: 'Chicken Rice', price: 4.20, date: '2026-07-16' },
];

export default function HawkerPriceTool() {
  const [searchDish, setSearchDish] = useState('');
  const [filterArea, setFilterArea] = useState('All');

  const areas = useMemo(() => ['All', ...Array.from(new Set(SAMPLE_DATA.map(e => e.area)))], []);
  const dishes = useMemo(() => Array.from(new Set(SAMPLE_DATA.map(e => e.dish))), []);

  const filtered = useMemo(() => {
    return SAMPLE_DATA.filter(entry => {
      const matchDish = !searchDish || entry.dish.toLowerCase().includes(searchDish.toLowerCase());
      const matchArea = filterArea === 'All' || entry.area === filterArea;
      return matchDish && matchArea;
    });
  }, [searchDish, filterArea]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return { min: 0, max: 0, avg: 0 };
    const prices = filtered.map(e => e.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a,b) => a+b, 0) / prices.length,
    };
  }, [filtered]);

  return (
    <ToolLayout
      icon="🍜"
      category="Food"
      title="Hawker Price Tracker"
      description="Browse recent hawker dish prices across Singapore. Data is crowdsourced and updated periodically."
      sources={[
        { label: 'NEA Hawker Centres', url: 'https://data.gov.sg/dataset/list-of-government-markets-hawker-centres' },
        { label: 'SingStat CPI', url: 'https://www.singstat.gov.sg/find-data/explore-data-themes/economy-prices/consumer-price-index/latest-news-data' },
      ]}
      disclaimer="Prices are contributed by users and may not reflect the latest menu prices. This is not official NEA pricing data."
    >
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <InputGroup label="Search Dish">
          <input
            type="text"
            placeholder="e.g. Chicken Rice"
            value={searchDish}
            onChange={e => setSearchDish(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            list="dish-list"
          />
          <datalist id="dish-list">
            {dishes.map(d => <option key={d} value={d} />)}
          </datalist>
        </InputGroup>
        <InputGroup label="Area">
          <select
            value={filterArea}
            onChange={e => setFilterArea(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          >
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </InputGroup>
        <div className="flex items-end">
          <button onClick={() => { setSearchDish(''); setFilterArea('All'); }} className="text-blue-400 text-sm underline underline-offset-2">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Min Price</div>
            <div className="text-2xl font-black">${stats.min.toFixed(2)}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Avg Price</div>
            <div className="text-2xl font-black">${stats.avg.toFixed(2)}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Max Price</div>
            <div className="text-2xl font-black">${stats.max.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-xs">
              <th className="p-3">Hawker Centre</th>
              <th className="p-3">Area</th>
              <th className="p-3">Dish</th>
              <th className="p-3">Price (S$)</th>
              <th className="p-3">Observed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => (
              <tr key={idx} className="border-b border-white/5">
                <td className="p-3 font-medium">{entry.centre}</td>
                <td className="p-3">{entry.area}</td>
                <td className="p-3">{entry.dish}</td>
                <td className="p-3">{entry.price.toFixed(2)}</td>
                <td className="p-3 text-gray-500">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}