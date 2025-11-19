export const DEFAULT_CURRENCY = "AUD";
export const DEFAULT_AMOUNT = 1000;

export const CURRENCIES = ["AUD", "USD", "EUR", "GBP", "CAD", "NZD"];

export const FLAG_IMAGE_SIZE = 20;
export const EDIT_BUTTON_SIZE = 24;
export const DECIMAL_PLACES = 4;

export const BASE_URL = "https://openexchangerates.org/api";
export const OPEN_EXCHANGE_RATES_AVAILABLE_BASE = "USD";

export const COUNTRY_MAP = {
  AUD: { name: "AU", image: "/images/au.png" },
  USD: { name: "US", image: "/images/US.png" },
  CAD: { name: "CA", image: "/images/ca.png" },
  EUR: { name: "EU", image: "/images/eu.png" },
  GBP: { name: "GB", image: "/images/uk.png" },
  NZD: { name: "NZ", image: "/images/nz.png" },
} as const;

export const EMPTY_VALUE = "—";

// ViewBox dimensions (SVG coordinate space)
export const VIEWBOX_WIDTH = 760;
export const VIEWBOX_HEIGHT = 320;

// Plot margins inside the viewBox (space for axes, labels, etc.)
export const CHART_MARGIN_LEFT = 48;
export const CHART_MARGIN_RIGHT = 16;
export const CHART_MARGIN_TOP = 16;
export const CHART_MARGIN_BOTTOM = 36;

// Chart zoom constraints
export const CHART_MIN_WINDOW_DAYS = 2;
export const CHART_DEFAULT_WINDOW_DAYS = 14;
export const CHART_ZOOM_STEP_DAYS = 2;

// Chart colors (from design system CSS variables in globals.css)
export const CHART_COLORS = {
  AXIS: "var(--chart-axis)",
  GRID: "var(--chart-grid)",
  CROSSHAIR: "var(--chart-crosshair)",
  GRADIENT_START: "rgba(59, 130, 246, 0.3)",
  GRADIENT_END: "rgba(59, 130, 246, 0)",
} as const;

// Chart messages
export const CHART_MESSAGES = {
  LOADING: "Loading chart data...",
  NO_DATA: "No chart data available",
  NO_CHART_DATA: "No data",
} as const;

// Chart UI constants
export const TOOLTIP_OFFSET_Y = 28;
export const CHART_TICK_INTERVAL = 0.01;
