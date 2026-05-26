import { useMemo, useRef, type RefObject } from "react";
import { Mouse3D } from "@/features/simulation/model/Mouse3d";
import { Particle } from "@/features/simulation/model/Particle";
import { Physics } from "@/features/simulation/model/Physics";
import { World } from "@/features/simulation/model/World";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type { SimulationHistorySample } from "@/features/simulation/model/simulationHistory";
import { Vector3 } from "@/features/simulation/model/Vector3";

export type CanvasRefs = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  requestRef: RefObject<number>;
  frameCount: RefObject<number>;
  particlesRef: RefObject<Particle[] | null>;
  physicsRef: RefObject<Physics | null>;
  mouseRef: RefObject<Mouse3D | null>;
  worldRef: RefObject<World | null>;
  settingsRef: RefObject<SimulationSettings | null>;
  statsHistoryRef: RefObject<SimulationHistorySample[]>;
  trailHistoryRef: RefObject<Map<number, Vector3[]>>;
  lastFpsTime: RefObject<number>;
  lastPhysicsTime: RefObject<number>;
  lastStatsTime: RefObject<number>;
  lastStepSignal: RefObject<number>;
  physicsAccumulator: RefObject<number>;
  smoothedFps: RefObject<number>;
  sortedParticlesRef: RefObject<Particle[]>;
};

export function useSimulationRefs(): CanvasRefs {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const particlesRef = useRef<Particle[] | null>(null);
  const physicsRef = useRef<Physics | null>(null);
  const mouseRef = useRef<Mouse3D | null>(null);
  const worldRef = useRef<World | null>(null);
  const settingsRef = useRef<SimulationSettings | null>(null);
  const statsHistoryRef = useRef<SimulationHistorySample[]>([]);
  const trailHistoryRef = useRef<Map<number, Vector3[]>>(new Map());
  const lastFpsTime = useRef<number>(0);
  const lastPhysicsTime = useRef<number>(0);
  const lastStatsTime = useRef<number>(0);
  const lastStepSignal = useRef<number>(0);
  const physicsAccumulator = useRef<number>(0);
  const smoothedFps = useRef<number>(0);
  const sortedParticlesRef = useRef<Particle[]>([]);

  return useMemo(
    () => ({
      canvasRef,
      requestRef,
      frameCount,
      particlesRef,
      physicsRef,
      mouseRef,
      worldRef,
      settingsRef,
      statsHistoryRef,
      trailHistoryRef,
      lastFpsTime,
      lastPhysicsTime,
      lastStatsTime,
      lastStepSignal,
      physicsAccumulator,
      smoothedFps,
      sortedParticlesRef,
    }),
    []
  );
}
