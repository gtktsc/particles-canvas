import type { Physics } from "@/features/simulation/model/Physics";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type { World } from "@/features/simulation/model/World";
import {
  drawAxes,
  drawFieldVectors,
  drawForceCenter,
  drawGrid,
  drawPotentialHeatmap,
  drawWorldFrame,
} from "@/features/simulation/renderer/world";

export function getSimulationGridSize(settings: SimulationSettings) {
  return Math.max(settings.worldWidth, settings.worldHeight, settings.worldZ) / 2;
}

export function drawSimulationOverlays({
  ctx,
  physics,
  settings,
  world,
}: {
  ctx: CanvasRenderingContext2D;
  physics: Physics;
  settings: SimulationSettings;
  world: World;
}) {
  world.updateSize(settings.worldWidth, settings.worldHeight, settings.worldZ);

  const gridSize = getSimulationGridSize(settings);

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
}
