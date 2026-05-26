import { describe, expect, it } from "vitest";
import { baseTheme, createTheme } from "@/theme/theme";
import { createCssVariables, rgba } from "@/theme/utils";

describe("theme", () => {
  it("creates the default dark theme", () => {
    expect(createTheme()).toMatchObject({
      mode: "dark",
      tone: "default",
      color: baseTheme.color,
    });
  });

  it("exports CSS variables from token paths", () => {
    expect(createCssVariables(baseTheme)).toMatchObject({
      "--color-control-panel-background": "rgba(0, 0, 0, 0.7)",
      "--color-force-vector": "rgba(0, 255, 255, 0.75)",
      "--color-graph-total-energy": "rgba(255, 220, 80, 0.9)",
      "--layout-control-panel-width": "260px",
      "--spacing-sm": "10px",
      "--typography-canvas-label-font": "11px monospace",
    });
  });

  it("builds alpha colors from RGB channel tokens", () => {
    expect(rgba(baseTheme.color.worldEdgeRgb, 0.5)).toBe(
      "rgba(90, 240, 190, 0.5)"
    );
  });
});
