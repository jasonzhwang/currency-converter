import { fetchExchangeRates } from "@/services/exchangeRate";

describe("fetchExchangeRates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches rates successfully with default base currency", async () => {
    const mockResponse = {
      rates: { AUD: 1, USD: 0.65, EUR: 0.61 },
      base: "AUD",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchExchangeRates();

    expect(result.rates.USD).toBe(0.65);
    expect(result.rates.EUR).toBe(0.61);
    expect(result.base).toBe("AUD");
    expect(global.fetch).toHaveBeenCalledWith("/api/exchange-rates?base=AUD");
  });

  test("fetches rates with custom base currency", async () => {
    const mockResponse = {
      rates: { AUD: 1.54, USD: 1, EUR: 0.94 },
      base: "USD",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchExchangeRates("USD");

    expect(global.fetch).toHaveBeenCalledWith("/api/exchange-rates?base=USD");
    expect(result.base).toBe("USD");
  });

  test("calls backend API route instead of external API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            rates: {},
            base: "AUD",
          }),
      } as Response)
    );

    await fetchExchangeRates("AUD");

    const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(callUrl).toContain("/api/exchange-rates");
    expect(callUrl).not.toContain("openexchangerates.org");
  });

  test("throws error when API returns 401 Unauthorized", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Unauthorized",
      } as Response)
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchExchangeRates("AUD")).rejects.toThrow("API error: Unauthorized");

    expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch exchange rates:", expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("throws error when API returns 404 Not Found", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Not Found",
      } as Response)
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchExchangeRates("INVALID")).rejects.toThrow("API error: Not Found");

    consoleSpy.mockRestore();
  });

  test("throws error when API returns 500 Server Error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Internal Server Error",
      } as Response)
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchExchangeRates("AUD")).rejects.toThrow("API error: Internal Server Error");

    consoleSpy.mockRestore();
  });

  test("throws error when fetch fails with network error", async () => {
    const networkError = new Error("Network error");
    global.fetch = jest.fn(() => Promise.reject(networkError));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchExchangeRates("AUD")).rejects.toThrow("Network error");

    expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch exchange rates:", networkError);

    consoleSpy.mockRestore();
  });

  test("throws error when JSON parsing fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      } as Response)
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchExchangeRates("AUD")).rejects.toThrow("Invalid JSON");

    consoleSpy.mockRestore();
  });

  test("handles all supported currencies in response", async () => {
    const mockResponse = {
      rates: {
        AUD: 1,
        USD: 0.65,
        EUR: 0.61,
        GBP: 0.52,
        CAD: 0.89,
        NZD: 1.09,
      },
      base: "AUD",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchExchangeRates("AUD");

    expect(Object.keys(result.rates)).toEqual(["AUD", "USD", "EUR", "GBP", "CAD", "NZD"]);
    expect(global.fetch).toHaveBeenCalledWith("/api/exchange-rates?base=AUD");
  });

  test("handles rate values with many decimal places", async () => {
    const mockResponse = {
      rates: {
        USD: 0.6523456789,
        EUR: 0.6120987654,
      },
      base: "AUD",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchExchangeRates("AUD");

    expect(result.rates.USD).toBeCloseTo(0.6523456789, 10);
    expect(result.rates.EUR).toBeCloseTo(0.6120987654, 10);
  });
});
