export interface HistoricalPoint {
  date: string;
  rate: number;
}

export interface ChartModalProps {
  isOpen: boolean;
  baseCurrency: string;
  targetCurrency: string;
  chartData: HistoricalPoint[];
  isLoading: boolean;
  onClose: () => void;
}

export interface LineChartProps {
  data: HistoricalPoint[];
  currency: string;
  baseCurrency: string;
  onHover?: (
    pt: (HistoricalPoint & { x: number; y: number; domX: number; domY: number }) | null
  ) => void;
  onZoom?: (direction: "in" | "out") => void;
}

export interface ChartHover {
  vx: number; // viewBox x
  vy: number; // viewBox y
  domX: number; // pixel x in container
  domY: number; // pixel y in container
  date: string;
  rate: number;
}

export interface UseLineChartInteractionParams {
  data: HistoricalPoint[];
  containerRef: React.RefObject<HTMLDivElement>;
  onHover?: (
    pt: (HistoricalPoint & { x: number; y: number; domX: number; domY: number }) | null
  ) => void;
  onZoom?: (direction: "in" | "out") => void;
}
