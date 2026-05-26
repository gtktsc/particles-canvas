import { describe, expect, it } from "vitest";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { CONTROL_CONFIG } from "@/features/simulation/model/controlConfig";
import { FORCE_DEFINITIONS } from "@/features/simulation/model/forceDefinitions";
import { FORCE_PRESETS } from "@/features/simulation/model/forcePresets";
import { createParticles } from "@/features/simulation/model/particles";

describe("simulation settings", () => {
  it("keeps default control values inside slider bounds", () => {
    const settings = createDefaultSettings();
    const controls = Object.values(CONTROL_CONFIG).flat();

    for (const control of controls) {
      const value = control.kind === "vector"
        ? settings[control.key][control.axis]
        : settings[control.key];

      expect(value, control.labelKey).toBeGreaterThanOrEqual(control.min);
      expect(value, control.labelKey).toBeLessThanOrEqual(control.max);
    }

    for (const force of FORCE_DEFINITIONS) {
      for (const slider of force.sliders) {
        const value = settings[slider.key];

        expect(value, slider.key).toBeGreaterThanOrEqual(slider.min);
        expect(value, slider.key).toBeLessThanOrEqual(slider.max);
      }
    }
  });

  it("creates fresh vector instances for mutable defaults", () => {
    const first = createDefaultSettings();
    const second = createDefaultSettings();

    first.forceCenterPoint.x = 100;
    first.cameraPosition.z = 100;

    expect(second.forceCenterPoint.x).toBe(0);
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

  it("maps every force definition to real settings keys", () => {
    const settings = createDefaultSettings();

    for (const force of FORCE_DEFINITIONS) {
      expect(typeof settings[force.enabledKey], force.id).toBe("boolean");

      for (const slider of force.sliders) {
        expect(typeof settings[slider.key], slider.key).toBe("number");
      }
    }
  });

  it("keeps presets limited to valid settings keys", () => {
    const settings = createDefaultSettings();
    const keys = new Set(Object.keys(settings));
    const forceIds = new Set(FORCE_DEFINITIONS.map((force) => force.id));
    const layoutIds = new Set([
      "random",
      "beam",
      "ringOrbit",
      "twoBody",
      "springLine",
      "gasBox",
      "fallingColumn",
    ]);

    for (const preset of FORCE_PRESETS) {
      for (const key of Object.keys(preset.settings)) {
        expect(keys.has(key), `${preset.id}.${key}`).toBe(true);
      }

      for (const forceId of preset.activeForces) {
        expect(forceIds.has(forceId), `${preset.id}.${forceId}`).toBe(true);
      }

      if ("initialLayout" in preset.settings && preset.settings.initialLayout) {
        expect(layoutIds.has(preset.settings.initialLayout), preset.id).toBe(true);
      }
    }
  });

  it("keeps disabled force sliders represented", () => {
    for (const force of FORCE_DEFINITIONS) {
      expect(force.enabledKey).toMatch(/Enabled$/);
      expect(force.sliders.every((slider) => slider.min <= slider.max)).toBe(true);
    }
  });

  it("keeps visualization defaults inside UI bounds", () => {
    const settings = createDefaultSettings();
    const exampleIds = new Set<string>(FORCE_PRESETS.map((preset) => preset.id));

    expect(["front", "top", "side", "iso"]).toContain(settings.viewMode);
    expect(settings.trailLength).toBeGreaterThanOrEqual(0);
    expect(settings.trailLength).toBeLessThanOrEqual(180);
    expect(exampleIds.has(settings.activeExampleId)).toBe(true);

    for (const key of [
      "showAxes",
      "showDepthShading",
      "showFieldVectors",
      "showForceVectors",
      "showGrid",
      "showGraphs",
      "showParticleLabels",
      "showPotentialHeatmap",
      "showTrails",
      "showVelocityVectors",
      "probeEnabled",
    ] as const) {
      expect(typeof settings[key], key).toBe("boolean");
    }

    expect(["electron", "proton", "neutron"]).toContain(settings.probeParticleType);
    expect(["random", "beam", "ringOrbit", "twoBody", "springLine", "gasBox", "fallingColumn"]).toContain(
      settings.initialLayout
    );
  });
});
