"use client";

import { useEffect, useRef } from "react";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type {
  SimulationHistorySample,
} from "@/features/simulation/model/simulationHistory";
import type { SimulationStats } from "@/features/simulation/model/simulationStats";
import { baseTheme } from "@/theme/theme";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type MeasurementsPanelProps = {
  settings: SimulationSettings;
  stats: SimulationStats;
};

const SERIES = [
  {
    color: baseTheme.color.graphTotalEnergy,
    key: "totalEnergy",
    labelKey: "totalEnergy",
  },
  {
    color: baseTheme.color.graphAverageSpeed,
    key: "averageSpeed",
    labelKey: "averageSpeed",
  },
  {
    color: baseTheme.color.graphMomentum,
    key: "momentum",
    labelKey: "momentum",
  },
  {
    color: baseTheme.color.graphAngularMomentum,
    key: "angularMomentum",
    labelKey: "angularMomentum",
  },
] as const;

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 100_000) return value.toExponential(2);
  if (Math.abs(value) >= 100) return value.toFixed(0);
  return value.toFixed(2);
}

function drawSeries(
  ctx: CanvasRenderingContext2D,
  history: SimulationHistorySample[],
  series: (typeof SERIES)[number],
  label: string,
  top: number,
  height: number,
  width: number
) {
  const values = history.map((sample) => sample[series.key]);
  const max = Math.max(...values.map((value) => Math.abs(value)), 1);

  ctx.strokeStyle = series.color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  values.forEach((value, index) => {
    const x = history.length <= 1 ? 0 : (index / (history.length - 1)) * width;
    const y = top + height / 2 - (value / max) * (height * 0.44);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
  ctx.fillStyle = series.color;
  ctx.fillText(label, 6, top + 12);
}

export function MeasurementsPanel({ settings, stats }: MeasurementsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { messages } = useMessages();
  const labels = messages.simulation.forceLab.measurements;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = baseTheme.color.graphBackground;
    ctx.fillRect(0, 0, width, height);
    ctx.font = baseTheme.typography.canvasLabelFont;

    const rowHeight = height / SERIES.length;
    for (let i = 0; i < SERIES.length; i++) {
      ctx.strokeStyle = baseTheme.color.graphGridLine;
      ctx.beginPath();
      ctx.moveTo(0, i * rowHeight + rowHeight / 2);
      ctx.lineTo(width, i * rowHeight + rowHeight / 2);
      ctx.stroke();

      drawSeries(
        ctx,
        stats.history,
        SERIES[i],
        labels.series[SERIES[i].labelKey],
        i * rowHeight,
        rowHeight,
        width
      );
    }
  }, [labels.series, stats.history]);

  return (
    <section className={styles.measurements} aria-label={labels.ariaLabel}>
      <h2 className={styles.groupTitle}>{labels.title}</h2>
      {settings.showGraphs ? (
        <canvas
          aria-label={labels.graphLabel}
          className={styles.graphCanvas}
          height={180}
          ref={canvasRef}
          width={360}
        />
      ) : null}
      <dl className={styles.measurementGrid}>
        <div>
          <dt>{labels.potential}</dt>
          <dd>{formatNumber(stats.potentialEnergy)}</dd>
        </div>
        <div>
          <dt>{labels.totalEnergy}</dt>
          <dd>{formatNumber(stats.totalEnergy)}</dd>
        </div>
        <div>
          <dt>{labels.momentum}</dt>
          <dd>{formatNumber(stats.momentum)}</dd>
        </div>
        <div>
          <dt>{labels.angularMomentum}</dt>
          <dd>{formatNumber(stats.angularMomentum)}</dd>
        </div>
      </dl>
      {settings.probeEnabled ? (
        <dl className={styles.probeGrid}>
          <div>
            <dt>{labels.probePoint}</dt>
            <dd>{settings.probePoint.toString()}</dd>
          </div>
          <div>
            <dt>{labels.probeAcceleration}</dt>
            <dd>{stats.probeAcceleration.toString()}</dd>
          </div>
          <div>
            <dt>{labels.probePotential}</dt>
            <dd>{formatNumber(stats.probePotential)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
