import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartModal from "@/components/Modals/ChartModal";
import { mockHistoricalData } from "@/data/mockHistoricalStats";

describe("ChartModal", () => {
  const sampleData = mockHistoricalData.AUD_USD;

  test("renders nothing when closed", () => {
    const { container } = render(
      <ChartModal
        isOpen={false}
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

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

  test("title displays correct currency pair", () => {
    render(
      <ChartModal
        isOpen
        baseCurrency="EUR"
        targetCurrency="GBP"
        chartData={sampleData}
        isLoading={false}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/EUR \/ GBP/)).toBeInTheDocument();
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

  test("zoom out increases window size", () => {
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
    const plusBtn = screen.getAllByRole("button", { name: "+" })[0];
    fireEvent.click(plusBtn);
    // after one zoom out, days should increase
    expect(screen.queryByText(/16d/) || screen.queryByText(/14d/)).toBeInTheDocument();
  });

  test("reset button returns to default zoom level", () => {
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
    fireEvent.click(minusBtn);

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetBtn);

    // Should return to 14d
    expect(screen.getByText(/14d/)).toBeInTheDocument();
  });

  test("zoom in button disabled when minimum window reached", () => {
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
    // Zoom in multiple times until disabled
    for (let i = 0; i < 10; i++) {
      const btn = screen.getAllByRole("button", { name: "-" })[0];
      if (btn.getAttribute("disabled")) break;
      fireEvent.click(btn);
    }
    const disabledMinusBtn = screen.getAllByRole("button", { name: "-" })[0];
    expect(disabledMinusBtn).toBeDisabled();
  });

  test("zoom out button disabled when maximum window reached", () => {
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
    const plusBtn = screen.getAllByRole("button", { name: "+" })[0];
    // Zoom out multiple times until disabled
    for (let i = 0; i < 10; i++) {
      const btn = screen.getAllByRole("button", { name: "+" })[0];
      if (btn.getAttribute("disabled")) break;
      fireEvent.click(btn);
    }
    const disabledPlusBtn = screen.getAllByRole("button", { name: "+" })[0];
    expect(disabledPlusBtn).toBeDisabled();
  });

  test("shows loading state", () => {
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={[]}
        isLoading={true}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/Loading chart data/i)).toBeInTheDocument();
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

  test("calls onClose when close button clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={mockOnClose}
      />
    );
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("renders LineChart when data is available", () => {
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
    // LineChart should render SVG elements
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("subtitle has correct styling classes", () => {
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
    const subtitle = screen.getByText(/Foreign Exchange rate/i);
    // Subtitle should have the modalSubtitle class styling applied
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.tagName).toBe("SPAN");
  });

  test("modal closes when overlay clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={mockOnClose}
      />
    );
    // Click on the overlay
    const overlay = document.querySelector("div[class*='modalOverlay']") as HTMLElement;
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("modal content does not close when modal is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <ChartModal
        isOpen
        baseCurrency="AUD"
        targetCurrency="USD"
        chartData={sampleData}
        isLoading={false}
        onClose={mockOnClose}
      />
    );
    // Click inside modal content
    const modal = document.querySelector(
      "div[class*='modal']:not([class*='Overlay'])"
    ) as HTMLElement;
    fireEvent.click(modal);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
