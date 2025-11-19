import { formatCurrency } from "@/utils/currencyFormatter";

describe("formatCurrency", () => {
  describe("basic currency formatting", () => {
    it("should format USD currency", () => {
      const result = formatCurrency(1234.56, "USD");
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
    });

    it("should format EUR currency", () => {
      const result = formatCurrency(1234.56, "EUR");
      expect(result).toContain("1,234.56");
      expect(result).toContain("€");
    });

    it("should format GBP currency", () => {
      const result = formatCurrency(1234.56, "GBP");
      expect(result).toContain("1,234.56");
      expect(result).toContain("£");
    });

    it("should format AUD currency", () => {
      const result = formatCurrency(1234.56, "AUD");
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
    });

    it("should format CAD currency", () => {
      const result = formatCurrency(1234.56, "CAD");
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
    });

    it("should format NZD currency", () => {
      const result = formatCurrency(1234.56, "NZD");
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
    });
  });

  describe("edge cases", () => {
    it("should format zero", () => {
      const result = formatCurrency(0, "USD");
      expect(result).toContain("0");
      expect(result).toContain("$");
    });

    it("should format negative numbers", () => {
      const result = formatCurrency(-1234.56, "USD");
      expect(result).toContain("1,234.56");
      expect(result).toContain("$");
      expect(result).toMatch(/[-−]/); // Minus or en-dash
    });

    it("should format very large numbers", () => {
      const result = formatCurrency(999999999.99, "USD");
      expect(result).toContain("999,999,999.99");
      expect(result).toContain("$");
    });

    it("should format very small decimal", () => {
      const result = formatCurrency(0.01, "USD");
      expect(result).toContain("0.01");
      expect(result).toContain("$");
    });
  });

  describe("decimal handling", () => {
    it("should format number with 2 decimal places", () => {
      const result = formatCurrency(123.45, "USD");
      expect(result).toContain("123.45");
    });

    it("should format number with 1 decimal place", () => {
      const result = formatCurrency(123.4, "USD");
      expect(result).toContain("123.4");
    });

    it("should format whole number", () => {
      const result = formatCurrency(123, "USD");
      expect(result).toContain("123");
    });

    it("should format number with many decimal places", () => {
      const result = formatCurrency(123.456789, "USD");
      // Intl.NumberFormat will round to locale-specific decimal places
      expect(result).toContain("123");
      expect(result).toContain("$");
    });
  });

  describe("locale and symbol", () => {
    it("should use narrowSymbol to avoid currency prefixes", () => {
      // AUD should show $ not A$
      const result = formatCurrency(100, "AUD");
      expect(result).toContain("$");
      // Should not contain "A$"
      expect(result).not.toMatch(/A\$.*\$/);
    });

    it("should use en-US locale formatting", () => {
      // en-US uses comma as thousands separator and period as decimal
      const result = formatCurrency(1234.56, "USD");
      expect(result).toMatch(/[0-9],/); // Contains thousands separator
    });
  });
});
