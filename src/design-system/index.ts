// ==================== Design Tokens ====================
export const tokens = {
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
} as const;
