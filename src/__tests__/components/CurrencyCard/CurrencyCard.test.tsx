import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyCard from "@/components/CurrencyCard";

const formatCurrency = (v: number) => `$${v.toFixed(2)}`;

describe("CurrencyCard", () => {
  test("renders base card with select and no rate", () => {
    render(
      <CurrencyCard
        country="AUD"
        amount={1000}
        currencies={["AUD", "USD"]}
        isBase
        onCurrencyChange={jest.fn()}
        onEditAmount={jest.fn()}
        formatCurrency={formatCurrency}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByText(/1 AUD =/)).not.toBeInTheDocument();
  });

  test("renders target card with rate", () => {
    render(
      <CurrencyCard
        country="USD"
        baseCurrency="AUD"
        conversion={{ rate: 0.65, value: 650 }}
        isBase={false}
        onEditAmount={jest.fn()}
        onViewChart={jest.fn()}
        formatCurrency={formatCurrency}
      />
    );
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText(/1 AUD = 0.6500 USD/)).toBeInTheDocument();
  });

  test("clicking target card triggers chart view callback", () => {
    const onViewChart = jest.fn();
    render(
      <CurrencyCard
        country="USD"
        baseCurrency="AUD"
        conversion={{ rate: 0.65, value: 650 }}
        isBase={false}
        onEditAmount={jest.fn()}
        onViewChart={onViewChart}
        formatCurrency={formatCurrency}
      />
    );
    fireEvent.click(screen.getByText("USD"));
    expect(onViewChart).toHaveBeenCalled();
  });
});
