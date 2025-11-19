import { useState, useEffect } from "react";
import CurrencyCard from "@/components/CurrencyCard";
import styles from "./ConversionBoard.module.scss";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_AMOUNT,
  OPEN_EXCHANGE_RATES_AVAILABLE_BASE,
} from "@/data/constants";
import { fetchExchangeRates } from "@/services/exchangeRate";
import { formatConversions } from "@/utils/conversionHelper";
import { Conversion, ConversionBoardProps } from "@/types/conversion.types";
import InputModal from "@/components/Modals/inputModal";
import ChartModal from "@/components/Modals/ChartModal";
import { getMockHistoricalData } from "@/data/mockHistoricalStats";
import { useModal } from "@/hooks/useModal";

export default function ConversionBoard({
  initialBaseCurrency = DEFAULT_CURRENCY,
  initialAmount = DEFAULT_AMOUNT,
}: ConversionBoardProps) {
  const [isBaseCurrency, setIsBaseCurrency] = useState(initialBaseCurrency);
  const [amount, setAmount] = useState(initialAmount);
  const [conversions, setConversions] = useState<Record<string, Conversion>>({});
  const [loading, setLoading] = useState(false);
  const amountModal = useModal(String(initialAmount));
  const [editing, setEditing] = useState<{
    mode: "base" | "target";
    country: string | null;
  } | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [chartTarget, setChartTarget] = useState<string | null>(null);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setLoading(true);
        const data = await fetchExchangeRates(OPEN_EXCHANGE_RATES_AVAILABLE_BASE);

        let rates = data.rates;
        if (isBaseCurrency !== OPEN_EXCHANGE_RATES_AVAILABLE_BASE) {
          const baseRate = rates[isBaseCurrency];
          if (baseRate) {
            rates = Object.entries(rates).reduce(
              (acc, [country, rate]) => {
                acc[country] = rate / baseRate;
                return acc;
              },
              {} as Record<string, number>
            );
          }
        }

        const formattedConversions = formatConversions(CURRENCIES, isBaseCurrency, rates, amount);

        setConversions(formattedConversions);
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
        setConversions({});
      } finally {
        setLoading(false);
      }
    };

    loadExchangeRates();
  }, [isBaseCurrency, amount]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div className={styles.board}>
      <CurrencyCard
        country={isBaseCurrency}
        amount={amount}
        currencies={CURRENCIES}
        isBase={true}
        onCurrencyChange={setIsBaseCurrency}
        onEditAmount={() => {
          setEditing({ mode: "base", country: isBaseCurrency });
          amountModal.open(String(amount));
        }}
        formatCurrency={formatCurrency}
      />

      <div className={styles.targetCards}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          Object.entries(conversions).map(([country, conversion]) => (
            <CurrencyCard
              key={country}
              country={country}
              baseCurrency={isBaseCurrency}
              conversion={conversion}
              isBase={false}
              onEditAmount={() => {
                setEditing({ mode: "target", country });
                const prefill = conversion?.value != null ? String(conversion.value) : String("");
                amountModal.open(prefill);
              }}
              onViewChart={() => {
                setChartTarget(country);
                setChartOpen(true);
              }}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>

      {/* Input Modal */}
      <InputModal
        isOpen={amountModal.isOpen}
        currency={editing?.mode === "target" && editing?.country ? editing.country : isBaseCurrency}
        inputValue={amountModal.inputValue}
        onInputChange={amountModal.setInputValue}
        onCancel={() => {
          amountModal.close();
          setEditing(null);
        }}
        onConfirm={() => {
          const sanitized = amountModal.inputValue.replace(/[^0-9.]/g, "");
          const next = parseFloat(sanitized);
          if (!isNaN(next)) {
            if (editing?.mode === "target" && editing.country && conversions[editing.country]) {
              const rate = conversions[editing.country].rate;
              if (rate && rate > 0) {
                const newBase = next / rate;
                setAmount(newBase);
              }
            } else {
              setAmount(next);
            }
          }
          amountModal.close();
          setEditing(null);
        }}
      />

      {/* Chart Modal */}
      <ChartModal
        isOpen={chartOpen}
        baseCurrency={isBaseCurrency}
        targetCurrency={chartTarget || ""}
        chartData={chartTarget ? getMockHistoricalData(isBaseCurrency, chartTarget) : []}
        isLoading={false}
        onClose={() => setChartOpen(false)}
      />
    </div>
  );
}
