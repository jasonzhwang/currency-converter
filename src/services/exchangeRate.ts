import { BASE_URL } from "@/data/constants";
import type { ExchangeRateResponse } from "@/types/api.types";

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;

export async function fetchExchangeRates(
  baseCurrency: string = "AUD"
): Promise<ExchangeRateResponse> {
  const url = `${BASE_URL}/latest.json?app_id=${API_KEY}&base=${baseCurrency}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    const data = await res.json();
    return { rates: data.rates, base: data.base };
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    throw error;
  }
}
