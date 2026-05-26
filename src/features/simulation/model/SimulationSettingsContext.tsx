"use client";

import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
  ZOOM,
} from "@/features/simulation/model/controlConfig";
import {
  DEFAULT_CHARGE_RANGE,
  DEFAULT_CHARGE_SOFTENING,
  DEFAULT_GRAVITY_RANGE,
  DEFAULT_GRAVITY_SOFTENING,
  DEFAULT_LENNARD_JONES_RADIUS,
  DEFAULT_LENNARD_JONES_RANGE,
  DEFAULT_NUCLEAR_RANGE,
} from "@/features/simulation/model/physicsConstants";
import { Vector3 } from "@/features/simulation/model/Vector3";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getInitialCameraPosition,
  getInitialElectronsNumber,
  getInitialFOV,
  getInitialNeutronsNumber,
  getInitialProtonsNumber,
} from "@/features/simulation/model/defaults";
import {
  createInitialSimulationStats,
  type SimulationStats,
} from "@/features/simulation/model/simulationStats";
import type { ForcePresetId } from "@/features/simulation/model/forceTypes";
import type { ParticleType } from "@/features/simulation/model/Particle";

export type ViewMode = "front" | "top" | "side" | "iso";
export type ExampleLayoutId =
  | "random"
  | "beam"
  | "ringOrbit"
  | "twoBody"
  | "springLine"
  | "gasBox"
  | "fallingColumn";

export type SimulationSettings = {
  worldWidth: number;
  worldHeight: number;
  worldZ: number;
  forceCenterPoint: Vector3;
  fov: number;
  cameraPosition: Vector3;
  centerSpringEnabled: boolean;
  centerSpringStrength: number;
  dragEnabled: boolean;
  dragStrength: number;
  uniformFieldEnabled: boolean;
  uniformFieldX: number;
  uniformFieldY: number;
  uniformFieldZ: number;
  electricFieldEnabled: boolean;
  electricFieldX: number;
  electricFieldY: number;
  electricFieldZ: number;
  magneticFieldEnabled: boolean;
  magneticFieldZ: number;
  centralGravityEnabled: boolean;
  centralGravityStrength: number;
  centralGravitySoftening: number;
  pointChargeFieldEnabled: boolean;
  pointChargeStrength: number;
  pointChargeAmount: number;
  pointChargeSoftening: number;
  chargeEnabled: boolean;
  chargeStrength: number;
  chargeSoftening: number;
  chargeRange: number;
  gravityEnabled: boolean;
  gravityStrength: number;
  gravitySoftening: number;
  gravityRange: number;
  lennardJonesEnabled: boolean;
  lennardJonesStrength: number;
  lennardJonesRadius: number;
  lennardJonesRange: number;
  pairSpringEnabled: boolean;
  pairSpringStrength: number;
  pairSpringRestLength: number;
  pairSpringDamping: number;
  pairSpringRange: number;
  nuclearEnabled: boolean;
  nuclearStrength: number;
  nuclearRange: number;
  shellEnabled: boolean;
  shellConstraintK: number;
  fluidDragEnabled: boolean;
  fluidDragLinear: number;
  fluidDragQuadratic: number;
  mediumVelocityX: number;
  mediumVelocityY: number;
  mediumVelocityZ: number;
  buoyancyEnabled: boolean;
  buoyancyDensity: number;
  buoyancyStrength: number;
  fluidSurfaceY: number;
  defaultElectronRadius: number;
  collisionEnabled: boolean;
  electrons: number;
  protons: number;
  neutrons: number;
  zoom: number;
  isPaused: boolean;
  resetSignal: number;
  stepSignal: number;
  showForceVectors: boolean;
  showAxes: boolean;
  showDepthShading: boolean;
  showFieldVectors: boolean;
  showGrid: boolean;
  showGraphs: boolean;
  showParticleLabels: boolean;
  showPotentialHeatmap: boolean;
  showTrails: boolean;
  showVelocityVectors: boolean;
  trailLength: number;
  activeExampleId: ForcePresetId;
  initialLayout: ExampleLayoutId;
  probeEnabled: boolean;
  probeParticleType: ParticleType;
  probePoint: Vector3;
  viewMode: ViewMode;
};

