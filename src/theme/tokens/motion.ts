export const motion = {
  instant: "0ms",
  fast: "120ms",
} as const;

export type MotionTokens = typeof motion;
