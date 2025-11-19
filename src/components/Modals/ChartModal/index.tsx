import { useMemo, useState } from "react";
import LineChart from "../../Chart/LineChart";
import styles from "./ChartModal.module.scss";
import { HistoricalPoint } from "@/types/charts.types";
import { ChartModalProps } from "@/types/modals.types";
import {
  CHART_MIN_WINDOW_DAYS,
  CHART_DEFAULT_WINDOW_DAYS,
  CHART_ZOOM_STEP_DAYS,
  CHART_MESSAGES,
} from "@/data/constants";

export default function ChartModal({
  isOpen,
  baseCurrency,
  targetCurrency,
  chartData,
  isLoading,
  onClose,
}: ChartModalProps) {
  const [windowSize, setWindowSize] = useState(
    Math.min(CHART_DEFAULT_WINDOW_DAYS, chartData.length || CHART_DEFAULT_WINDOW_DAYS)
  );

  const visibleData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [] as HistoricalPoint[];
    return chartData.slice(Math.max(0, chartData.length - windowSize));
  }, [chartData, windowSize]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTitleContainer}>
          <h2 className={styles.modalTitle}>
            {baseCurrency} / {targetCurrency}
          </h2>
          <span className={styles.modalSubtitle}>Foreign Exchange rate</span>
        </div>

        <div className={styles.chartTitleAndControls}>
          <div className={styles.chartTitlePlaceholder} aria-hidden="true" />
          <div className={styles.zoomControls}>
            <button
              className={styles.zoomBtn}
              onClick={() =>
                setWindowSize((w) => Math.max(CHART_MIN_WINDOW_DAYS, w - CHART_ZOOM_STEP_DAYS))
              }
              disabled={visibleData.length <= CHART_MIN_WINDOW_DAYS}
            >
              -
            </button>
            <span className={styles.zoomLevel}>{visibleData.length}d</span>
            <button
              className={styles.zoomBtn}
              onClick={() =>
                setWindowSize((w) =>
                  Math.min(chartData.length || CHART_DEFAULT_WINDOW_DAYS, w + CHART_ZOOM_STEP_DAYS)
                )
              }
              disabled={visibleData.length >= (chartData.length || CHART_DEFAULT_WINDOW_DAYS)}
            >
              +
            </button>
            <button
              className={styles.resetBtn}
              onClick={() =>
                setWindowSize(
                  Math.min(CHART_DEFAULT_WINDOW_DAYS, chartData.length || CHART_DEFAULT_WINDOW_DAYS)
                )
              }
            >
              Reset
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{CHART_MESSAGES.LOADING}</div>
        ) : chartData.length > 0 ? (
          <div className={styles.chartContainer}>
            <LineChart
              data={visibleData}
              currency={targetCurrency}
              baseCurrency={baseCurrency}
              onZoom={(dir) => {
                const maxWindow = chartData.length || CHART_DEFAULT_WINDOW_DAYS;
                setWindowSize((w) => {
                  const next = dir === "in" ? w - CHART_ZOOM_STEP_DAYS : w + CHART_ZOOM_STEP_DAYS;
                  return Math.max(CHART_MIN_WINDOW_DAYS, Math.min(maxWindow, next));
                });
              }}
            />
          </div>
        ) : (
          <div className={styles.chartEmpty}>{CHART_MESSAGES.NO_DATA}</div>
        )}

        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
