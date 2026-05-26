import { describe, expect, it } from "vitest";
import {
  getFixedStepCount,
  getPhysicsFrameSteps,
  MAX_STEPS_PER_FRAME,
  STEP_MS,
} from "@/features/simulation/model/frameStep";

describe("frame step", () => {
  it("returns fixed step count and remaining accumulator", () => {
    const result = getFixedStepCount({
      accumulator: 0,
      lastTime: 1000,
      now: 1000 + STEP_MS * 2 + 1,
    });

    expect(result.steps).toBe(2);
    expect(result.accumulator).toBeCloseTo(1);
    expect(result.lastTime).toBeCloseTo(1000 + STEP_MS * 2 + 1);
  });

  it("clamps large frame gaps", () => {
    const result = getFixedStepCount({
      accumulator: 0,
      lastTime: 1000,
      now: 1000 + STEP_MS * 20,
    });

    expect(result.steps).toBe(MAX_STEPS_PER_FRAME);
    expect(result.accumulator).toBeLessThanOrEqual(STEP_MS);
  });

  it("resets timing while paused and runs only requested single steps", () => {
    expect(
      getPhysicsFrameSteps({
        accumulator: 20,
        isPaused: true,
        lastTime: 1000,
        now: 1100,
        singleStepRequested: false,
      })
    ).toEqual({ accumulator: 0, lastTime: 1100, steps: 0 });

    expect(
      getPhysicsFrameSteps({
        accumulator: 20,
        isPaused: true,
        lastTime: 1000,
        now: 1100,
        singleStepRequested: true,
      })
    ).toEqual({ accumulator: 0, lastTime: 1100, steps: 1 });
  });
});
