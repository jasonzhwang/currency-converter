import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartModal from "@/components/Modals/ChartModal";
import { mockHistoricalData } from "@/data/mockHistoricalStats";

describe("ChartModal", () => {
  const sampleData = mockHistoricalData.AUD_USD;

  test("renders title and zoom controls when open", () => {
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/AUD \/ USD/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(screen.getByText(/Foreign Exchange rate/i)).toBeInTheDocument();
    // zoom level shows days
    expect(screen.getByText(/14d/)).toBeInTheDocument();
  });

  test("zoom in reduces window size", () => {
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={() => {}}
      />
    );
    const minusBtn = screen.getAllByRole("button", { name: "-" })[0];
    fireEvent.click(minusBtn);
    // after one zoom in, days should reduce (14 -> 12)
    expect(screen.getByText(/12d/)).toBeInTheDocument();
  });

  test("shows empty message when no data", () => {
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="EUR"
        chartData={[]}
        isLoading={false}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/No chart data available/i)).toBeInTheDocument();
  });
});
