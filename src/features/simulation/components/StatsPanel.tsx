"use client";

import type { SimulationStats } from "@/features/simulation/model/simulationStats";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type StatsPanelProps = {
  stats: SimulationStats;
};

const formatNumber = (value: number) => {
  if (value >= 100_000) return value.toExponential(2);
  if (value >= 100) return value.toFixed(0);
  return value.toFixed(1);
};

export function StatsPanel({ stats }: StatsPanelProps) {
  const { messages } = useMessages();
  const labels = messages.simulation.forceLab.stats;

  return (
    <dl className={styles.stats}>
      <div>
        <dt>{labels.particles}</dt>
        <dd>{stats.particleCount}</dd>
      </div>
      <div>
        <dt>{labels.forces}</dt>
        <dd>{stats.activeForces}</dd>
      </div>
      <div>
        <dt>{labels.fps}</dt>
        <dd>{stats.fps}</dd>
      </div>
      <div>
        <dt>{labels.averageSpeed}</dt>
        <dd>{formatNumber(stats.averageSpeed)}</dd>
      </div>
      <div>
        <dt>{labels.kinetic}</dt>
        <dd>{formatNumber(stats.kineticEnergy)}</dd>
      </div>
      <div>
        <dt>{labels.totalEnergy}</dt>
        <dd>{formatNumber(stats.totalEnergy)}</dd>
      </div>
      <div>
        <dt>{labels.momentum}</dt>
        <dd>{formatNumber(stats.momentum)}</dd>
      </div>
    </dl>
  );
}
