import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import {
  createScalarSettingPatch,
  createVectorSettingPatch,
} from "@/features/simulation/model/settingsPatch";

describe("settings patches", () => {
  it("creates typed scalar setting patches", () => {
    expect(createScalarSettingPatch("worldWidth", 500)).toEqual({
      worldWidth: 500,
    });
  });

  it("clones vector settings before patching an axis", () => {
    const settings = createDefaultSettings();
    const patch = createVectorSettingPatch(
      settings,
      "cameraPosition",
      "z",
      -800
    );

    expect(patch.cameraPosition.z).toBe(-800);
    expect(settings.cameraPosition.z).not.toBe(-800);
  });
});
