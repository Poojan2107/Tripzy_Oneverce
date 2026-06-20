/**
 * Central exchange rate: 1 USD = 83 INR
 */
export const EXCHANGE_RATE = 83;

/**
 * Formats a given dollar price into Indian Rupees (₹).
 * Uses an exchange rate multiplier of 83x for realistic Indian pricing.
 */
export function formatINR(usdAmount: number): string {
  const inrAmount = Math.round(usdAmount * EXCHANGE_RATE);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(inrAmount);
}
