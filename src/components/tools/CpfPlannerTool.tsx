'use client';
import { useState, useMemo } from 'react';
import ToolLayout from './ToolLayout';
import InputGroup from './InputGroup';
import { projectCPF, type ProjectionParams, type CPFBalances } from '@/lib/calculators/cpf';

export default function CpfPlannerTool() {
  const [age, setAge] = useState('30');
  const [oa, setOa] = useState('20000');
  const [sa, setSa] = useState('10000');
  const [ma, setMa] = useState('5000');
  const [salary, setSalary] = useState('5000');
  const [growth, setGrowth] = useState('2');
  const [retire, setRetire] = useState('65');

  const [months, setMonths] = useState(120); // project 10 years
  const [projected, setProjected] = useState<CPFBalances[]>([]);

  const handleProject = () => {
    const params: ProjectionParams = {
      currentAge: parseInt(age),
      balances: { OA: parseFloat(oa), SA: parseFloat(sa), MA: parseFloat(ma), RA: 0 },
      monthlySalary: parseFloat(salary),
      salaryGrowth: parseFloat(growth) / 100,
      retirementAge: parseInt(retire),
      cpfLifeStartAge: 65,
    };
    setProjected(projectCPF(params, months));
  };

  const latest = projected[projected.length - 1];

  return (
    <ToolLayout
      icon="💰"
      category="Money"
      title="CPF Retirement Planner"
      description="Project your CPF OA, SA, MA and RA balances over time. Assumes standard contribution rates and interest."
      sources={[
        { label: 'CPF Contribution Rates', url: 'https://www.cpf.gov.sg/employer/employer-obligations/how-much-cpf-contributions-to-pay' },
        { label: 'CPF Retirement Sums', url: 'https://www.cpf.gov.sg/member/infohub/educational-resources/what-is-the-cpf-retirement-sum' },
      ]}
      disclaimer="Projections are illustrative and use simplified monthly compounding. Actual CPF interest crediting and allocation rules may differ. This is not financial advice."
    >
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InputGroup label="Current Age"><input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="OA Balance (S$)"><input type="number" value={oa} onChange={e => setOa(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="SA Balance (S$)"><input type="number" value={sa} onChange={e => setSa(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="MA Balance (S$)"><input type="number" value={ma} onChange={e => setMa(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Monthly Salary (S$)"><input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Annual Salary Growth (%)"><input type="number" step="0.1" value={growth} onChange={e => setGrowth(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Retirement Age"><input type="number" value={retire} onChange={e => setRetire(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
        <InputGroup label="Projection Period (months)"><input type="number" value={months} onChange={e => setMonths(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></InputGroup>
      </div>
      <button onClick={handleProject} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition mb-12">
        Project Balances
      </button>

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {(['OA','SA','MA','RA'] as const).map(acc => (
            <div key={acc} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase">{acc} Balance</div>
              <div className="text-xl font-black">${latest[acc].toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {projected.length > 0 && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 overflow-x-auto">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-widest">Projection Chart (last {months} months)</h3>
          <div className="flex gap-2">
            {(['OA','SA','MA','RA'] as const).map(acc => (
              <div key={acc} className="flex-1">
                <div className="text-xs text-gray-500 mb-2">{acc}</div>
                <div className="h-32 flex items-end">
                  {projected.map((b, i) => (
                    <div
                      key={i}
                      className="bg-blue-500/30 w-1 mx-px"
                      style={{ height: `${Math.min(100, (b[acc] / (latest?.[acc] || 1)) * 100)}%` }}
                      title={`${b[acc].toFixed(0)}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}