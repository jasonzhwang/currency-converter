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
