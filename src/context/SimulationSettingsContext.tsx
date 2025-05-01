"use client";

import {
  CENTER_ATTRACTION,
  CENTER_ATTRACTION_POINT,
  CHANGE_STRENGTH,
  DAMPING,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
  ZOOM,
} from "@/lib/constants";
import { Vector3 } from "@/classes/Vector3";
import { createContext, useContext, useState, ReactNode } from "react";
import {
  getInitialCameraPosition,
  getInitialElectronsNumber,
  getInitialFOV,
  getInitialNeutronsNumber,
  getInitialProtonsNumber,
} from "@/lib/defaults";

export type SimulationSettings = {
  worldWidth: number;
  worldHeight: number;
  worldZ: number;
  centerAttraction: number;
  damping: number;
  centerAttractionPoint: Vector3;
  fov: number;
  cameraPosition: Vector3;
  chargeStrength: number;
  electrons: number;
  protons: number;
  neutrons: number;
  zoom: number;
  nuclearRange: number;
  nuclearStrength: number;
  shellConstraintK: number;
  defaultElectronRadius: number;
};

const defaultSettings: SimulationSettings = {
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  worldZ: WORLD_Z,
  centerAttraction: CENTER_ATTRACTION,
  damping: DAMPING,
  centerAttractionPoint: CENTER_ATTRACTION_POINT,
  chargeStrength: CHANGE_STRENGTH,
  zoom: ZOOM,
  fov: getInitialFOV(),
  cameraPosition: getInitialCameraPosition(),
  electrons: getInitialElectronsNumber(),
  protons: getInitialProtonsNumber(),
  neutrons: getInitialNeutronsNumber(),
  nuclearRange: 10,
  nuclearStrength: 25,
  shellConstraintK: 0.5,
  defaultElectronRadius: 50,
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
