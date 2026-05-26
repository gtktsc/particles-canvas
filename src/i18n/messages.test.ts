import { describe, expect, it } from "vitest";
import { DEFAULT_MESSAGES } from "@/i18n/messages";
import { FORCE_DEFINITIONS } from "@/features/simulation/model/forceDefinitions";
import { FORCE_PRESETS } from "@/features/simulation/model/forcePresets";
import {
  getMessageAtPath,
  getMessagePaths,
  getPlaceholders,
} from "@/i18n/utils";

describe("messages", () => {
  it("keeps English messages non-empty", () => {
    for (const path of getMessagePaths(DEFAULT_MESSAGES)) {
      expect(getMessageAtPath(DEFAULT_MESSAGES, path), path).not.toBe("");
    }
  });

  it("keeps placeholder syntax discoverable for parity checks", () => {
    expect(getPlaceholders("Drag {count} particles into {target}")).toEqual([
      "{count}",
      "{target}",
    ]);
  });

  it("exposes nested simulation control keys", () => {
    expect(getMessagePaths(DEFAULT_MESSAGES)).toContain(
      "simulation.controls.actions.resetWorld"
    );
  });

  it("keeps force lab copy aligned with model definitions", () => {
    const paths = getMessagePaths(DEFAULT_MESSAGES);

    for (const force of FORCE_DEFINITIONS) {
      expect(paths).toContain(`simulation.forceLab.forces.${force.id}.title`);
      expect(paths).toContain(`simulation.forceLab.forces.${force.id}.formula`);
      expect(paths).toContain(`simulation.forceLab.forces.${force.id}.description`);

      for (const slider of force.sliders) {
        expect(paths).toContain(
          `simulation.forceLab.sliderLabels.${slider.key}`
        );
      }
    }

    for (const preset of FORCE_PRESETS) {
      expect(paths).toContain(`simulation.forceLab.examples.${preset.id}.title`);
      expect(paths).toContain(
        `simulation.forceLab.examples.${preset.id}.whatToNotice`
      );
    }
  });
});
