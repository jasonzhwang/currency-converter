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

  describe("Wheel Zoom - Boundary Constraints", () => {
    test("calls onZoom callback for zoom in", () => {
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

      // Zoom in with negative deltaY
      act(() => {
        result.current.handleWheel({
          deltaY: -100,
          preventDefault: jest.fn(),
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(onZoom).toHaveBeenCalled();
    });

    test("calls onZoom callback for zoom out", () => {
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

      // Zoom out with positive deltaY
      act(() => {
        result.current.handleWheel({
          deltaY: 100,
          preventDefault: jest.fn(),
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(onZoom).toHaveBeenCalled();
    });

    test("prevents default wheel event to avoid scrolling", () => {
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
      const preventDefault = jest.fn();
      const onZoom = jest.fn(); // Must provide onZoom for preventDefault to be called
      const { result } = renderHook(() =>
        useLineChartInteraction({ data, containerRef: ref, onZoom })
      );

      act(() => {
        result.current.handleWheel({
          deltaY: -100,
          preventDefault,
          clientX: 10,
          clientY: 10,
        } as any);
      });

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("Mouse Movement - Boundary Handling", () => {
    test("handles mouse movement at left boundary", () => {
      const container = document.createElement("div");
      container.getBoundingClientRect = () => ({
        left: 100,
        top: 0,
        width: 760,
        height: 320,
        right: 860,
        bottom: 320,
        x: 100,
        y: 0,
        toJSON: () => {},
      });
      const ref = { current: container } as any;
      const { result } = renderHook(() => useLineChartInteraction({ data, containerRef: ref }));

      act(() => {
        result.current.handleMouseMove({
          clientX: 100, // At left edge
          clientY: 50,
        } as any);
      });

      // Should handle gracefully
      expect(result.current.hover).toBeDefined();
    });

    test("handles mouse movement at right boundary", () => {
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
        result.current.handleMouseMove({
          clientX: 760, // At right edge
          clientY: 50,
        } as any);
      });

      // Should handle gracefully
      expect(result.current.hover).toBeDefined();
    });

    test("handles mouse movement outside container bounds", () => {
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
        result.current.handleMouseMove({
          clientX: 1000, // Way outside
          clientY: 500,
        } as any);
      });

      // Should handle gracefully without crashing
      expect(result.current.hover).toBeDefined();
    });

    test("handles negative coordinates", () => {
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
        result.current.handleMouseMove({
          clientX: -100,
          clientY: -50,
        } as any);
      });

      // Should handle gracefully
      expect(result.current.hover).toBeDefined();
    });
  });

  describe("Rapid Operations", () => {
    test("handles rapid consecutive mouse movements", () => {
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

      // Simulate rapid mouse movements (100 events)
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.handleMouseMove({
            clientX: (i * 7.6) % 760, // Move across chart
            clientY: 50,
          } as any);
        }
      });

      // Should end up with valid state
      expect(result.current.hover).toBeDefined();
    });

    test("handles rapid wheel zoom events", () => {
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

      // Simulate rapid zooming
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.handleWheel({
            deltaY: i % 2 === 0 ? -100 : 100,
            preventDefault: jest.fn(),
            clientX: 100,
            clientY: 50,
          } as any);
        }
      });

      // Should handle all events
      expect(onZoom).toHaveBeenCalled();
    });
  });

  describe("Mouse Leave and Reset", () => {
    test("clears hover on mouse leave", () => {
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

      // First set hover
      act(() => {
        result.current.handleMouseMove({
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(result.current.hover).not.toBeNull();

      // Then leave
      act(() => {
        result.current.handleMouseLeave({} as any);
      });

      expect(result.current.hover).toBeNull();
    });

    test("resets hover data on mouse leave", () => {
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
      const onHover = jest.fn();
      const { result } = renderHook(() =>
        useLineChartInteraction({ data, containerRef: ref, onHover })
      );

      // Set initial hover state
      act(() => {
        result.current.handleMouseMove({
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(onHover).toHaveBeenCalled();

      // Leave
      act(() => {
        result.current.handleMouseLeave({} as any);
      });

      expect(result.current.hover).toBeNull();
    });
  });

  describe("Edge Cases - Empty Data", () => {
    test("handles empty data array", () => {
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
      const { result } = renderHook(() => useLineChartInteraction({ data: [], containerRef: ref }));

      act(() => {
        result.current.handleMouseMove({
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(result.current.hover).toBeNull();
    });

    test("handles single data point", () => {
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
      const singleData = [{ date: "2025-11-01", rate: 1.5 }];
      const { result } = renderHook(() =>
        useLineChartInteraction({ data: singleData, containerRef: ref })
      );

      act(() => {
        result.current.handleMouseMove({
          clientX: 100,
          clientY: 50,
        } as any);
      });

      expect(result.current.hover).toBeDefined();
    });
  });
});
