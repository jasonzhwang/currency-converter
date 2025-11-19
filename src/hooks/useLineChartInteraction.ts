import { useEffect, useRef, useState } from "react";
import type { HistoricalPoint, ChartHover } from "@/types/charts.types";
import {
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  CHART_MARGIN_BOTTOM,
  CHART_MARGIN_LEFT,
  CHART_MARGIN_RIGHT,
  CHART_MARGIN_TOP,
} from "@/data/constants";
import type { UseLineChartInteractionParams } from "@/types/charts.types";

export function useLineChartInteraction({
  data,
  containerRef,
  onHover,
  onZoom,
}: UseLineChartInteractionParams) {
  const [hover, setHover] = useState<ChartHover | null>(null);
  const lastMousePxRef = useRef<{ x: number; y: number } | null>(null);

  const PLOT_WIDTH = VIEWBOX_WIDTH - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;
  const PLOT_HEIGHT = VIEWBOX_HEIGHT - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const pointsCacheRef = useRef<Array<HistoricalPoint & { x: number; y: number }>>([]);
  // Keep points cache updated to match current data
  useEffect(() => {
    if (!data || data.length === 0) {
      pointsCacheRef.current = [];
      return;
    }
    const minRate = Math.min(...data.map((d) => d.rate));
    const maxRate = Math.max(...data.map((d) => d.rate));
    const range = maxRate - minRate || 1;
    pointsCacheRef.current = data.map((d, i) => {
      const x = CHART_MARGIN_LEFT + (i / (data.length - 1)) * PLOT_WIDTH;
      const y = CHART_MARGIN_TOP + PLOT_HEIGHT - ((d.rate - minRate) / range) * PLOT_HEIGHT;
      return { ...d, x, y };
    });
  }, [data, PLOT_WIDTH, PLOT_HEIGHT]);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    lastMousePxRef.current = { x: pxX, y: pxY };

    const points = pointsCacheRef.current;
    if (points.length === 0) return;

    const vxRaw = (pxX / rect.width) * VIEWBOX_WIDTH;
    const vx = Math.max(CHART_MARGIN_LEFT, Math.min(VIEWBOX_WIDTH - CHART_MARGIN_RIGHT, vxRaw));

    if (data.length === 1) {
      const p = points[0];
      const h: ChartHover = { vx: p.x, vy: p.y, domX: pxX, domY: pxY, date: p.date, rate: p.rate };
      setHover(h);
      onHover?.({ x: p.x, y: p.y, date: p.date, rate: p.rate, domX: pxX, domY: pxY });
      return;
    }

    const tAll = (vx - CHART_MARGIN_LEFT) / PLOT_WIDTH;
    const iFloat = tAll * (data.length - 1);
    const iLeft = Math.max(0, Math.min(data.length - 2, Math.floor(iFloat)));
    const iRight = iLeft + 1;
    const t = iFloat - iLeft;

    const pL = points[iLeft];
    const pR = points[iRight];
    const vy = pL.y + t * (pR.y - pL.y);
    const rate = data[iLeft].rate + t * (data[iRight].rate - data[iLeft].rate);
    const nearestIdx = Math.round(iFloat);
    const date = data[Math.max(0, Math.min(data.length - 1, nearestIdx))].date;

    const h: ChartHover = { vx, vy, domX: pxX, domY: pxY, date, rate };
    setHover(h);
    onHover?.({ x: vx, y: vy, date, rate, domX: pxX, domY: pxY });
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    setHover(null);
    onHover?.(null);
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    // Keep cursor position so we can recompute after zoom
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const pxX = e.clientX - rect.left;
      const pxY = e.clientY - rect.top;
      lastMousePxRef.current = { x: pxX, y: pxY };
    }
    if (!onZoom) return;
    e.preventDefault();
    if (e.deltaY < 0) onZoom("in");
    else if (e.deltaY > 0) onZoom("out");
  };

  // After data window changes (zoom), recompute hover from last mouse px
  useEffect(() => {
    if (!lastMousePxRef.current) return; // only recompute if mouse was over chart
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = lastMousePxRef.current;
    const pxX = px.x;
    const pxY = px.y;

    const points = pointsCacheRef.current;
    if (points.length === 0) return;

    const vxRaw = (pxX / rect.width) * VIEWBOX_WIDTH;
    const vx = Math.max(CHART_MARGIN_LEFT, Math.min(VIEWBOX_WIDTH - CHART_MARGIN_RIGHT, vxRaw));

    if (data.length === 1) {
      const p = points[0];
      const h: ChartHover = { vx: p.x, vy: p.y, domX: pxX, domY: pxY, date: p.date, rate: p.rate };
      setHover(h);
      onHover?.({ x: p.x, y: p.y, date: p.date, rate: p.rate, domX: pxX, domY: pxY });
      return;
    }

    const tAll = (vx - CHART_MARGIN_LEFT) / PLOT_WIDTH;
    const iFloat = tAll * (data.length - 1);
    const iLeft = Math.max(0, Math.min(data.length - 2, Math.floor(iFloat)));
    const iRight = iLeft + 1;
    const t = iFloat - iLeft;

    const pL = points[iLeft];
    const pR = points[iRight];
    const vy = pL.y + t * (pR.y - pL.y);
    const rate = data[iLeft].rate + t * (data[iRight].rate - data[iLeft].rate);
    const nearestIdx = Math.round(iFloat);
    const date = data[Math.max(0, Math.min(data.length - 1, nearestIdx))].date;

    const h: ChartHover = { vx, vy, domX: pxX, domY: pxY, date, rate };
    setHover(h);
    onHover?.({ x: vx, y: vy, date, rate, domX: pxX, domY: pxY });
  }, [data, PLOT_WIDTH, onHover]);

  return {
    hover,
    handleMouseMove,
    handleMouseLeave,
    handleWheel,
  } as const;
}
