/**
 * Formats a given dollar price into Indian Rupees (₹).
 * Uses an exchange rate multiplier of 83x for realistic Indian pricing.
 */
export function formatINR(usdAmount: number): string {
  const inrAmount = Math.round(usdAmount * 83);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(inrAmount);
}
