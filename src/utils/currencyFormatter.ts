/**
 * Format a number as currency
 * @param value - The numeric value to format
 * @param currency - The ISO 4217 currency code (e.g., "USD", "EUR", "AUD")
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56, "USD") => "$1,234.56"
 * formatCurrency(1234.56, "EUR") => "€1,234.56"
 */
export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    // Use narrowSymbol to avoid prefixes like "CA$" / "A$" and show "$" instead
    currencyDisplay: "narrowSymbol",
  }).format(value);
}
