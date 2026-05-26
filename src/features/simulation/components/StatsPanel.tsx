import type { SimulationStats } from "@/features/simulation/model/simulationStats";
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
  return (
    <dl className={styles.stats}>
      <div>
        <dt>Particles</dt>
        <dd>{stats.particleCount}</dd>
      </div>
      <div>
        <dt>Forces</dt>
        <dd>{stats.activeForces}</dd>
      </div>
      <div>
        <dt>FPS</dt>
        <dd>{stats.fps}</dd>
      </div>
      <div>
        <dt>Avg speed</dt>
        <dd>{formatNumber(stats.averageSpeed)}</dd>
      </div>
      <div>
        <dt>Kinetic</dt>
        <dd>{formatNumber(stats.kineticEnergy)}</dd>
      </div>
      <div>
        <dt>Total E</dt>
        <dd>{formatNumber(stats.totalEnergy)}</dd>
      </div>
      <div>
        <dt>Momentum</dt>
        <dd>{formatNumber(stats.momentum)}</dd>
      </div>
    </dl>
  );
}
