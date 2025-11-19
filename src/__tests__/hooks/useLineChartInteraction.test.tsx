import { renderHook, act } from "@testing-library/react";
import { useLineChartInteraction } from "@/hooks/useLineChartInteraction";
import React from "react";

const data = [
  { date: "2025-11-01", rate: 1 },
  { date: "2025-11-02", rate: 2 },
  { date: "2025-11-03", rate: 1.5 },
];

describe("useLineChartInteraction", () => {
  test("wheel events trigger onZoom callback", () => {
    const container = document.createElement("div");
    container.getBoundingClientRect = () => ({
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
    const ref = { current: container } as any;
    const onZoom = jest.fn();
    const { result } = renderHook(() =>
      useLineChartInteraction({ data, containerRef: ref, onZoom })
    );
    act(() => {
      result.current.handleWheel({
        deltaY: -100,
        preventDefault: jest.fn(),
        clientX: 10,
        clientY: 10,
      } as any);
    });
    expect(onZoom).toHaveBeenCalledWith("in");
  });

  test("mouse move sets hover", () => {
    const container = document.createElement("div");
    container.getBoundingClientRect = () => ({
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
    const ref = { current: container } as any;
    const { result } = renderHook(() => useLineChartInteraction({ data, containerRef: ref }));
    act(() => {
      result.current.handleMouseMove({ clientX: 100, clientY: 50 } as any);
    });
    expect(result.current.hover).not.toBeNull();
    expect(result.current.hover?.date).toMatch(/2025-11-0[1-3]/);
  });
});
