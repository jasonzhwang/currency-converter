/**
 * Sanitize input string and parse as number
 * Removes all non-numeric characters except decimal point
 * @param input - The input string to sanitize
 * @returns Parsed number, or null if unable to parse
 * @example
 * sanitizeAndParseNumber("12.34") => 12.34
 * sanitizeAndParseNumber("abc123.45") => 123.45
 * sanitizeAndParseNumber("invalid") => null
 */
export function sanitizeAndParseNumber(input: string): number | null {
  const sanitized = input.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? null : parsed;
}
