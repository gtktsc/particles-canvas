import { Mouse3D } from "@/classes/Mouse3d";
import { Particle } from "@/classes/Particle";
import { Physics } from "@/classes/Physics";
import { World } from "@/classes/World";
import { useRef } from "react";

export type CanvasRefs = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  requestRef: React.RefObject<number>;
  frameCount: React.RefObject<number>;
  particlesRef: React.RefObject<Particle[] | null>;
  physicsRef: React.RefObject<Physics | null>;
  mouseRef: React.RefObject<Mouse3D | null>;
  worldRef: React.RefObject<World | null>;
  lastFpsTime: React.RefObject<number>;
  smoothedFps: React.RefObject<number>;
};

export function useCanvasRefs(): CanvasRefs {
  return {
    canvasRef: useRef<HTMLCanvasElement>(null),
    requestRef: useRef<number>(0),
    frameCount: useRef<number>(0),
    particlesRef: useRef<Particle[] | null>(null),
    physicsRef: useRef<Physics | null>(null),
    mouseRef: useRef<Mouse3D | null>(null),
    worldRef: useRef<World | null>(null),
    lastFpsTime: useRef<number>(performance.now()),
    smoothedFps: useRef<number>(0),
  };
}
