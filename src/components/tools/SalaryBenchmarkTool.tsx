'use client';
import { useState } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';
import ResultCard from './ResultCard';

const OCCUPATIONS = [
  'Software Engineer',
  'Accountant',
  'Nurse',
  'Teacher',
  'Marketing Manager',
  'Civil Engineer',
  'Graphic Designer',
  'Data Analyst',
  'HR Manager',
  'Chef',
];

// MOM Occupational Wage Survey 2024 sample percentiles (monthly gross, SGD)
const SALARY_DATA: Record<string, { p25: number; median: number; p75: number }> = {
  'Software Engineer': { p25: 5500, median: 7200, p75: 9500 },
  'Accountant': { p25: 4200, median: 5500, p75: 7200 },
  'Nurse': { p25: 3200, median: 4200, p75: 5200 },
  'Teacher': { p25: 4000, median: 5200, p75: 6500 },
  'Marketing Manager': { p25: 6000, median: 8000, p75: 10500 },
  'Civil Engineer': { p25: 4800, median: 6200, p75: 7800 },
  'Graphic Designer': { p25: 3500, median: 4500, p75: 5800 },
  'Data Analyst': { p25: 5000, median: 6500, p75: 8500 },
  'HR Manager': { p25: 5500, median: 7200, p75: 9500 },
  'Chef': { p25: 2800, median: 3800, p75: 4800 },
};

export default function SalaryBenchmarkTool() {
  const [occupation, setOccupation] = useState('Software Engineer');
  const [salary, setSalary] = useState('7000');
  const [experience, setExperience] = useState('4-7');

  const data = SALARY_DATA[occupation];
  const userSalary = parseFloat(salary) || 0;

  const percentileEstimate = () => {
    if (!data || userSalary <= 0) return '—';
    if (userSalary < data.p25) return 'below 25th';
    if (userSalary < data.median) return 'between 25th and median';
    if (userSalary < data.p75) return 'between median and 75th';
    return 'above 75th';
  };

  return (
    <ToolLayout
      icon="💼"
      category="Work"
      title="Salary Benchmark Tool"
      description="Compare your monthly gross salary against industry percentiles based on MOM Occupational Wage Survey 2024."
      sources={[
        { label: 'MOM Occupational Wage Survey', url: 'https://stats.mom.gov.sg/bt/Pages/salary-comparison-general-for-employer.aspx' },
        { label: 'MOM income data', url: 'https://stats.mom.gov.sg/Pages/Home.aspx' },
        { label: 'MOE Graduate Employment Survey', url: 'https://data.gov.sg/dataset/graduate-employment-survey-ntu-nus-sit-smu-suss-sutd' },
      ]}
      disclaimer="Percentiles are based on full-time employed residents and may not reflect your exact peer group. Data is from 2024 OWS. Experience band is not an official salary factor in this tool."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InputGroup label="Occupation">
          <select value={occupation} onChange={e => setOccupation(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </InputGroup>
        <InputGroup label="Your Monthly Gross Salary (SGD)">
          <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
        </InputGroup>
        <InputGroup label="Years of Experience">
          <select value={experience} onChange={e => setExperience(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
            <option value="<1">&lt;1 year</option>
            <option value="1-3">1–3 years</option>
            <option value="4-7">4–7 years</option>
            <option value="8-12">8–12 years</option>
            <option value="13+">13+ years</option>
          </select>
        </InputGroup>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ResultCard label="25th Percentile" value={`$${data.p25.toLocaleString()}`} />
          <ResultCard label="Median" value={`$${data.median.toLocaleString()}`} />
          <ResultCard label="75th Percentile" value={`$${data.p75.toLocaleString()}`} />
        </div>
      )}

      {userSalary > 0 && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Position</div>
          <div className="text-2xl font-black">{
            userSalary < data.p25 ? 'Below 25th percentile' :
            userSalary < data.median ? '25th – 50th percentile' :
            userSalary < data.p75 ? '50th – 75th percentile' : 'Above 75th percentile'
          }</div>
          <div className="text-sm text-gray-400 mt-1">
            Your salary of ${userSalary.toLocaleString()} is {percentileEstimate()} compared to the surveyed population.
          </div>
        </div>
      )}
    </ToolLayout>
  );
}