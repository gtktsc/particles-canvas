"use client";

import {
  CENTER_ATTRACTION,
  CENTER_ATTRACTION_POINT,
  CHANGE_STRENGTH,
  DAMPING,
  NUMBER_OF_PARTICLES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
} from "@/lib/constants";
import { Vector3 } from "@/classes/Vector3";
import { createContext, useContext, useState, ReactNode } from "react";
import { getInitialCameraPosition, getInitialFOV } from "@/lib/defaults";

export type SimulationSettings = {
  worldWidth: number;
  worldHeight: number;
  worldZ: number;
  centerAttraction: number;
  damping: number;
  numberOfParticles: number;
  centerAttractionPoint: Vector3;
  fov: number;
  cameraPosition: Vector3;
  chargeStrength: number;
};

const defaultSettings: SimulationSettings = {
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  worldZ: WORLD_Z,
  centerAttraction: CENTER_ATTRACTION,
  damping: DAMPING,
  numberOfParticles: NUMBER_OF_PARTICLES,
  centerAttractionPoint: CENTER_ATTRACTION_POINT,
  chargeStrength: CHANGE_STRENGTH,
  fov: getInitialFOV(),
  cameraPosition: getInitialCameraPosition(),
};

const SimulationSettingsContext = createContext<
  [SimulationSettings, (v: Partial<SimulationSettings>) => void]
>([defaultSettings, () => {}]);

export function SimulationSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState(defaultSettings);

  const update = (values: Partial<SimulationSettings>) => {
    setSettings((prev) => ({ ...prev, ...values }));
  };

  return (
    <SimulationSettingsContext.Provider value={[settings, update]}>
      {children}
    </SimulationSettingsContext.Provider>
  );
}

export function useSimulationSettings() {
  return useContext(SimulationSettingsContext);
}
