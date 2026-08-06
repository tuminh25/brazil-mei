'use client';
import { useState } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';
import ResultCard from './ResultCard';
import { calculateTransportCost, type TransportInput } from '@/lib/calculators/transport';

export default function TransportCostTool() {
  const [distance, setDistance] = useState('20'); // km one-way
  const [carPrice, setCarPrice] = useState('120000');
  const [coe, setCoe] = useState('80000');
  const [fuelEfficiency, setFuelEfficiency] = useState('15'); // km/l
  const [fuelPrice, setFuelPrice] = useState('2.80');
  const [parking, setParking] = useState('300');
  const [insurance, setInsurance] = useState('1500');
  const [maintenance, setMaintenance] = useState('1200');
  const [erp, setErp] = useState('100');
  const [ownershipMonths, setOwnershipMonths] = useState('120');
  const [residual, setResidual] = useState('20000');

  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const input: TransportInput = {
      distanceKmPerTrip: parseFloat(distance),
      tripsPerDay: 2,
      workingDaysPerMonth: 22,
      carPrice: parseFloat(carPrice),
      coe: parseFloat(coe),
      fuelEfficiency: parseFloat(fuelEfficiency),
      fuelPrice: parseFloat(fuelPrice),
      parkingMonthly: parseFloat(parking),
      insuranceYearly: parseFloat(insurance),
      maintenanceYearly: parseFloat(maintenance),
      erpMonthly: parseFloat(erp),
      ownershipMonths: parseInt(ownershipMonths),
      residualValue: parseFloat(residual),
    };
    setResult(calculateTransportCost(input));
  };

  return (
    <ToolLayout
      icon="🚇"
      category="Transport"
      title="Transport Cost Calculator"
      description="Compare monthly costs of public transport vs car ownership for your daily commute."
      sources={[
        { label: 'LTA Fares & ERP', url: 'https://www.lta.gov.sg/content/ltagov/en/getting_around/public_transport/plan_your_journey.html' },
        { label: 'OneMap Routing', url: 'https://www.onemap.gov.sg/apidocs/routing' },
        { label: 'MoneySense Car Cost', url: 'https://www.moneysense.gov.sg' },
      ]}
      disclaimer="Costs are estimates based on user inputs. Public transport fares are approximate and do not account for concessions, peak/off-peak, or transfers. Actual costs may vary."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InputGroup label="One-way distance (km)"><input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Car Price (S$)"><input type="number" value={carPrice} onChange={e => setCarPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="COE (S$)"><input type="number" value={coe} onChange={e => setCoe(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Fuel Efficiency (km/l)"><input type="number" step="0.1" value={fuelEfficiency} onChange={e => setFuelEfficiency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Fuel Price (S$/l)"><input type="number" step="0.01" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Monthly Parking (S$)"><input type="number" value={parking} onChange={e => setParking(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Annual Insurance (S$)"><input type="number" value={insurance} onChange={e => setInsurance(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Annual Maintenance (S$)"><input type="number" value={maintenance} onChange={e => setMaintenance(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Monthly ERP (S$)"><input type="number" value={erp} onChange={e => setErp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Ownership (months)"><input type="number" value={ownershipMonths} onChange={e => setOwnershipMonths(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Residual Value (S$)"><input type="number" value={residual} onChange={e => setResidual(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
      </div>
      <button onClick={handleCalculate} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition mb-12">
        Compare
      </button>

      {result && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ResultCard label="Public Transport (monthly)" value={`$${result.ptMonthly.toFixed(2)}`} />
          <ResultCard label="Car (monthly)" value={`$${result.carMonthly.toFixed(2)}`} />
          <ResultCard label="Break-even distance (km)" value={result.breakEven ? `${result.breakEven.toFixed(0)} km` : 'Never'} />
          <ResultCard label="Car cheaper by" value={`$${Math.max(0, result.ptMonthly - result.carMonthly).toFixed(2)}`} sub={result.carMonthly < result.ptMonthly ? 'Car wins' : 'PT wins'} />
        </div>
      )}
    </ToolLayout>
  );
}