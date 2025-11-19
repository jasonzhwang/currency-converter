/**
 * Limit the decimal places of a number string
 * @param value - The input string (e.g., "123.456")
 * @param decimalPlaces - Maximum number of decimal places allowed
 * @returns The limited number string
 * @example
 * limitDecimalPlaces("123.4567", 4) => "123.4567"
 * limitDecimalPlaces("123.45678", 4) => "123.4567"
 */
export function limitDecimalPlaces(value: string, decimalPlaces: number): string {
  if (!value.includes(".")) {
    return value;
  }
  const [integerPart, decimalPart] = value.split(".");
  if (decimalPart.length > decimalPlaces) {
    return integerPart + "." + decimalPart.slice(0, decimalPlaces);
  }
  return value;
}
