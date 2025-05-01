import { CanvasRefs } from "@/hooks/useCanvasRefs";
import { SimulationSettings } from "@/context/SimulationSettingsContext";
import { Mouse3D } from "@/classes/Mouse3d";
import { Particle } from "@/classes/Particle";
import { Physics } from "@/classes/Physics";
import { World } from "@/classes/World";
import { useEffect } from "react";

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
  useEffect(() => {
    if (typeof window === "undefined") return;

    refs.particlesRef.current = [
      ...Array.from(
        { length: settings.electrons },
        () =>
          new Particle(
            settings.worldWidth,
            settings.worldHeight,
            settings.worldZ,
            "electron"
          )
      ),
      ...Array.from(
        { length: settings.protons },
        () =>
          new Particle(
            settings.worldWidth,
            settings.worldHeight,
            settings.worldZ,
            "proton"
          )
      ),
      ...Array.from(
        { length: settings.neutrons },
        () =>
          new Particle(
            settings.worldWidth,
            settings.worldHeight,
            settings.worldZ,
            "neutron"
          )
      ),
    ];
  }, [settings]);

  const initialize = (canvas: HTMLCanvasElement): void => {
    refs.canvasRef.current = canvas;

    refs.physicsRef.current = new Physics(settings);
    refs.mouseRef.current = new Mouse3D(canvas, settings.zoom);
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
