export function formatSGD(cents: number): string {
  return (cents / 100).toLocaleString('en-SG', {
    style: 'currency',
    currency: 'SGD',
  });
}

export function parseCurrency(value: string): number | null {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : Math.round(num * 100);
}