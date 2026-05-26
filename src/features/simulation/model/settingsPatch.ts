import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type {
  ScalarSettingKey,
  VectorAxis,
  VectorSettingKey,
} from "@/features/simulation/model/controlConfig";

export type SimulationSettingsPatch = Partial<SimulationSettings>;

export function createScalarSettingPatch<K extends ScalarSettingKey>(
  key: K,
  value: SimulationSettings[K]
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
