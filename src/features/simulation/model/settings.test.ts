import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { CONTROL_CONFIG } from "@/features/simulation/model/controlConfig";
import { createParticles } from "@/features/simulation/model/particles";

describe("simulation settings", () => {
  it("keeps default control values inside slider bounds", () => {
    const settings = createDefaultSettings();
    const controls = Object.values(CONTROL_CONFIG).flat();

    for (const control of controls) {
      const value =
        control.kind === "scalar"
          ? settings[control.key]
          : settings[control.key][control.axis];

      expect(value, control.labelKey).toBeGreaterThanOrEqual(control.min);
      expect(value, control.labelKey).toBeLessThanOrEqual(control.max);
    }
  });

  it("creates fresh vector instances for mutable defaults", () => {
    const first = createDefaultSettings();
    const second = createDefaultSettings();

    first.centerAttractionPoint.x = 100;
    first.cameraPosition.z = 100;

    expect(second.centerAttractionPoint.x).toBe(0);
    expect(second.cameraPosition.z).not.toBe(100);
  });

  it("creates stable electron shell radii across simulation resets", () => {
    const settings = createDefaultSettings();
    settings.electrons = 3;
    settings.protons = 0;
    settings.neutrons = 0;

    expect(createParticles(settings).map((particle) => particle.shellRadius)).toEqual([
      50,
      80,
      80,
    ]);
    expect(createParticles(settings).map((particle) => particle.shellRadius)).toEqual([
      50,
      80,
      80,
    ]);
  });
});
