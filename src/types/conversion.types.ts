export interface CurrencyCardProps {
  country: string;
  baseCurrency?: string;
  amount?: number;
  conversion?: { value: number; rate: number };
  currencies?: string[];
  isBase?: boolean;
  onCurrencyChange?: (country: string) => void;
  onEditAmount: () => void;
  onViewChart?: () => void;
  formatCurrency: (value: number, currency: string) => string;
}

export interface ConversionBoardProps {
  initialBaseCurrency?: string;
  initialAmount?: number;
}

export interface Conversion {
  value: number;
  rate: number;
}
