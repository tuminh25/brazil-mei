export type TransportInput = {
  distanceKmPerTrip: number;
  tripsPerDay: number;
  workingDaysPerMonth: number;
  carPrice: number;
  coe: number;
  fuelEfficiency: number; // km/litre
  fuelPrice: number; // per litre
  parkingMonthly: number;
  insuranceYearly: number;
  maintenanceYearly: number;
  erpMonthly: number;
  ownershipMonths: number;
  residualValue: number;
};

export function calculateTransportCost(input: TransportInput) {
  const monthlyKm = input.distanceKmPerTrip * input.tripsPerDay * input.workingDaysPerMonth;
  const fuelCost = (monthlyKm / input.fuelEfficiency) * input.fuelPrice;
  const depreciation = (input.carPrice - input.residualValue) / input.ownershipMonths;
  const coeMonthly = input.coe / input.ownershipMonths;
  const insuranceMonthly = input.insuranceYearly / 12;
  const maintenanceMonthly = input.maintenanceYearly / 12;
  const carMonthly = depreciation + coeMonthly + insuranceMonthly + maintenanceMonthly + fuelCost + input.parkingMonthly + input.erpMonthly;

  // Public transport: simplified distance-based fare (capped at $3.69 for long trips)
  const ptPerTrip = Math.min(3.69, 1.0 + input.distanceKmPerTrip * 0.15);
  const ptMonthly = ptPerTrip * input.tripsPerDay * input.workingDaysPerMonth;

  const fixedCar = depreciation + coeMonthly + insuranceMonthly + maintenanceMonthly + input.parkingMonthly + input.erpMonthly;
  const variablePerKm = fuelCost / monthlyKm;
  let breakEven: number | null = null;
  if (variablePerKm > 0 && ptPerTrip > 0) {
    breakEven = (ptMonthly - fixedCar) / variablePerKm;
    if (breakEven < 0) breakEven = null;
  }

  return { ptMonthly, carMonthly, breakEven };
}