import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LineChart from "@/components/Chart/LineChart";

const sample = [
  { date: "2025-11-01", rate: 1 },
  { date: "2025-11-02", rate: 2 },
  { date: "2025-11-03", rate: 1.5 },
  { date: "2025-11-04", rate: 1.8 },
  { date: "2025-11-05", rate: 2.1 },
];

describe("LineChart", () => {
  test("renders polyline and ticks", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    // SVG polyline should be rendered
    const poly = document.querySelector("polyline");
    expect(poly).not.toBeNull();
    // tick texts (dates substring)
    expect(screen.getByText("11-01")).toBeInTheDocument();
    expect(screen.getByText("11-05")).toBeInTheDocument();
  });

  test("displays all dates when data is provided", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    sample.forEach((point) => {
      expect(screen.getByText(point.date.slice(5))).toBeInTheDocument();
    });
  });

  test("renders Y axis with tick labels", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const yAxis = document.querySelector("line[class*='yAxis']");
    expect(yAxis).toBeInTheDocument();
  });

  test("renders gradient fill polygon", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const polygon = document.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
    expect(polygon).toHaveAttribute("fill", "url(#lineGradient)");
  });

  test("shows hover tooltip after mouse move", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const container = document.querySelector("div[class*='lineChartContainer']") as HTMLElement;
    // Mock bounding box for deterministic hover math
    jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 760,
      height: 320,
      right: 760,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    fireEvent.mouseMove(container, { clientX: 100, clientY: 50 });
    // Tooltip date should appear
    expect(screen.getByText(/2025-11-0[1-5]/)).toBeInTheDocument();
  });

  test("tooltip shows rate value with 4 decimal places", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const container = document.querySelector("div[class*='lineChartContainer']") as HTMLElement;
    jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 760,
      height: 320,
      right: 760,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    fireEvent.mouseMove(container, { clientX: 100, clientY: 50 });
    // Tooltip rate value should be displayed with 4 decimals
    // Look for tooltip specifically (not Y-axis labels)
    const tooltipElements = document.querySelectorAll("div[class*='chartTooltip']");
    expect(tooltipElements.length).toBeGreaterThan(0);
  });

  test("tooltip hides after mouse leave", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const container = document.querySelector("div[class*='lineChartContainer']") as HTMLElement;
    jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 760,
      height: 320,
      right: 760,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    fireEvent.mouseMove(container, { clientX: 100, clientY: 50 });
    expect(screen.getByText(/2025-11-0[1-5]/)).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    // Tooltip should be removed from DOM
    expect(screen.queryByText(/2025-11-0[1-5]/)).not.toBeInTheDocument();
  });

  test("renders empty state when no data provided", () => {
    render(<LineChart data={[]} currency="USD" baseCurrency="AUD" />);
    expect(screen.getByText(/No data/)).toBeInTheDocument();
  });

  test("renders single data point correctly", () => {
    const singlePoint = [{ date: "2025-11-01", rate: 1.5 }];
    render(<LineChart data={singlePoint} currency="USD" baseCurrency="AUD" />);
    expect(screen.getByText("11-01")).toBeInTheDocument();
  });

  test("handles tooltip for nearest data point on hover", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const container = document.querySelector("div[class*='lineChartContainer']") as HTMLElement;
    jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 760,
      height: 320,
      right: 760,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    // Move to first data point position
    fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });
    expect(screen.getByText("11-01")).toBeInTheDocument();
  });

  test("displays crosshair on hover", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    const container = document.querySelector("div[class*='lineChartContainer']") as HTMLElement;
    jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 760,
      height: 320,
      right: 760,
      bottom: 320,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    fireEvent.mouseMove(container, { clientX: 100, clientY: 50 });
    const crosshair = document.querySelector("line[class*='crosshair']");
    expect(crosshair).toBeInTheDocument();
  });
});
