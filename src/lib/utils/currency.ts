export function formatCurrency(amount: number | string | undefined | null): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(num) || num === undefined || num === null) return 'LKR 0.00';
  return `LKR ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const CURRENCY_CODE = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';
