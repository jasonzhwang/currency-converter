import React, { useRef } from "react";
import styles from "../Modals/ChartModal/ChartModal.module.scss";
import { LineChartProps } from "@/types/charts.types";
import {
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  CHART_MARGIN_BOTTOM,
  CHART_MARGIN_LEFT,
  CHART_MARGIN_RIGHT,
  CHART_MARGIN_TOP,
} from "@/data/constants";
import { useLineChartInteraction } from "@/hooks/useLineChartInteraction";

const LineChart: React.FC<LineChartProps> = ({ data, onHover, onZoom }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks must be called unconditionally (before any early returns)
  const { hover, handleMouseMove, handleMouseLeave, handleWheel } = useLineChartInteraction({
    data,
    containerRef,
    onHover,
    onZoom,
  });

  if (!data || data.length === 0) {
    return <div className={styles.chartEmpty}>No data</div>;
  }

  const minRate = Math.min(...data.map((d) => d.rate));
  const maxRate = Math.max(...data.map((d) => d.rate));
  const range = maxRate - minRate || 1;

  const PLOT_WIDTH = VIEWBOX_WIDTH - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;
  const PLOT_HEIGHT = VIEWBOX_HEIGHT - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

  const points = data.map((d, i) => {
    const x = CHART_MARGIN_LEFT + (i / (data.length - 1)) * PLOT_WIDTH;
    const y = CHART_MARGIN_TOP + PLOT_HEIGHT - ((d.rate - minRate) / range) * PLOT_HEIGHT;
    return { x, y, ...d };
  });

  const poly = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      className={styles.lineChartContainer}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
      >
        {/* Axes */}
        <line
          className={styles.yAxis}
          x1={CHART_MARGIN_LEFT}
          y1={CHART_MARGIN_TOP}
          x2={CHART_MARGIN_LEFT}
          y2={VIEWBOX_HEIGHT - CHART_MARGIN_BOTTOM}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <line
          className={styles.xAxis}
          x1={CHART_MARGIN_LEFT}
          y1={VIEWBOX_HEIGHT - CHART_MARGIN_BOTTOM}
          x2={VIEWBOX_WIDTH - CHART_MARGIN_RIGHT}
          y2={VIEWBOX_HEIGHT - CHART_MARGIN_BOTTOM}
          stroke="#e5e7eb"
          strokeWidth={1}
        />

        {/* Y ticks and grid */}
        {Array.from({ length: 5 }).map((_, idx) => {
          const t = idx / 4;
          const y = CHART_MARGIN_TOP + (1 - t) * PLOT_HEIGHT;
          const val = minRate + t * range;
          return (
            <g key={`ytick-${idx}`}>
              <line
                x1={CHART_MARGIN_LEFT}
                x2={VIEWBOX_WIDTH - CHART_MARGIN_RIGHT}
                y1={y}
                y2={y}
                stroke="#f3f4f6"
              />
              <text
                x={CHART_MARGIN_LEFT - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className={styles.tickLabel}
              >
                {val.toFixed(4)}
              </text>
            </g>
          );
        })}

        {/* X ticks */}
        {points.map((p, idx) => {
          const every = Math.ceil(points.length / 6);
          if (idx % every !== 0) return null;
          return (
            <text
              key={`xtick-${idx}`}
              x={p.x}
              y={VIEWBOX_HEIGHT - CHART_MARGIN_BOTTOM + 16}
              textAnchor="middle"
              className={styles.tickLabel}
            >
              {p.date.slice(5)}
            </text>
          );
        })}

        <polyline fill="none" stroke="var(--primary-blue)" strokeWidth={2} points={poly} />

        {/* Crosshair */}
        {hover && (
          <>
            <line
              className={styles.crosshair}
              x1={hover.vx}
              x2={hover.vx}
              y1={CHART_MARGIN_TOP}
              y2={VIEWBOX_HEIGHT - CHART_MARGIN_BOTTOM}
              stroke="#9ca3af"
              strokeDasharray="3 3"
            />
            <circle cx={hover.vx} cy={hover.vy} r={4} fill="var(--primary-blue)" />
          </>
        )}
      </svg>

      {hover && (
        <div
          className={styles.chartTooltip}
          style={{ left: `${hover.domX + 8}px`, top: `${hover.domY - 28}px` }}
        >
          <div className={styles.tooltipDate}>{hover.date}</div>
          <div className={styles.tooltipRate}>{hover.rate.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
