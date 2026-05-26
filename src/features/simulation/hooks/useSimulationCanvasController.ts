import { useEffect, useCallback } from "react";
import { useSimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { useSimulationRefs } from "@/features/simulation/hooks/useSimulationRefs";
import { useMouseHandlers } from "@/features/simulation/hooks/useMouseHandlers";
import { useSimulationInitializer } from "@/features/simulation/hooks/useSimulationInitializer";
import { useAnimationLoop } from "@/features/simulation/hooks/useAnimationLoop";
import { createParticles } from "@/features/simulation/model/particles";

export function useSimulationCanvasController() {
  const refs = useSimulationRefs();
  const [settings] = useSimulationSettings();
  refs.settingsRef.current = settings;

  const { handleMouseDown, handleMouseUp, removeListeners } = useMouseHandlers({
    refs,
  });
  const { initialize, cleanup } = useSimulationInitializer({
    refs,
    handleMouseDown,
    handleMouseUp,
    removeListeners,
  });
  const { animate } = useAnimationLoop({ refs, initialize });

  useEffect(() => cleanup, [cleanup]);

  useEffect(() => {
    if (refs.particlesRef.current) {
      const latestSettings = refs.settingsRef.current;
      if (!latestSettings) return;

      refs.particlesRef.current = createParticles(latestSettings);
      refs.sortedParticlesRef.current = [];
    }
  }, [settings.electrons, settings.protons, settings.neutrons, refs]);

  const start = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      cleanup();
      initialize(ctx.canvas);
      refs.lastFpsTime.current = performance.now();
      refs.frameCount.current = 0;
      refs.requestRef.current = requestAnimationFrame(() => animate(ctx));
    },
    [animate, initialize, cleanup, refs]
  );

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { start, stop };
}
