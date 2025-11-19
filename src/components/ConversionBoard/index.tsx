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

export default function ConversionBoard({
  initialBaseCurrency = DEFAULT_CURRENCY,
  initialAmount = DEFAULT_AMOUNT,
}: ConversionBoardProps) {
  const [isBaseCurrency, setIsBaseCurrency] = useState(initialBaseCurrency);
  const [amount, setAmount] = useState(initialAmount);
  const [conversions, setConversions] = useState<Record<string, Conversion>>({});
  const [loading, setLoading] = useState(false);

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
        onEditAmount={() => console.log("Edit amount clicked")}
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
              onEditAmount={() => console.log("Edit amount clicked")}
              onViewChart={() => console.log("View chart clicked")}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>
    </div>
  );
}
