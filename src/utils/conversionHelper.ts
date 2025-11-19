import { COUNTRY_MAP } from "@/data/constants";
import type { Conversion } from "@/types/conversion.types";

export function countryCodeFor(code: string): string {
  return (COUNTRY_MAP as Record<string, { name: string }>)[code]?.name || code;
}

export function flagImageFor(code: string): string {
  return (COUNTRY_MAP as Record<string, { image: string }>)[code]?.image || "";
}

export function formatConversions(
  currencies: string[],
  baseCurrency: string,
  rates: Record<string, number>,
  amount: number
): Record<string, Conversion> {
  return currencies.reduce(
    (acc, country) => {
      if (country !== baseCurrency && rates[country]) {
        const rate = rates[country];
        acc[country] = {
          value: amount * rate,
          rate: rate,
        };
      }
      return acc;
    },
    {} as Record<string, Conversion>
  );
}
