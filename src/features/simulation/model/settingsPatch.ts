import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type {
  ScalarSettingKey,
  VectorAxis,
  VectorSettingKey,
} from "@/features/simulation/model/controlConfig";
import type { ForceScalarSettingKey } from "@/features/simulation/model/forceTypes";

export type SimulationSettingsPatch = Partial<SimulationSettings>;
export type BooleanSettingKey = {
  [Key in keyof SimulationSettings]: SimulationSettings[Key] extends boolean
    ? Key
    : never;
}[keyof SimulationSettings];
export type NumberSettingKey = {
  [Key in keyof SimulationSettings]: SimulationSettings[Key] extends number
    ? Key
    : never;
}[keyof SimulationSettings];

export function createScalarSettingPatch<K extends ScalarSettingKey>(
  key: K,
  value: SimulationSettings[K]
): Pick<SimulationSettings, K> {
  return { [key]: value } as Pick<SimulationSettings, K>;
}

export function createNumberSettingPatch<K extends NumberSettingKey>(
  key: K,
  value: number
): Pick<SimulationSettings, K> {
  return { [key]: value } as Pick<SimulationSettings, K>;
}

export function createForceScalarSettingPatch<K extends ForceScalarSettingKey>(
  key: K,
  value: number
): Pick<SimulationSettings, K> {
  return { [key]: value } as Pick<SimulationSettings, K>;
}

export function createBooleanSettingPatch<K extends BooleanSettingKey>(
  key: K,
  value: boolean
): Pick<SimulationSettings, K> {
  return { [key]: value } as Pick<SimulationSettings, K>;
}

export function createVectorSettingPatch<K extends VectorSettingKey>(
  settings: SimulationSettings,
  key: K,
  axis: VectorAxis,
  value: number
): Pick<SimulationSettings, K> {
  const next = settings[key].clone();
  next[axis] = value;

  return { [key]: next } as Pick<SimulationSettings, K>;
}
