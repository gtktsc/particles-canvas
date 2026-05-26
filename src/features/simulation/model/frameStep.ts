import { DT_SECONDS } from "@/features/simulation/model/physicsConstants";

export const STEP_MS = DT_SECONDS * 1000;
export const MAX_STEPS_PER_FRAME = 5;

export type FixedStepResult = {
  accumulator: number;
  lastTime: number;
  steps: number;
};

export function getFixedStepCount({
  accumulator,
  lastTime,
  maxSteps = MAX_STEPS_PER_FRAME,
  now,
  stepMs = STEP_MS,
}: {
  accumulator: number;
  lastTime: number;
  maxSteps?: number;
  now: number;
  stepMs?: number;
}): FixedStepResult {
  if (lastTime === 0) {
    return { accumulator, lastTime: now, steps: 0 };
  }

  const delta = Math.max(0, now - lastTime);
  let nextAccumulator = accumulator + delta;
  const steps = Math.min(maxSteps, Math.floor(nextAccumulator / stepMs));

  nextAccumulator -= steps * stepMs;

  if (steps === maxSteps) {
    nextAccumulator = Math.min(nextAccumulator, stepMs);
  }

  return {
    accumulator: nextAccumulator,
    lastTime: now,
    steps,
  };
}

export function getPhysicsFrameSteps({
  accumulator,
  isPaused,
  lastTime,
  now,
  singleStepRequested,
}: {
  accumulator: number;
  isPaused: boolean;
  lastTime: number;
  now: number;
  singleStepRequested: boolean;
}): FixedStepResult {
  if (isPaused) {
    return {
      accumulator: 0,
      lastTime: now,
      steps: singleStepRequested ? 1 : 0,
    };
  }

  return getFixedStepCount({ accumulator, lastTime, now });
}
