import { HistoricalPoint } from "./charts.types";

export interface InputModalProps {
  isOpen: boolean;
  currency: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ChartModalProps {
  isOpen: boolean;
  baseCurrency: string;
  targetCurrency: string;
  chartData: HistoricalPoint[];
  isLoading: boolean;
  onClose: () => void;
}
