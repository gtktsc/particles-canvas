import { CanvasRefs } from "@/hooks/useCanvasRefs";
import { SimulationSettings } from "@/context/SimulationSettingsContext";
import { Mouse3D } from "@/classes/Mouse3d";
import { Particle } from "@/classes/Particle";
import { Physics } from "@/classes/Physics";
import { World } from "@/classes/World";

type SimulationInitializer = {
  initialize: (canvas: HTMLCanvasElement) => void;
  cleanup: () => void;
};

type UseSimulationInitializerProps = {
  refs: CanvasRefs;
  settings: SimulationSettings;
  handleMouseDown: (ev: MouseEvent) => void;
  handleMouseUp: (ev: MouseEvent) => void;
  removeListeners: () => void;
};

export function useSimulationInitializer({
  refs,
  settings,
  handleMouseDown,
  handleMouseUp,
  removeListeners,
}: UseSimulationInitializerProps): SimulationInitializer {
  const initialize = (canvas: HTMLCanvasElement): void => {
    refs.canvasRef.current = canvas;

    refs.particlesRef.current = Array.from(
      { length: settings.numberOfParticles },
      () =>
        new Particle(settings.worldWidth, settings.worldHeight, settings.worldZ)
    );

    refs.physicsRef.current = new Physics();
    refs.mouseRef.current = new Mouse3D(canvas);
    refs.worldRef.current = new World(
      settings.worldWidth,
      settings.worldHeight,
      settings.worldZ
    );

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
  };

  const cleanup = (): void => {
    cancelAnimationFrame(refs.requestRef.current);
    refs.mouseRef.current?.destroy();
    removeListeners();
  };

  return { initialize, cleanup };
}
