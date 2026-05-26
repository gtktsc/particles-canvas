import { useMemo, useRef, type RefObject } from "react";
import { Mouse3D } from "@/features/simulation/model/Mouse3d";
import { Particle } from "@/features/simulation/model/Particle";
import { Physics } from "@/features/simulation/model/Physics";
import { World } from "@/features/simulation/model/World";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";

export type CanvasRefs = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  requestRef: RefObject<number>;
  frameCount: RefObject<number>;
  particlesRef: RefObject<Particle[] | null>;
  physicsRef: RefObject<Physics | null>;
  mouseRef: RefObject<Mouse3D | null>;
  worldRef: RefObject<World | null>;
  settingsRef: RefObject<SimulationSettings | null>;
  lastFpsTime: RefObject<number>;
  lastPhysicsTime: RefObject<number>;
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
  const lastFpsTime = useRef<number>(0);
  const lastPhysicsTime = useRef<number>(0);
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
      lastFpsTime,
      lastPhysicsTime,
      physicsAccumulator,
      smoothedFps,
      sortedParticlesRef,
    }),
    []
  );
}
