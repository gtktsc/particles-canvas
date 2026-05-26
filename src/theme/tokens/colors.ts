export const colors = {
  canvasBackground: "black",
  worldFrame: "lime",
  selectionFrame: "rgba(0,255,0,0.8)",
  particleElectron: "rgba(0, 0, 255, 1)",
  particleProton: "rgba(255, 0, 0, 1)",
  particleNeutron: "rgba(255, 255, 255, 1)",
  dragVector: "rgba(0, 128, 255, 0.7)",
  fpsGood: "lime",
  fpsWarning: "yellow",
  fpsDanger: "red",
  controlPanelBackground: "rgba(0, 0, 0, 0.7)",
  controlPanelText: "white",
  controlPanelBorder: "rgba(255, 255, 255, 0.2)",
  controlPanelFocus: "rgba(255, 255, 255, 0.85)",
} as const;

export type ColorTokens = typeof colors;
