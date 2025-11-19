import { countryCodeFor, flagImageFor, formatConversions } from "@/utils/conversionHelper";
import { COUNTRY_MAP } from "@/data/constants";

describe("conversionHelper", () => {
  describe("countryCodeFor", () => {
    test("returns correct country code for AUD", () => {
      expect(countryCodeFor("AUD")).toBe("AU");
    });

    test("returns correct country code for USD", () => {
      expect(countryCodeFor("USD")).toBe("US");
    });

    test("returns correct country code for EUR", () => {
      expect(countryCodeFor("EUR")).toBe("EU");
    });

    test("returns correct country code for GBP", () => {
      expect(countryCodeFor("GBP")).toBe("GB");
    });

    test("returns correct country code for CAD", () => {
      expect(countryCodeFor("CAD")).toBe("CA");
    });

    test("returns correct country code for NZD", () => {
      expect(countryCodeFor("NZD")).toBe("NZ");
    });

    test("returns original code when currency not found", () => {
      expect(countryCodeFor("XXX")).toBe("XXX");
    });

    test("returns original code for empty string", () => {
      expect(countryCodeFor("")).toBe("");
    });

    test("handles case sensitivity", () => {
      // API is case-sensitive, lowercase won't match
      expect(countryCodeFor("aud")).toBe("aud");
    });
  });

  describe("flagImageFor", () => {
    test("returns correct flag image path for AUD", () => {
      expect(flagImageFor("AUD")).toBe("/images/au.png");
    });

    test("returns correct flag image path for USD", () => {
      expect(flagImageFor("USD")).toBe("/images/US.png");
    });

    test("returns correct flag image path for EUR", () => {
      expect(flagImageFor("EUR")).toBe("/images/eu.png");
    });

    test("returns correct flag image path for GBP", () => {
      expect(flagImageFor("GBP")).toBe("/images/uk.png");
    });

    test("returns correct flag image path for CAD", () => {
      expect(flagImageFor("CAD")).toBe("/images/ca.png");
    });

    test("returns correct flag image path for NZD", () => {
      expect(flagImageFor("NZD")).toBe("/images/nz.png");
    });

    test("returns empty string for unknown currency", () => {
      expect(flagImageFor("XXX")).toBe("");
    });

    test("returns empty string for empty input", () => {
      expect(flagImageFor("")).toBe("");
    });

    test("all defined currencies have flag images", () => {
      Object.keys(COUNTRY_MAP).forEach((currency) => {
        const imagePath = flagImageFor(currency);
        expect(imagePath).not.toBe("");
        expect(imagePath).toMatch(/\.(png|jpg|svg)$/);
      });
    });
  });

  describe("formatConversions", () => {
    test("formats conversions correctly with valid rates", () => {
      const result = formatConversions(["USD", "EUR"], "AUD", { USD: 0.65, EUR: 0.61 }, 1000);

      expect(result.USD.value).toBe(650);
      expect(result.USD.rate).toBe(0.65);
      expect(result.EUR.value).toBe(610);
      expect(result.EUR.rate).toBe(0.61);
    });

    test("excludes base currency from result", () => {
      const result = formatConversions(["AUD", "USD"], "AUD", { USD: 0.65 }, 1000);

      expect(result.AUD).toBeUndefined();
      expect(result.USD).toBeDefined();
    });

    test("ignores currencies with missing rates", () => {
      const result = formatConversions(
        ["USD", "EUR", "GBP"],
        "AUD",
        { USD: 0.65, EUR: 0.61 }, // GBP is missing
        1000
      );

      expect(result.USD).toBeDefined();
      expect(result.EUR).toBeDefined();
      expect(result.GBP).toBeUndefined();
    });

    test("handles zero amount correctly", () => {
      const result = formatConversions(["USD"], "AUD", { USD: 0.65 }, 0);

      expect(result.USD.value).toBe(0);
      expect(result.USD.rate).toBe(0.65);
    });

    test("handles very small amount correctly", () => {
      const result = formatConversions(["USD"], "AUD", { USD: 0.65 }, 0.01);

      expect(result.USD.value).toBeCloseTo(0.0065, 6);
    });

    test("handles very large amount correctly", () => {
      const result = formatConversions(["USD"], "AUD", { USD: 0.65 }, 999999999);

      expect(result.USD.value).toBeCloseTo(649999999.35, 2);
    });

    test("handles decimal rates correctly", () => {
      const result = formatConversions(["EUR"], "AUD", { EUR: 0.6123456789 }, 100);

      expect(result.EUR.value).toBeCloseTo(61.23456789, 8);
      expect(result.EUR.rate).toBeCloseTo(0.6123456789, 10);
    });

    test("returns empty object for empty currencies array", () => {
      const result = formatConversions([], "AUD", { USD: 0.65 }, 1000);
      expect(result).toEqual({});
    });

    test("returns empty object when all currencies are base currency", () => {
      const result = formatConversions(["AUD", "AUD"], "AUD", { USD: 0.65 }, 1000);
      expect(result).toEqual({});
    });

    test("handles empty rates object", () => {
      const result = formatConversions(["USD"], "AUD", {}, 1000);
      expect(result.USD).toBeUndefined();
    });

    test("processes all valid currencies", () => {
      const currencies = ["USD", "EUR", "GBP", "CAD", "NZD"];
      const rates = {
        USD: 0.65,
        EUR: 0.61,
        GBP: 0.52,
        CAD: 0.89,
        NZD: 1.09,
      };
      const result = formatConversions(currencies, "AUD", rates, 1000);

      expect(Object.keys(result)).toHaveLength(5);
      currencies.forEach((currency) => {
        expect(result[currency]).toBeDefined();
        expect(result[currency].value).toBeGreaterThan(0);
      });
    });

    test("calculates correct conversion values for negative rates (edge case)", () => {
      // Although unrealistic, should handle gracefully
      const result = formatConversions(["USD"], "AUD", { USD: -0.65 }, 1000);

      expect(result.USD.value).toBe(-650);
      expect(result.USD.rate).toBe(-0.65);
    });
  });
});
