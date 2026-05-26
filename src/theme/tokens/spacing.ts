export const spacing = {
  none: "0",
  xs: "5px",
  sm: "10px",
  md: "1rem",
} as const;

export type SpacingTokens = typeof spacing;
