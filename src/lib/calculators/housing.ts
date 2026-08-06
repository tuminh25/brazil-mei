import { haversineDistance } from '../utils/haversine';

export type Applicant = {
  citizenship: 'SC' | 'PR' | 'Foreigner';
  age: number;
  monthlyIncome: number; // SGD
  firstTimer: boolean;
  existingProperty: boolean;
  disposalDate?: string; // ISO date
};

export type FlatOption = {
  type: '2-room' | '3-room' | '4-room' | '5-room' | 'Executive';
  price: number;
  valuation: number;
  purchaseType: 'BTO' | 'Resale' | 'EC';
  leaseStart: string; // year
  remainingLeaseYears: number;
};

export type AffordabilityInput = {
  applicants: Applicant[];
  flat: FlatOption;
  parentsAddress?: string; // for PHG
  cpfOaBalance: number; // total
  otherDebtsMonthly: number;
  loanType: 'HDB' | 'Bank';
  interestRate: number; // annual, decimal
  loanTenureYears: number;
};

export type GrantBreakdown = {
  ehg: number;
  familyGrant: number;
  singlesGrant: number;
  phg: number;
  stepUp: number;
  total: number;
};

export type AffordabilityResult = {
  eligible: boolean;
  reasonCodes: string[];
  grants: GrantBreakdown;
  msr: number;
  msrPass: boolean;
  tdsr: number;
  tdsrPass: boolean;
  maxLoan: number;
  upfrontCash: number;
  monthlyPayment: number;
  cpfUsable: number;
  warnings: string[];
};

function computeGrants(input: AffordabilityInput): GrantBreakdown {
  const family = input.applicants.length >= 2;
  const firstTimerCount = input.applicants.filter(a => a.firstTimer).length;
  const totalIncome = input.applicants.reduce((sum, a) => sum + a.monthlyIncome, 0);
  
  let ehg = 0, familyGrant = 0, singlesGrant = 0, phg = 0, stepUp = 0;

  if (firstTimerCount > 0 && input.flat.purchaseType !== 'EC') {
    // EHG simplified tier (current as of 2026)
    if (totalIncome <= 1500) ehg = 120000;
    else if (totalIncome <= 2000) ehg = 110000;
    else if (totalIncome <= 2500) ehg = 100000;
    else if (totalIncome <= 3000) ehg = 90000;
    else if (totalIncome <= 3500) ehg = 80000;
    else if (totalIncome <= 4000) ehg = 70000;
    else if (totalIncome <= 4500) ehg = 60000;
    else if (totalIncome <= 5000) ehg = 50000;
    else if (totalIncome <= 5500) ehg = 40000;
    else if (totalIncome <= 6000) ehg = 30000;
    else if (totalIncome <= 6500) ehg = 20000;
    else if (totalIncome <= 7000) ehg = 10000;
    else if (totalIncome <= 7500) ehg = 5000;
    else if (totalIncome <= 9000 && input.flat.type === '2-room') ehg = 5000;

    // Resale family grant
    if (input.flat.purchaseType === 'Resale' && family) {
      familyGrant = firstTimerCount === 2 ? 80000 : 40000;
    }
    // Singles grant
    if (!family && input.applicants.length === 1 && input.applicants[0].age >= 35) {
      singlesGrant = input.flat.type === '5-room' ? 25000 : 40000;
    }
    // PHG placeholder (assume not eligible)
    // Step-up placeholder
  }
  return {
    ehg: ehg * firstTimerCount,
    familyGrant,
    singlesGrant: family ? 0 : singlesGrant,
    phg,
    stepUp,
    total: ehg * firstTimerCount + familyGrant + (family ? 0 : singlesGrant),
  };
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Basic eligibility checks
  const allSC = input.applicants.every(a => a.citizenship === 'SC');
  if (!allSC) reasons.push('At least one applicant is not SC – some schemes require SC household.');
  const youngest = Math.min(...input.applicants.map(a => a.age));
  if (input.applicants.length === 1 && youngest < 35) reasons.push('Single applicant must be 35 or older (or qualify under special schemes).');
  if (input.flat.purchaseType === 'EC') {
    // simplified check: EC requires SC and income ceiling
    if (input.applicants.reduce((s, a) => s + a.monthlyIncome, 0) > 16000) reasons.push('EC household income ceiling (S$16,000) exceeded.');
  }

  const grants = computeGrants(input);
  const grossMonthly = input.applicants.reduce((s, a) => s + a.monthlyIncome, 0);
  const rate = input.interestRate;
  const months = input.loanTenureYears * 12;

  // LTV
  const ltv = input.loanType === 'HDB' ? 0.80 : 0.75;
  const maxLTVLoan = input.flat.valuation * ltv;

  // Monthly payment (PMT)
  const r = rate / 12;
  const pmtFactor = r === 0 ? 1 / months : (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const monthlyPayment = maxLTVLoan * pmtFactor;

  const msr = monthlyPayment / grossMonthly;
  const tdsr = (monthlyPayment + input.otherDebtsMonthly) / grossMonthly;

  const netPrice = input.flat.price - grants.total;
  const upfrontCash = Math.max(0, netPrice - maxLTVLoan);

  warnings.push('Grant amounts are illustrative only. Actual eligibility requires HFE assessment.');
  warnings.push('CPF usage is subject to withdrawal limits and accrued interest rules – not computed here.');

  return {
    eligible: reasons.length === 0,
    reasonCodes: reasons,
    grants,
    msr,
    msrPass: msr <= 0.30,
    tdsr,
    tdsrPass: tdsr <= 0.55,
    maxLoan: maxLTVLoan,
    upfrontCash,
    monthlyPayment,
    cpfUsable: Math.min(input.cpfOaBalance, upfrontCash), // oversimplified
    warnings,
  };
}