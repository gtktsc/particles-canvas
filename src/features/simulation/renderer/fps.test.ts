import { describe, expect, it } from "vitest";
import { calculateFps, getFpsColor } from "@/features/simulation/renderer/fps";
import { baseTheme } from "@/theme/theme";

describe("fps renderer", () => {
  it("calculates rounded fps", () => {
    expect(calculateFps(61, 1000)).toBe(61);
  });

  it("maps fps to status colors", () => {
    expect(getFpsColor(60)).toBe(baseTheme.color.fpsGood);
    expect(getFpsColor(40)).toBe(baseTheme.color.fpsWarning);
    expect(getFpsColor(20)).toBe(baseTheme.color.fpsDanger);
  });
});
