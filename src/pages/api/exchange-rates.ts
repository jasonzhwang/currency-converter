import type { NextApiRequest, NextApiResponse } from "next";
import type { ExchangeRateResponse } from "@/types/api.types";

const API_KEY = process.env.EXCHANGE_API_KEY;
const BASE_URL = "https://openexchangerates.org/api";

type ResponseData = ExchangeRateResponse | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { base = "AUD" } = req.query;

  // Validate base currency parameter
  if (typeof base !== "string" || !base) {
    return res.status(400).json({ error: "Invalid base currency" });
  }

  // Check if API key is configured
  if (!API_KEY) {
    console.error("EXCHANGE_API_KEY environment variable is not set");
    return res.status(500).json({ error: "Server configuration error: API key not set" });
  }

  try {
    const url = `${BASE_URL}/latest.json?app_id=${API_KEY}&base=${base}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json({ rates: data.rates, base: data.base });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
}
