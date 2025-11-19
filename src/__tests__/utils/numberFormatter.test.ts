import { limitDecimalPlaces } from "@/utils/numberFormatter";

describe("limitDecimalPlaces", () => {
  describe("basic functionality", () => {
    it("should limit decimal places correctly", () => {
      expect(limitDecimalPlaces("123.456789", 4)).toBe("123.4567");
    });

    it("should not modify when decimal places are within limit", () => {
      expect(limitDecimalPlaces("123.45", 4)).toBe("123.45");
    });

    it("should return value unchanged if no decimal point", () => {
      expect(limitDecimalPlaces("12345", 4)).toBe("12345");
    });
  });

  describe("edge cases", () => {
    it("should handle zero decimal places", () => {
      expect(limitDecimalPlaces("123.456", 0)).toBe("123.");
    });

    it("should handle single decimal place", () => {
      expect(limitDecimalPlaces("123.456", 1)).toBe("123.4");
    });

    it("should handle empty string", () => {
      expect(limitDecimalPlaces("", 4)).toBe("");
    });

    it("should handle only decimal point", () => {
      expect(limitDecimalPlaces(".", 4)).toBe(".");
    });

    it("should handle leading decimal point", () => {
      expect(limitDecimalPlaces(".123456", 4)).toBe(".1234");
    });

    it("should handle trailing zeros", () => {
      expect(limitDecimalPlaces("123.4560", 4)).toBe("123.4560");
    });
  });

  describe("large numbers", () => {
    it("should handle large integers with decimals", () => {
      expect(limitDecimalPlaces("999999999.123456789", 4)).toBe("999999999.1234");
    });

    it("should handle very long decimal part", () => {
      expect(limitDecimalPlaces("1.123456789101112131415", 6)).toBe("1.123456");
    });
  });

  describe("special numeric formats", () => {
    it("should handle scientific notation string by processing as regular string", () => {
      // The function processes "1.5e10" and finds decimal, splits by it
      // integerPart="1", decimalPart="5e10"
      // With limit 2, returns "1.5e"
      expect(limitDecimalPlaces("1.5e10", 2)).toBe("1.5e");
    });

    it("should handle negative numbers", () => {
      expect(limitDecimalPlaces("-123.456789", 4)).toBe("-123.4567");
    });
  });
});
