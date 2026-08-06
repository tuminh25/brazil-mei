export const CPF_CONTRIBUTION_RATES_2026 = {
  '<=55': { employer: 0.17, employee: 0.20 },
  '>55-60': { employer: 0.16, employee: 0.18 },
  '>60-65': { employer: 0.125, employee: 0.125 },
  '>65-70': { employer: 0.09, employee: 0.075 },
  '>70': { employer: 0.075, employee: 0.05 },
};

export const ALLOCATION_RATES_2026 = {
  '<=35': { OA: 0.6217, SA: 0.1621, MA: 0.2162 },
  '>35-45': { OA: 0.5677, SA: 0.1891, MA: 0.2432 },
  '>45-50': { OA: 0.5136, SA: 0.2162, MA: 0.2702 },
  '>50-55': { OA: 0.4055, SA: 0.3108, MA: 0.2837 },
  '>55-60': { OA: 0.3700, SA: 0.1408, MA: 0.4892 },
  '>60-65': { OA: 0.21, SA: 0.11, MA: 0.68 },
  '>65': { OA: 0.08, SA: 0.01, MA: 0.91 },
};

export const INTEREST_RATES = {
  OA: 0.025,
  SA: 0.0401,
  MA: 0.04,
  RA: 0.04,
  extra: 0.01,
};

export const RETIREMENT_SUMS_2026 = {
  BRS: 110200,
  FRS: 220400,
  ERS: 440800,
};