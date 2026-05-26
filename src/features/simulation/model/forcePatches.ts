import { FORCE_DEFINITIONS } from "@/features/simulation/model/forceDefinitions";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type { ForceDefinition } from "@/features/simulation/model/forceTypes";

export function createForceDefaultPatch(
  force: ForceDefinition,
  defaults: SimulationSettings
): Partial<SimulationSettings> {
  const patch: Partial<SimulationSettings> = {
    [force.enabledKey]: defaults[force.enabledKey],
  };

  for (const slider of force.sliders) {
    patch[slider.key] = defaults[slider.key];
  }

  return patch;
}

export function createAllForcesDefaultPatch(
  defaults: SimulationSettings
): Partial<SimulationSettings> {
  return FORCE_DEFINITIONS.reduce<Partial<SimulationSettings>>(
    (patch, force) => ({ ...patch, ...createForceDefaultPatch(force, defaults) }),
    {}
  );
}

export function createAllForcesDisabledPatch(): Partial<SimulationSettings> {
  return FORCE_DEFINITIONS.reduce<Partial<SimulationSettings>>(
    (patch, force) => ({ ...patch, [force.enabledKey]: false }),
    {}
  );
}
