export type SimulationHistorySample = {
  angularMomentum: number;
  averageSpeed: number;
  kineticEnergy: number;
  momentum: number;
  potentialEnergy: number;
  time: number;
  totalEnergy: number;
};

export const MAX_HISTORY_SAMPLES = 240;

export function pushSimulationHistory(
  history: SimulationHistorySample[],
  sample: SimulationHistorySample,
  maxSamples = MAX_HISTORY_SAMPLES
) {
  return [...history, sample].slice(-maxSamples);
}
