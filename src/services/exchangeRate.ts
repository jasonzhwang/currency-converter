import type { ExchangeRateResponse } from "@/types/api.types";

export async function fetchExchangeRates(
  baseCurrency: string = "AUD"
): Promise<ExchangeRateResponse> {
  try {
    // Call our own backend API route instead of the external API directly
    // This keeps the API key safe on the server
    const res = await fetch(`/api/exchange-rates?base=${baseCurrency}`);
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
