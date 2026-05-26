import { CanvasRefs } from "@/features/simulation/hooks/useSimulationRefs";
import { getFixedStepCount } from "@/features/simulation/model/frameStep";
import { DT_SECONDS } from "@/features/simulation/model/physicsConstants";
import { pushSimulationHistory } from "@/features/simulation/model/simulationHistory";
import {
  calculateSimulationStats,
  type SimulationStats,
} from "@/features/simulation/model/simulationStats";
import { drawFps, calculateFps } from "@/features/simulation/renderer/fps";
import {
  createParticleDrawGroups,
  drawParticleTrails,
  drawParticleVectors,
  drawParticleGroups,
  sortParticlesByDepth,
} from "@/features/simulation/renderer/particles";
import {
  drawAxes,
  drawFieldVectors,
  drawForceCenter,
  drawGrid,
  drawPotentialHeatmap,
  drawProbe,
  drawWorldFrame,
} from "@/features/simulation/renderer/world";
import { baseTheme } from "@/theme/theme";
import { useCallback } from "react";

type useAnimationLoopProps = {
  refs: CanvasRefs;
  initialize: (_canvas: HTMLCanvasElement) => void;
  setStats: (_stats: SimulationStats) => void;
};

export function useAnimationLoop({
  refs,
  initialize,
  setStats,
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

    const center = settings.forceCenterPoint;

    refs.frameCount.current++;

    world.updateSize(
      settings.worldWidth,
      settings.worldHeight,
      settings.worldZ
    );

    const gridSize =
      Math.max(settings.worldWidth, settings.worldHeight, settings.worldZ) / 2;

    if (settings.showGrid) {
      drawGrid({
        camera: settings.cameraPosition,
        ctx,
        fov: settings.fov,
        size: gridSize,
        spacing: 50,
        viewMode: settings.viewMode,
      });
    }

    drawWorldFrame({
      box: world.box,
      camera: settings.cameraPosition,
      ctx,
      fov: settings.fov,
      viewMode: settings.viewMode,
    });

    if (settings.showAxes) {
      drawAxes({
        camera: settings.cameraPosition,
        center: settings.forceCenterPoint,
        ctx,
        fov: settings.fov,
        size: Math.min(120, gridSize),
        viewMode: settings.viewMode,
      });
    }

    drawForceCenter({
      camera: settings.cameraPosition,
      center: settings.forceCenterPoint,
      ctx,
      fov: settings.fov,
      viewMode: settings.viewMode,
    });

    if (settings.showFieldVectors) {
      drawFieldVectors({
        camera: settings.cameraPosition,
        ctx,
        fov: settings.fov,
        physics,
        size: Math.min(180, gridSize),
        spacing: 60,
        testParticleType: "proton",
        viewMode: settings.viewMode,
      });
    }

    if (settings.showPotentialHeatmap) {
      drawPotentialHeatmap({
        camera: settings.cameraPosition,
        ctx,
        fov: settings.fov,
        physics,
        size: Math.min(190, gridSize),
        spacing: 34,
        testParticleType: settings.probeParticleType,
        viewMode: settings.viewMode,
      });
    }

    const singleStepRequested =
      settings.stepSignal !== refs.lastStepSignal.current;
    if (singleStepRequested) {
      refs.lastStepSignal.current = settings.stepSignal;
    }

    const runPhysicsStep = () => {
      physics.step({
        bounds: {
          width: settings.worldWidth,
          height: settings.worldHeight,
          depth: settings.worldZ,
        },
        center,
        dtSeconds: DT_SECONDS,
        particles,
      });
    };

    if (settings.isPaused) {
      refs.lastPhysicsTime.current = now;
      refs.physicsAccumulator.current = 0;

      if (singleStepRequested) {
        runPhysicsStep();
      }
    } else {
      const fixedStep = getFixedStepCount({
        accumulator: refs.physicsAccumulator.current,
        lastTime: refs.lastPhysicsTime.current,
        now,
      });
      refs.physicsAccumulator.current = fixedStep.accumulator;
      refs.lastPhysicsTime.current = fixedStep.lastTime;

      for (let i = 0; i < fixedStep.steps; i++) {
        runPhysicsStep();
      }
    }

    if (
      refs.frameCount.current % 4 === 0 ||
      refs.sortedParticlesRef.current.length !== particles.length
    ) {
      refs.sortedParticlesRef.current = sortParticlesByDepth(
        particles,
        settings.cameraPosition,
        settings.viewMode
      );
    }

    if (settings.showTrails && settings.trailLength > 0) {
      drawParticleTrails({
        cameraPosition: settings.cameraPosition,
        ctx,
        fov: settings.fov,
        height,
        particles,
        trailHistory: refs.trailHistoryRef.current,
        trailLength: settings.trailLength,
        viewMode: settings.viewMode,
        width,
      });
    } else {
      refs.trailHistoryRef.current.clear();
    }

    drawParticleGroups(
      ctx,
      createParticleDrawGroups({
        cameraPosition: settings.cameraPosition,
        fov: settings.fov,
        height,
        particles: refs.sortedParticlesRef.current,
        showDepthShading: settings.showDepthShading,
        showLabels: settings.showParticleLabels,
        viewMode: settings.viewMode,
        width,
      })
    );

    if (settings.showVelocityVectors) {
      drawParticleVectors({
        cameraPosition: settings.cameraPosition,
        color: "rgba(255, 255, 0, 0.75)",
        ctx,
        fov: settings.fov,
        height,
        particles: refs.sortedParticlesRef.current,
        scale: 0.12,
        viewMode: settings.viewMode,
        vector: (particle) => particle.velocity,
        width,
      });
    }

    if (settings.showForceVectors) {
      drawParticleVectors({
        cameraPosition: settings.cameraPosition,
        color: "rgba(0, 255, 255, 0.75)",
        ctx,
        fov: settings.fov,
        height,
        particles: refs.sortedParticlesRef.current,
        scale: 0.02,
        viewMode: settings.viewMode,
        vector: (particle) => particle.lastAcceleration,
        width,
      });
    }

    if (settings.probeEnabled) {
      drawProbe({
        camera: settings.cameraPosition,
        ctx,
        fov: settings.fov,
        physics,
        point: settings.probePoint,
        testParticleType: settings.probeParticleType,
        viewMode: settings.viewMode,
      });
    }

    mouse.render(ctx, settings.fov, settings.cameraPosition, settings.viewMode);
    ctx.restore();

    refs.requestRef.current = requestAnimationFrame(() => animate(ctx));

    drawFps(ctx, refs.smoothedFps.current);

    if (now - refs.lastStatsTime.current >= 250) {
      refs.lastStatsTime.current = now;
      const potentialEnergy = physics.estimatePotentialEnergy(particles);
      const probeAcceleration = physics.sampleAccelerationAt(
        settings.probePoint,
        settings.probeParticleType
      );
      const probePotential = physics.samplePotentialAt(
        settings.probePoint,
        settings.probeParticleType
      );
      const nextStats = calculateSimulationStats({
        fps: refs.smoothedFps.current,
        particles,
        potentialEnergy,
        probeAcceleration,
        probePotential,
        settings,
      });
      const elapsedSeconds = now / 1000;
      const history = pushSimulationHistory(refs.statsHistoryRef.current, {
        angularMomentum: nextStats.angularMomentum,
        averageSpeed: nextStats.averageSpeed,
        kineticEnergy: nextStats.kineticEnergy,
        momentum: nextStats.momentum,
        potentialEnergy: nextStats.potentialEnergy,
        time: elapsedSeconds,
        totalEnergy: nextStats.totalEnergy,
      });
      refs.statsHistoryRef.current = history;
      setStats(
        calculateSimulationStats({
          fps: refs.smoothedFps.current,
          history: [...history],
          particles,
          potentialEnergy,
          probeAcceleration,
          probePotential,
          settings,
        })
      );
    }
  }, [initialize, refs, setStats]);

  return { animate };
}
