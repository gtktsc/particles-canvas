import { useEffect, useCallback } from "react";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { useCanvasRefs } from "@/hooks/useCanvasRefs";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { useSimulationInitializer } from "@/hooks/useSimulationInitializer";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { Particle } from "@/classes/Particle";

export function useCanvas() {
  const refs = useCanvasRefs();
  const [settings] = useSimulationSettings();
  const { handleMouseDown, handleMouseUp, removeListeners } = useMouseHandlers({
    refs,
  });
  const { initialize, cleanup } = useSimulationInitializer({
    refs,
    settings,
    handleMouseDown,
    handleMouseUp,
    removeListeners,
  });
  const { animate } = useAnimationLoop({ refs, settings, initialize });

  useEffect(() => cleanup, [cleanup]);

  useEffect(() => {
    if (refs.particlesRef.current) {
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
    }
  }, [settings, refs.particlesRef]);

  const start = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      cleanup();
      initialize(ctx.canvas);
      refs.requestRef.current = requestAnimationFrame(() => animate(ctx));
    },
    [animate, initialize, cleanup, refs.requestRef]
  );

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const reset = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      stop();
      initialize(ctx.canvas);
      refs.requestRef.current = requestAnimationFrame(() => animate(ctx));
    },
    [stop, initialize, animate, refs.requestRef]
  );

  return { start, stop, reset };
}
