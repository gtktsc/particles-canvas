import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import {
  createBooleanSettingPatch,
  createForceScalarSettingPatch,
  createNumberSettingPatch,
  createScalarSettingPatch,
  createVectorSettingPatch,
} from "@/features/simulation/model/settingsPatch";

describe("settings patches", () => {
  it("creates typed scalar setting patches", () => {
    expect(createScalarSettingPatch("worldWidth", 500)).toEqual({
      worldWidth: 500,
    });
  });

  it("creates typed force scalar setting patches", () => {
    expect(createForceScalarSettingPatch("chargeStrength", 9000)).toEqual({
      chargeStrength: 9000,
    });
  });

  it("creates typed numeric setting patches", () => {
    expect(createNumberSettingPatch("trailLength", 120)).toEqual({
      trailLength: 120,
    });
  });

  it("creates typed boolean setting patches", () => {
    expect(createBooleanSettingPatch("showTrails", true)).toEqual({
      showTrails: true,
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
