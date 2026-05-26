import { describe, expect, it } from "vitest";
import {
  pushSimulationHistory,
  type SimulationHistorySample,
} from "@/features/simulation/model/simulationHistory";

const createSample = (time: number) => ({
  angularMomentum: time,
  averageSpeed: time,
  kineticEnergy: time,
  momentum: time,
  potentialEnergy: time,
  time,
  totalEnergy: time,
});

describe("simulation history", () => {
  it("caps length and preserves chronological order", () => {
    const history: SimulationHistorySample[] = [];

    pushSimulationHistory(history, createSample(1), 3);
    pushSimulationHistory(history, createSample(2), 3);
    pushSimulationHistory(history, createSample(3), 3);
    pushSimulationHistory(history, createSample(4), 3);

    expect(history.map((sample) => sample.time)).toEqual([2, 3, 4]);
  });
});
