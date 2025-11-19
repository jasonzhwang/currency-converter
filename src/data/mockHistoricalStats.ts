// Mock historical data for exchange rates over the past 14 days
// Format: { date: "YYYY-MM-DD", rate: number }

const baseRates = {
  AUD_CAD: 0.8945,
  AUD_EUR: 0.6123,
  AUD_GBP: 0.5234,
  AUD_NZD: 1.0856,
  AUD_USD: 0.6512,
};

// Generate 14 days of data with realistic fluctuations (±2-5%)
function generateHistoricalData(baseRate: number): Array<{ date: string; rate: number }> {
  const data = [];
  const startDate = new Date("2025-11-05");

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    // Add realistic daily fluctuation (±2-5%)
    const fluctuation = (Math.random() - 0.5) * 0.04 * baseRate;
    const rate = parseFloat((baseRate + fluctuation).toFixed(4));

    data.push({ date: dateString, rate });
  }

  return data;
}

// Generate all possible currency pairs (both directions)
function generateAllCurrencyPairs() {
  const currencies = ["AUD", "USD", "EUR", "GBP", "CAD", "NZD"];
  const pairs: Record<string, Array<{ date: string; rate: number }>> = {};

  // Generate AUD base pairs from baseRates
  for (const [key, rate] of Object.entries(baseRates)) {
    pairs[key] = generateHistoricalData(rate);
  }

  // Generate inverse pairs (e.g., USD_AUD from AUD_USD)
  for (const [key, rate] of Object.entries(baseRates)) {
    const [from, to] = key.split("_");
    const inverseKey = `${to}_${from}`;
    pairs[inverseKey] = generateHistoricalData(1 / rate);
  }

  // Generate cross-currency pairs (e.g., USD_EUR)
  for (let i = 0; i < currencies.length; i++) {
    for (let j = 0; j < currencies.length; j++) {
      const from = currencies[i];
      const to = currencies[j];

      if (from === to) continue; // Skip same currency
      if (pairs[`${from}_${to}`]) continue; // Already generated

      // Calculate cross rate from AUD rates
      const fromToAUD = baseRates[`AUD_${from}` as keyof typeof baseRates];
      const audToTo = baseRates[`AUD_${to}` as keyof typeof baseRates];

      if (fromToAUD && audToTo) {
        const crossRate = audToTo / fromToAUD;
        pairs[`${from}_${to}`] = generateHistoricalData(crossRate);
      }
    }
  }

  return pairs;
}

export const mockHistoricalData = generateAllCurrencyPairs();

// Helper function to get mock data for a currency pair
export function getMockHistoricalData(from: string, to: string) {
  const key = `${from}_${to}`;
  return mockHistoricalData[key] || [];
}
