import { tokens } from "../../design-system";

describe("Design System Tokens", () => {
  describe("Color Tokens", () => {
    test("exports color tokens", () => {
      expect(tokens.colors).toBeDefined();
    });

    test("has primary color", () => {
      expect(tokens.colors.primary).toBe("#3b82f6");
    });

    test("has primary hover color", () => {
      expect(tokens.colors.primaryHover).toBe("#2563eb");
    });

    test("has border color", () => {
      expect(tokens.colors.border).toBe("#e5e7eb");
    });

    test("has text gray color", () => {
      expect(tokens.colors.textGray).toBe("#6b7280");
    });

    test("has text dark color", () => {
      expect(tokens.colors.textDark).toBe("#1f2937");
    });

    test("has background white color", () => {
      expect(tokens.colors.bgWhite).toBe("#ffffff");
    });

    test("has background light color", () => {
      expect(tokens.colors.bgLight).toBe("#f3f4f6");
    });

    test("has error base color", () => {
      expect(tokens.colors.errorBase).toBe("#dc2626");
    });

    test("has error light color", () => {
      expect(tokens.colors.errorLight).toBe("#fef2f2");
    });

    test("all color values are valid hex codes", () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(tokens.colors).forEach((color) => {
        expect(color).toMatch(hexRegex);
      });
    });
  });

  describe("Spacing Tokens", () => {
    test("exports spacing tokens", () => {
      expect(tokens.spacing).toBeDefined();
    });

    test("has xs spacing", () => {
      expect(tokens.spacing.xs).toBe("0.25rem");
    });

    test("has sm spacing", () => {
      expect(tokens.spacing.sm).toBe("0.5rem");
    });

    test("has md spacing", () => {
      expect(tokens.spacing.md).toBe("0.75rem");
    });

    test("has lg spacing", () => {
      expect(tokens.spacing.lg).toBe("1rem");
    });

    test("has xl spacing", () => {
      expect(tokens.spacing.xl).toBe("1.5rem");
    });

    test("has 2xl spacing", () => {
      expect(tokens.spacing["2xl"]).toBe("2rem");
    });

    test("all spacing values are valid rem units", () => {
      Object.values(tokens.spacing).forEach((space) => {
        expect(space).toMatch(/^\d+(\.\d+)?rem$/);
      });
    });
  });

  describe("Typography Tokens", () => {
    test("exports typography tokens", () => {
      expect(tokens.typography).toBeDefined();
    });

    describe("Font Sizes", () => {
      test("has font size tokens", () => {
        expect(tokens.typography.fontSizes).toBeDefined();
      });

      test("has sm font size", () => {
        expect(tokens.typography.fontSizes.sm).toBe("0.875rem");
      });

      test("has base font size", () => {
        expect(tokens.typography.fontSizes.base).toBe("1rem");
      });

      test("has lg font size", () => {
        expect(tokens.typography.fontSizes.lg).toBe("1.125rem");
      });

      test("has xl font size", () => {
        expect(tokens.typography.fontSizes.xl).toBe("1.25rem");
      });

      test("has 2xl font size", () => {
        expect(tokens.typography.fontSizes["2xl"]).toBe("1.5rem");
      });

      test("has 3xl font size", () => {
        expect(tokens.typography.fontSizes["3xl"]).toBe("1.875rem");
      });
    });

    describe("Font Weights", () => {
      test("has font weight tokens", () => {
        expect(tokens.typography.fontWeights).toBeDefined();
      });

      test("has normal font weight", () => {
        expect(tokens.typography.fontWeights.normal).toBe(400);
      });

      test("has semibold font weight", () => {
        expect(tokens.typography.fontWeights.semibold).toBe(600);
      });

      test("has bold font weight", () => {
        expect(tokens.typography.fontWeights.bold).toBe(700);
      });

      test("all font weights are valid numbers", () => {
        Object.values(tokens.typography.fontWeights).forEach((weight) => {
          expect(typeof weight).toBe("number");
          expect(weight).toBeGreaterThan(0);
          expect(weight).toBeLessThan(1000);
        });
      });
    });
  });

  describe("Breakpoints Tokens", () => {
    test("exports breakpoints tokens", () => {
      expect(tokens.breakpoints).toBeDefined();
    });

    test("has mobile breakpoint", () => {
      expect(tokens.breakpoints.mobile).toBe("640px");
    });

    test("has tablet breakpoint", () => {
      expect(tokens.breakpoints.tablet).toBe("768px");
    });

    test("has desktop breakpoint", () => {
      expect(tokens.breakpoints.desktop).toBe("1024px");
    });

    test("breakpoints are in logical order", () => {
      const mobileValue = parseInt(tokens.breakpoints.mobile);
      const tabletValue = parseInt(tokens.breakpoints.tablet);
      const desktopValue = parseInt(tokens.breakpoints.desktop);

      expect(mobileValue).toBeLessThan(tabletValue);
      expect(tabletValue).toBeLessThan(desktopValue);
    });

    test("all breakpoints are valid px units", () => {
      Object.values(tokens.breakpoints).forEach((breakpoint) => {
        expect(breakpoint).toMatch(/^\d+px$/);
      });
    });
  });

  describe("Tokens Structure", () => {
    test("tokens object has all required sections", () => {
      expect(Object.keys(tokens)).toContain("colors");
      expect(Object.keys(tokens)).toContain("spacing");
      expect(Object.keys(tokens)).toContain("typography");
      expect(Object.keys(tokens)).toContain("breakpoints");
    });

    test("tokens object is properly structured", () => {
      expect(tokens).toBeDefined();
      expect(typeof tokens).toBe("object");
      expect(Object.keys(tokens).length).toBe(4);
    });

    test("all token categories have values", () => {
      expect(Object.keys(tokens.colors).length).toBeGreaterThan(0);
      expect(Object.keys(tokens.spacing).length).toBeGreaterThan(0);
      expect(Object.keys(tokens.typography.fontSizes).length).toBeGreaterThan(0);
      expect(Object.keys(tokens.typography.fontWeights).length).toBeGreaterThan(0);
      expect(Object.keys(tokens.breakpoints).length).toBeGreaterThan(0);
    });

    test("tokens are exported correctly", () => {
      expect(tokens.colors).toEqual(expect.any(Object));
      expect(tokens.spacing).toEqual(expect.any(Object));
      expect(tokens.typography).toEqual(expect.any(Object));
      expect(tokens.breakpoints).toEqual(expect.any(Object));
    });
  });

  describe("Token Values", () => {
    test("no token values are empty strings", () => {
      const allTokens = [
        ...Object.values(tokens.colors),
        ...Object.values(tokens.spacing),
        ...Object.values(tokens.typography.fontSizes),
        ...Object.values(tokens.typography.fontWeights),
        ...Object.values(tokens.breakpoints),
      ];

      allTokens.forEach((value) => {
        if (typeof value === "string") {
          expect(value.trim()).not.toBe("");
        }
      });
    });

    test("all numeric token values are positive", () => {
      Object.values(tokens.typography.fontWeights).forEach((weight) => {
        expect(weight).toBeGreaterThan(0);
      });
    });
  });

  describe("Token Consistency", () => {
    test("primary and primary hover colors are different", () => {
      expect(tokens.colors.primary).not.toBe(tokens.colors.primaryHover);
    });

    test("text colors are different", () => {
      expect(tokens.colors.textGray).not.toBe(tokens.colors.textDark);
    });

    test("error colors are different", () => {
      expect(tokens.colors.errorBase).not.toBe(tokens.colors.errorLight);
    });

    test("all spacing values are in ascending order", () => {
      const spacingArray = [
        tokens.spacing.xs,
        tokens.spacing.sm,
        tokens.spacing.md,
        tokens.spacing.lg,
        tokens.spacing.xl,
        tokens.spacing["2xl"],
      ];

      const values = spacingArray.map((s) => parseFloat(s));
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i + 1]);
      }
    });
  });
});
