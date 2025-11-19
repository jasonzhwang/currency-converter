import { sanitizeAndParseNumber } from "@/utils/inputHelper";

describe("sanitizeAndParseNumber", () => {
  describe("basic functionality", () => {
    it("should parse valid number strings", () => {
      expect(sanitizeAndParseNumber("123")).toBe(123);
    });

    it("should parse decimal numbers", () => {
      expect(sanitizeAndParseNumber("123.45")).toBe(123.45);
    });

    it("should remove non-numeric characters except decimal", () => {
      expect(sanitizeAndParseNumber("abc123.45def")).toBe(123.45);
    });

    it("should handle currency symbols", () => {
      expect(sanitizeAndParseNumber("$1,234.56")).toBe(1234.56);
    });

    it("should handle spaces", () => {
      expect(sanitizeAndParseNumber("1 234 567")).toBe(1234567);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(sanitizeAndParseNumber("")).toBeNull();
    });

    it("should handle string with only non-numeric characters", () => {
      expect(sanitizeAndParseNumber("abc")).toBeNull();
    });

    it("should handle leading zeros", () => {
      expect(sanitizeAndParseNumber("00123.45")).toBe(123.45);
    });

    it("should handle multiple decimal points (takes first valid)", () => {
      // JavaScript parseFloat behavior: "123.45.67" becomes 123.45
      expect(sanitizeAndParseNumber("123.45.67")).toBe(123.45);
    });

    it("should handle zero", () => {
      expect(sanitizeAndParseNumber("0")).toBe(0);
    });

    it("should handle decimal zero", () => {
      expect(sanitizeAndParseNumber("0.0")).toBe(0);
    });
  });

  describe("negative numbers", () => {
    it("should remove negative sign (only keeps digits and decimal)", () => {
      // sanitizeAndParseNumber removes ALL non-numeric chars, so "-" is removed
      expect(sanitizeAndParseNumber("-123")).toBe(123);
    });

    it("should remove negative sign from non-first position", () => {
      // Negative sign is also removed like other non-numeric characters
      expect(sanitizeAndParseNumber("123-45")).toBe(12345);
    });

    it("should handle minus with currency symbol", () => {
      // All non-numeric chars (except decimal) are removed
      expect(sanitizeAndParseNumber("-$1,234.56")).toBe(1234.56);
    });
  });

  describe("large and small numbers", () => {
    it("should handle very large numbers", () => {
      expect(sanitizeAndParseNumber("999999999.99")).toBe(999999999.99);
    });

    it("should handle very small decimal", () => {
      expect(sanitizeAndParseNumber("0.0001")).toBe(0.0001);
    });

    it("should handle numbers with many decimal places", () => {
      expect(sanitizeAndParseNumber("123.123456789")).toBe(123.123456789);
    });
  });

  describe("user input scenarios", () => {
    it("should handle currency input with all symbols", () => {
      expect(sanitizeAndParseNumber("USD $1,234.56")).toBe(1234.56);
    });

    it("should handle accidentally pasted input with extra text", () => {
      expect(sanitizeAndParseNumber("Price: $500.00")).toBe(500);
    });

    it("should handle whitespace-heavy input", () => {
      expect(sanitizeAndParseNumber("   123.45   ")).toBe(123.45);
    });

    it("should handle only decimal point", () => {
      expect(sanitizeAndParseNumber(".")).toBeNull();
    });

    it("should handle leading decimal point", () => {
      expect(sanitizeAndParseNumber(".123")).toBe(0.123);
    });
  });
});
