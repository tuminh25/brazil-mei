import { CPF_CONTRIBUTION_RATES_2026, ALLOCATION_RATES_2026, INTEREST_RATES, RETIREMENT_SUMS_2026 } from '../constants/cpfRates';

export type CPFBalances = { OA: number; SA: number; MA: number; RA: number; };
export type ProjectionParams = {
  currentAge: number;
  balances: CPFBalances;
  monthlySalary: number;
  salaryGrowth: number; // annual
  retirementAge: number;
  cpfLifeStartAge: number;
};

export function projectCPF(params: ProjectionParams, months: number = 12 * 60): CPFBalances[] {
  let b = { ...params.balances };
  const result: CPFBalances[] = [];
  for (let t = 0; t < months; t++) {
    const age = params.currentAge + t / 12;
    let wage = params.monthlySalary * Math.pow(1 + params.salaryGrowth, t / 12);
    const rateBand = getRateBand(age);
    const contrib = CPF_CONTRIBUTION_RATES_2026[rateBand as keyof typeof CPF_CONTRIBUTION_RATES_2026];
    if (!contrib) break;
    const totalCont = wage * (contrib.employer + contrib.employee);
    const alloc = ALLOCATION_RATES_2026[getAllocBand(age) as keyof typeof ALLOCATION_RATES_2026];
    if (!alloc) break;

    b.OA = b.OA * (1 + INTEREST_RATES.OA / 12) + totalCont * alloc.OA;
    b.SA = b.SA * (1 + INTEREST_RATES.SA / 12) + totalCont * alloc.SA;
    b.MA = b.MA * (1 + INTEREST_RATES.MA / 12) + totalCont * alloc.MA;

    if (Math.abs(age - 55) < 1/12) {
      const frs = RETIREMENT_SUMS_2026.FRS;
      let ra = 0;
      if (b.SA > 0) {
        const toRA = Math.min(b.SA, frs);
        ra += toRA;
        b.SA -= toRA;
      }
      if (ra < frs && b.OA > 0) {
        const toRA = Math.min(b.OA, frs - ra);
        ra += toRA;
        b.OA -= toRA;
      }
      b.RA = (b.RA || 0) + ra;
    }
    result.push({ ...b });
  }
  return result;
}

function getRateBand(age: number) {
  if (age <= 55) return '<=55';
  if (age <= 60) return '>55-60';
  if (age <= 65) return '>60-65';
  if (age <= 70) return '>65-70';
  return '>70';
}
function getAllocBand(age: number) {
  if (age <= 35) return '<=35';
  if (age <= 45) return '>35-45';
  if (age <= 50) return '>45-50';
  if (age <= 55) return '>50-55';
  if (age <= 60) return '>55-60';
  if (age <= 65) return '>60-65';
  return '>65';
}