export const createDefaultSettings = (): SimulationSettings => ({
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  worldZ: WORLD_Z,
  forceCenterPoint: new Vector3(0, 0, 0),
  centerSpringEnabled: true,
  centerSpringStrength: 0.7,
  dragEnabled: true,
  dragStrength: 0.8,
  uniformFieldEnabled: false,
  uniformFieldX: 0,
  uniformFieldY: 40,
  uniformFieldZ: 0,
  electricFieldEnabled: false,
  electricFieldX: 220,
  electricFieldY: 0,
  electricFieldZ: 0,
  magneticFieldEnabled: false,
  magneticFieldZ: 45,
  centralGravityEnabled: false,
  centralGravityStrength: 36_000,
  centralGravitySoftening: 45,
  pointChargeFieldEnabled: false,
  pointChargeStrength: 160_000,
  pointChargeAmount: 1,
  pointChargeSoftening: 35,
  chargeEnabled: true,
  chargeStrength: 8_000,
  chargeSoftening: DEFAULT_CHARGE_SOFTENING,
  chargeRange: DEFAULT_CHARGE_RANGE,
  gravityEnabled: false,
  gravityStrength: 8,
  gravitySoftening: DEFAULT_GRAVITY_SOFTENING,
  gravityRange: DEFAULT_GRAVITY_RANGE,
  lennardJonesEnabled: false,
  lennardJonesStrength: 3_000,
  lennardJonesRadius: DEFAULT_LENNARD_JONES_RADIUS,
  lennardJonesRange: DEFAULT_LENNARD_JONES_RANGE,
  pairSpringEnabled: false,
  pairSpringStrength: 35,
  pairSpringRestLength: 36,
  pairSpringDamping: 6,
  pairSpringRange: 70,
  nuclearEnabled: false,
  nuclearStrength: 55,
  nuclearRange: DEFAULT_NUCLEAR_RANGE,
  shellEnabled: false,
  shellConstraintK: 8,
  fluidDragEnabled: false,
  fluidDragLinear: 1.2,
  fluidDragQuadratic: 0.02,
  mediumVelocityX: 80,
  mediumVelocityY: 0,
  mediumVelocityZ: 0,
  buoyancyEnabled: false,
  buoyancyDensity: 1,
  buoyancyStrength: 14,
  fluidSurfaceY: 0,
  defaultElectronRadius: 50,
  collisionEnabled: true,
  zoom: ZOOM,
  fov: getInitialFOV(),
  cameraPosition: getInitialCameraPosition(),
  electrons: getInitialElectronsNumber(),
  protons: getInitialProtonsNumber(),
  neutrons: getInitialNeutronsNumber(),
  isPaused: false,
  resetSignal: 0,
  stepSignal: 0,
  showForceVectors: false,
  showAxes: true,
  showDepthShading: true,
  showFieldVectors: false,
  showGrid: true,
  showGraphs: false,
  showParticleLabels: false,
  showPotentialHeatmap: false,
  showTrails: false,
  showVelocityVectors: false,
  trailLength: 60,
  activeExampleId: "chargeAttraction",
  initialLayout: "random",
  probeEnabled: false,
  probeParticleType: "proton",
  probePoint: new Vector3(0, 0, 0),
  viewMode: "front",
});

export const defaultSettings = createDefaultSettings();

const SimulationSettingsContext = createContext<
  [SimulationSettings, (_values: Partial<SimulationSettings>) => void]
>([defaultSettings, () => {}]);
const SimulationStatsContext = createContext<
  [SimulationStats, (_values: SimulationStats) => void]
>([createInitialSimulationStats(), () => {}]);
const SimulationStatsSetterContext = createContext<
  (_values: SimulationStats) => void
>(() => {});

export function SimulationSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState(createDefaultSettings);
  const [stats, setStats] = useState(createInitialSimulationStats);

  const update = useCallback((values: Partial<SimulationSettings>) => {
    setSettings((prev) => ({ ...prev, ...values }));
  }, []);

  const settingsValue = useMemo(
    (): [SimulationSettings, (_values: Partial<SimulationSettings>) => void] => [
      settings,
      update,
    ],
    [settings, update]
  );
  const statsValue = useMemo(
    (): [SimulationStats, (_values: SimulationStats) => void] => [stats, setStats],
    [stats]
  );

  return (
    <SimulationSettingsContext.Provider value={settingsValue}>
      <SimulationStatsSetterContext.Provider value={setStats}>
        <SimulationStatsContext.Provider value={statsValue}>
          {children}
        </SimulationStatsContext.Provider>
      </SimulationStatsSetterContext.Provider>
    </SimulationSettingsContext.Provider>
  );
}

export function useSimulationSettings() {
  return useContext(SimulationSettingsContext);
}

export function useSimulationStats() {
  return useContext(SimulationStatsContext);
}

export function useSetSimulationStats() {
  return useContext(SimulationStatsSetterContext);
}
