'use client';
import { useState } from 'react';
import ToolLayout from './ToolLayout';
import ResultCard from './ResultCard';
import InputGroup from './InputGroup';
import { calculateAffordability, type AffordabilityInput, type AffordabilityResult } from '@/lib/calculators/housing';
import { formatSGD } from '@/lib/utils/money';

export default function HdbAffordabilityTool() {
  const [income, setIncome] = useState('8000');
  const [age, setAge] = useState('35');
  const [flatPrice, setFlatPrice] = useState('500000');
  const [loanType, setLoanType] = useState<'HDB' | 'Bank'>('HDB');
  const [rate, setRate] = useState('2.6');
  const [tenure, setTenure] = useState('25');
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const handleCalculate = () => {
    const input: AffordabilityInput = {
      applicants: [
        {
          citizenship: 'SC',
          age: parseInt(age),
          monthlyIncome: parseFloat(income),
          firstTimer: true,
          existingProperty: false,
        },
      ],
      flat: {
        type: '4-room',
        price: parseFloat(flatPrice),
        valuation: parseFloat(flatPrice),
        purchaseType: 'BTO',
        leaseStart: '2026',
        remainingLeaseYears: 99,
      },
      cpfOaBalance: 30000,
      otherDebtsMonthly: 0,
      loanType,
      interestRate: parseFloat(rate) / 100,
      loanTenureYears: parseInt(tenure),
    };
    setResult(calculateAffordability(input));
  };

  return (
    <ToolLayout
      icon="🏠"
      category="Housing"
      title="HDB Affordability Calculator"
      description="Estimate your loan, grants, MSR/TDSR, and upfront cash for a BTO or resale flat."
      sources={[
        { label: 'HDB HFE', url: 'https://www.hdb.gov.sg/residential/buying-a-flat/hdb-flat-eligibility' },
        { label: 'MAS MSR/TDSR', url: 'https://www.mas.gov.sg/regulation/explainers/new-housing-loans/msr-and-tdsr-rules' },
      ]}
      disclaimer="All calculations are estimates. Actual eligibility and grant amounts are determined by HDB and financial institutions. This is not financial advice."
    >
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <InputGroup label="Monthly Household Income (SGD)" error={!income ? 'Required' : undefined}>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Age of youngest applicant">
          <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Flat Price (SGD)">
          <input type="number" value={flatPrice} onChange={e => setFlatPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Loan Type">
          <select value={loanType} onChange={e => setLoanType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            <option value="HDB">HDB Loan</option>
            <option value="Bank">Bank Loan</option>
          </select>
        </InputGroup>
        <InputGroup label="Interest Rate (%)">
          <input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Loan Tenure (years)">
          <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
      </div>
      <button onClick={handleCalculate} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition mb-12">
        Calculate Affordability
      </button>

      {result && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <ResultCard label="Total Grants" value={formatSGD(result.grants.total * 100)} sub="Illustrative" />
          <ResultCard label="Max Loan" value={formatSGD(result.maxLoan * 100)} />
          <ResultCard label="Est. Monthly Payment" value={formatSGD(result.monthlyPayment * 100)} />
          <ResultCard label="MSR" value={(result.msr * 100).toFixed(1) + '%'} trend={result.msrPass ? 'up' : 'down'} />
          <ResultCard label="TDSR" value={(result.tdsr * 100).toFixed(1) + '%'} trend={result.tdsrPass ? 'up' : 'down'} />
          <ResultCard label="Upfront Cash/CPF" value={formatSGD(result.upfrontCash * 100)} warning="Excludes buyer stamp duty and legal fees" />
        </div>
      )}
      {result?.warnings?.map(w => <p key={w} className="text-amber-400 text-sm mb-2">⚠️ {w}</p>)}
    </ToolLayout>
  );
}