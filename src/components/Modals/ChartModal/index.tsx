import { useMemo, useState } from "react";
import LineChart from "../../Chart/LineChart";
import styles from "./ChartModal.module.scss";
import { ChartModalProps, HistoricalPoint } from "@/types/charts.types";

export default function ChartModal({
  isOpen,
  baseCurrency,
  targetCurrency,
  chartData,
  isLoading,
  onClose,
}: ChartModalProps) {
  const [windowSize, setWindowSize] = useState(Math.min(14, chartData.length || 14));

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
              onClick={() => setWindowSize((w) => Math.max(5, w - 2))}
              disabled={visibleData.length <= 5}
            >
              -
            </button>
            <span className={styles.zoomLevel}>{visibleData.length}d</span>
            <button
              className={styles.zoomBtn}
              onClick={() => setWindowSize((w) => Math.min(chartData.length || 14, w + 2))}
              disabled={visibleData.length >= (chartData.length || 14)}
            >
              +
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => setWindowSize(Math.min(14, chartData.length || 14))}
            >
              Reset
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading chart data...</div>
        ) : chartData.length > 0 ? (
          <div className={styles.chartContainer}>
            <LineChart
              data={visibleData}
              currency={targetCurrency}
              baseCurrency={baseCurrency}
              onZoom={(dir) => {
                const maxWindow = chartData.length || 14;
                const step = 2;
                setWindowSize((w) => {
                  const next = dir === "in" ? w - step : w + step;
                  return Math.max(5, Math.min(maxWindow, next));
                });
              }}
            />
          </div>
        ) : (
          <div className={styles.chartEmpty}>No chart data available</div>
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
