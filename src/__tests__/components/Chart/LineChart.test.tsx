import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LineChart from "@/components/Chart/LineChart";

const sample = [
  { date: "2025-11-01", rate: 1 },
  { date: "2025-11-02", rate: 2 },
  { date: "2025-11-03", rate: 1.5 },
];

describe("LineChart", () => {
  test("renders polyline and ticks", () => {
    render(<LineChart data={sample} currency="USD" baseCurrency="AUD" />);
    // SVG polyline should be rendered
    const poly = document.querySelector("polyline");
    expect(poly).not.toBeNull();
    // tick texts (dates substring)
    expect(screen.getByText("11-01")).toBeInTheDocument();
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
    expect(screen.getByText(/2025-11-0[1-3]/)).toBeInTheDocument();
  });
});
