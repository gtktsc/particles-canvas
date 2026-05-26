"use client";

import { useEffect, useRef } from "react";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type {
  SimulationHistorySample,
} from "@/features/simulation/model/simulationHistory";
import type { SimulationStats } from "@/features/simulation/model/simulationStats";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type MeasurementsPanelProps = {
  settings: SimulationSettings;
  stats: SimulationStats;
};

const SERIES = [
  { color: "rgba(255, 220, 80, 0.9)", key: "totalEnergy", label: "E" },
  { color: "rgba(120, 220, 255, 0.9)", key: "averageSpeed", label: "v" },
  { color: "rgba(255, 120, 160, 0.9)", key: "momentum", label: "p" },
  { color: "rgba(150, 255, 150, 0.9)", key: "angularMomentum", label: "L" },
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
  ctx.fillText(series.label, 6, top + 12);
}

export function MeasurementsPanel({ settings, stats }: MeasurementsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "11px monospace";

    const rowHeight = height / SERIES.length;
    for (let i = 0; i < SERIES.length; i++) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, i * rowHeight + rowHeight / 2);
      ctx.lineTo(width, i * rowHeight + rowHeight / 2);
      ctx.stroke();

      drawSeries(ctx, stats.history, SERIES[i], i * rowHeight, rowHeight, width);
    }
  }, [stats.history]);

  return (
    <section className={styles.measurements} aria-label="Measurements">
      <h2 className={styles.groupTitle}>Measurements</h2>
      {settings.showGraphs ? (
        <canvas
          aria-label="Live measurement graphs"
          className={styles.graphCanvas}
          height={180}
          ref={canvasRef}
          width={360}
        />
      ) : null}
      <dl className={styles.measurementGrid}>
        <div>
          <dt>Potential</dt>
          <dd>{formatNumber(stats.potentialEnergy)}</dd>
        </div>
        <div>
          <dt>Total E</dt>
          <dd>{formatNumber(stats.totalEnergy)}</dd>
        </div>
        <div>
          <dt>Momentum</dt>
          <dd>{formatNumber(stats.momentum)}</dd>
        </div>
        <div>
          <dt>Angular L</dt>
          <dd>{formatNumber(stats.angularMomentum)}</dd>
        </div>
      </dl>
      {settings.probeEnabled ? (
        <dl className={styles.probeGrid}>
          <div>
            <dt>Probe xyz</dt>
            <dd>{settings.probePoint.toString()}</dd>
          </div>
          <div>
            <dt>Probe a</dt>
            <dd>{stats.probeAcceleration.toString()}</dd>
          </div>
          <div>
            <dt>Probe U</dt>
            <dd>{formatNumber(stats.probePotential)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
