import { describe, expect, it } from "vitest";
import { baseTheme, createTheme } from "@/theme/theme";
import { createCssVariables } from "@/theme/utils";

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
      "--layout-control-panel-width": "260px",
      "--spacing-sm": "10px",
    });
  });
});
