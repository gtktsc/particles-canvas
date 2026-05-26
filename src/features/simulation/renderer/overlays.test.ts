import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { getSimulationGridSize } from "@/features/simulation/renderer/overlays";

describe("simulation overlays", () => {
  it("uses the largest world dimension for grid size", () => {
    const settings = createDefaultSettings();

    settings.worldWidth = 400;
    settings.worldHeight = 800;
    settings.worldZ = 600;

    expect(getSimulationGridSize(settings)).toBe(400);
  });
});
