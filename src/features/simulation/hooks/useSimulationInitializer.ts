import { CanvasRefs } from "@/features/simulation/hooks/useSimulationRefs";
import { Mouse3D } from "@/features/simulation/model/Mouse3d";
import { Physics } from "@/features/simulation/model/Physics";
import { World } from "@/features/simulation/model/World";
import { createParticles } from "@/features/simulation/model/particles";
import { useCallback } from "react";

type SimulationInitializer = {
  initialize: (_canvas: HTMLCanvasElement) => void;
  cleanup: () => void;
};

type UseSimulationInitializerProps = {
  refs: CanvasRefs;
  handleMouseDown: (_ev: MouseEvent) => void;
  handleMouseUp: (_ev: MouseEvent) => void;
  removeListeners: () => void;
};

export function useSimulationInitializer({
  refs,
  handleMouseDown,
  handleMouseUp,
  removeListeners,
}: UseSimulationInitializerProps): SimulationInitializer {
  const initialize = useCallback((canvas: HTMLCanvasElement): void => {
    const settings = refs.settingsRef.current;
    if (!settings) return;

    refs.canvasRef.current = canvas;

    refs.physicsRef.current = new Physics(settings);
    refs.mouseRef.current = new Mouse3D(
      canvas,
      settings.zoom,
      settings.fov,
      settings.cameraPosition
    );
    refs.worldRef.current = new World(
      settings.worldWidth,
      settings.worldHeight,
      settings.worldZ
    );
    refs.particlesRef.current ??= createParticles(settings);
    refs.lastPhysicsTime.current = 0;
    refs.physicsAccumulator.current = 0;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseDown, handleMouseUp, refs]);

  const cleanup = useCallback((): void => {
    cancelAnimationFrame(refs.requestRef.current);
    refs.mouseRef.current?.destroy();
    removeListeners();
    refs.requestRef.current = 0;
    refs.lastPhysicsTime.current = 0;
    refs.physicsAccumulator.current = 0;
    refs.mouseRef.current = null;
    refs.physicsRef.current = null;
    refs.worldRef.current = null;
  }, [refs, removeListeners]);

  return { initialize, cleanup };
}
