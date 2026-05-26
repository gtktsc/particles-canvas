export const typography = {
  controlPanelFontFamily: "sans-serif",
  controlPanelFontSize: "14px",
  controlPanelMonoFontFamily: "monospace",
  canvasLabelFont: "11px monospace",
  canvasAxisFont: "12px monospace",
  fpsFont: "14px sans-serif",
} as const;

export type TypographyTokens = typeof typography;
