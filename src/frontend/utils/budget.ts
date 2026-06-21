export function parseBudgetRange(range?: string): { min: number; max: number } | null {
  if (!range) return null;
  const cleaned = range.replace(/[₹,\s]/g, '');
  const parts = cleaned.split('-');
  if (parts.length !== 2) return null;
  const min = parseInt(parts[0], 10);
  const max = parseInt(parts[1], 10);
  if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) return null;
  return { min, max };
}
