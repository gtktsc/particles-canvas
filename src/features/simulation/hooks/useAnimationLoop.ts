import { CanvasRefs } from "@/features/simulation/hooks/useSimulationRefs";
import { getFixedStepCount } from "@/features/simulation/model/frameStep";
import { drawFps, calculateFps } from "@/features/simulation/renderer/fps";
import {
  createParticleDrawGroups,
  drawParticleGroups,
  sortParticlesByDepth,
} from "@/features/simulation/renderer/particles";
import { baseTheme } from "@/theme/theme";
import { useCallback } from "react";

type useAnimationLoopProps = {
  refs: CanvasRefs;
  initialize: (_canvas: HTMLCanvasElement) => void;
};

export function useAnimationLoop({
  refs,
  initialize,
}: useAnimationLoopProps) {
  const animate = useCallback((ctx: CanvasRenderingContext2D) => {
    const settings = refs.settingsRef.current;
    if (!settings) return;

    const { width, height } = ctx.canvas;

    if (
      !refs.particlesRef.current ||
      !refs.physicsRef.current ||
      !refs.mouseRef.current ||
      !refs.worldRef.current
    ) {
      initialize(ctx.canvas);
    }

    const particles = refs.particlesRef.current ?? [];
    const physics = refs.physicsRef.current;
    const mouse = refs.mouseRef.current;
    const world = refs.worldRef.current;
    if (!physics || !mouse || !world) return;

    physics.settings = settings;
    mouse.updateView(settings.zoom, settings.fov, settings.cameraPosition);

    ctx.fillStyle = baseTheme.color.canvasBackground;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(settings.zoom, settings.zoom);
    ctx.translate(-width / 2, -height / 2);

    const now = performance.now();
    const delta = now - refs.lastFpsTime.current;
    if (delta >= 1000) {
      refs.smoothedFps.current = calculateFps(refs.frameCount.current, delta);
      refs.frameCount.current = 0;
      refs.lastFpsTime.current = now;
    }

    const center = settings.centerAttractionPoint;

    refs.frameCount.current++;

    world.updateSize(
      settings.worldWidth,
      settings.worldHeight,
      settings.worldZ
    );
    world.render(ctx, settings.fov, settings.cameraPosition);

    const fixedStep = getFixedStepCount({
      accumulator: refs.physicsAccumulator.current,
      lastTime: refs.lastPhysicsTime.current,
      now,
    });
    refs.physicsAccumulator.current = fixedStep.accumulator;
    refs.lastPhysicsTime.current = fixedStep.lastTime;

    for (let i = 0; i < fixedStep.steps; i++) {
      physics.step({
        bounds: {
          width: settings.worldWidth,
          height: settings.worldHeight,
          depth: settings.worldZ,
        },
        center,
        centerAttraction: settings.centerAttraction,
        damping: settings.damping,
        particles,
      });
    }

    if (
      refs.frameCount.current % 4 === 0 ||
      refs.sortedParticlesRef.current.length !== particles.length
    ) {
      refs.sortedParticlesRef.current = sortParticlesByDepth(particles);
    }

    drawParticleGroups(
      ctx,
      createParticleDrawGroups({
        cameraPosition: settings.cameraPosition,
        fov: settings.fov,
        height,
        particles: refs.sortedParticlesRef.current,
        width,
      })
    );

    mouse.render(ctx, settings.fov, settings.cameraPosition);
    ctx.restore();

    refs.requestRef.current = requestAnimationFrame(() => animate(ctx));

    drawFps(ctx, refs.smoothedFps.current);
  }, [initialize, refs]);

  return { animate };
}
