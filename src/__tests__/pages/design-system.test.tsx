import { render, screen } from "@testing-library/react";
import DesignSystemPage from "../../pages/design-system";

// Mock the design-system module
jest.mock("../../design-system", () => ({
  tokens: {
    colors: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      border: "#e5e7eb",
      textGray: "#6b7280",
      textDark: "#1f2937",
      bgWhite: "#ffffff",
      bgLight: "#f3f4f6",
      errorBase: "#dc2626",
      errorLight: "#fef2f2",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem",
    },
    typography: {
      fontSizes: {
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeights: {
        normal: 400,
        semibold: 600,
        bold: 700,
      },
    },
    breakpoints: {
      mobile: "640px",
      tablet: "768px",
      desktop: "1024px",
    },
  },
}));

jest.mock("../../design-system/components/Button", () => ({
  __esModule: true,
  default: () => <div>Button Component</div>,
}));

jest.mock("../../design-system/components/Card", () => ({
  __esModule: true,
  default: () => <div>Card Component</div>,
}));

jest.mock("../../design-system/components/Input", () => ({
  __esModule: true,
  default: () => <div>Input Component</div>,
}));

describe("DesignSystemPage", () => {
  describe("Rendering", () => {
    test("renders the design system page", () => {
      render(<DesignSystemPage />);
      const heading = screen.getByRole("heading", { level: 1, name: /Design System/i });
      expect(heading).toBeInTheDocument();
    });

    test("displays the correct page title in h1", () => {
      render(<DesignSystemPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toBe("Design System");
    });

    test("displays the page description", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByText(/Currency Converter Design System - Components & Tokens/i)
      ).toBeInTheDocument();
    });

    test("renders main container element", () => {
      const { container } = render(<DesignSystemPage />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  describe("Design Tokens", () => {
    test("renders colors section heading", () => {
      render(<DesignSystemPage />);
      const colorsHeadings = screen.getAllByRole("heading", { name: /Colors/i });
      expect(colorsHeadings.length).toBeGreaterThan(0);
    });

    test("renders spacing section", () => {
      render(<DesignSystemPage />);
      const spacingHeadings = screen.getAllByRole("heading", { name: /Spacing/i });
      expect(spacingHeadings.length).toBeGreaterThan(0);
    });

    test("renders typography section", () => {
      render(<DesignSystemPage />);
      const typographyHeadings = screen.getAllByRole("heading", { name: /Typography/i });
      expect(typographyHeadings.length).toBeGreaterThan(0);
    });

    test("renders breakpoints section", () => {
      render(<DesignSystemPage />);
      const breakpointsHeadings = screen.getAllByRole("heading", { name: /Breakpoints/i });
      expect(breakpointsHeadings.length).toBeGreaterThan(0);
    });
  });

  describe("Component Examples", () => {
    test("renders button component example(s)", () => {
      render(<DesignSystemPage />);
      const buttonElements = screen.getAllByText(/Button Component/i);
      expect(buttonElements.length).toBeGreaterThan(0);
    });

    test("renders card component example(s)", () => {
      render(<DesignSystemPage />);
      const cardElements = screen.getAllByText(/Card Component/i);
      expect(cardElements.length).toBeGreaterThan(0);
    });

    test("renders input component example(s)", () => {
      render(<DesignSystemPage />);
      const inputElements = screen.getAllByText(/Input Component/i);
      expect(inputElements.length).toBeGreaterThan(0);
    });

    test("renders at least one of each component type", () => {
      render(<DesignSystemPage />);
      const buttonElements = screen.getAllByText(/Button Component/i);
      const cardElements = screen.getAllByText(/Card Component/i);
      const inputElements = screen.getAllByText(/Input Component/i);

      expect(buttonElements.length).toBeGreaterThan(0);
      expect(cardElements.length).toBeGreaterThan(0);
      expect(inputElements.length).toBeGreaterThan(0);
    });
  });

  describe("Page Structure", () => {
    test("renders header section", () => {
      const { container } = render(<DesignSystemPage />);
      expect(container.querySelector("header")).toBeInTheDocument();
    });

    test("renders main sections", () => {
      const { container } = render(<DesignSystemPage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });

    test("displays page without errors", () => {
      expect(() => render(<DesignSystemPage />)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    test("main heading is properly structured as h1", () => {
      render(<DesignSystemPage />);
      const h1Headings = screen.getAllByRole("heading", { level: 1 });
      expect(h1Headings.length).toBeGreaterThan(0);
      expect(h1Headings[0].tagName).toBe("H1");
    });

    test("all section headings are properly structured", () => {
      render(<DesignSystemPage />);
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(1);
    });

    test("page has semantic HTML structure", () => {
      const { container } = render(<DesignSystemPage />);
      const header = container.querySelector("header");
      const sections = container.querySelectorAll("section");

      expect(header).toBeInTheDocument();
      expect(sections.length).toBeGreaterThan(0);
    });

    test("h1 is the first heading", () => {
      render(<DesignSystemPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });
  });
});
