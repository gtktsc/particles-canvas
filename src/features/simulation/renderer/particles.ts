import { Particle } from "@/features/simulation/model/Particle";
import type { ViewMode } from "@/features/simulation/model/SimulationSettingsContext";
import { Vector3 } from "@/features/simulation/model/Vector3";
import {
  getViewDepth,
  projectPoint,
} from "@/features/simulation/renderer/projection";
import { baseTheme } from "@/theme/theme";
import { rgba } from "@/theme/utils";

export type ParticleDrawCommand = {
  collided: boolean;
  label?: string;
  px: number;
  py: number;
  radius: number;
  scale: number;
};

export type ParticleDrawGroups = Record<string, ParticleDrawCommand[]>;

export function getParticleCellSize(particles: Particle[]) {
  if (particles.length === 0) return null;

  const maxRadius = Math.max(...particles.map((particle) => particle.radius));
  return maxRadius * 2 * 1.2;
}

export function sortParticlesByDepth(
  particles: Particle[],
  cameraPosition = new Vector3(),
  viewMode: ViewMode = "front"
) {
  return [...particles].sort(
    (a, b) =>
      getViewDepth(a.position, cameraPosition, viewMode) -
      getViewDepth(b.position, cameraPosition, viewMode)
  );
}

function getParticleLabel(particle: Particle) {
  if (particle.type === "electron") return "Negative";
  if (particle.type === "proton") return "Positive";
  return "Neutral";
}

function getParticleBaseColor(particle: Particle) {
  if (particle.charge === -1) return baseTheme.color.particleElectron;
  if (particle.charge === 1) return baseTheme.color.particleProton;
  return baseTheme.color.particleNeutron;
}

function getDepthColor(particle: Particle, scale: number, showDepthShading: boolean) {
  if (!showDepthShading) return getParticleBaseColor(particle);

  const alpha = Math.max(0.42, Math.min(1, 0.35 + scale * 0.75));

  if (particle.charge === -1) {
    return rgba(baseTheme.color.particleDepthElectronRgb, alpha);
  }
  if (particle.charge === 1) {
    return rgba(baseTheme.color.particleDepthProtonRgb, alpha);
  }
  return rgba(baseTheme.color.particleDepthNeutronRgb, alpha);
}

export function createParticleDrawGroups({
  cameraPosition,
  fov,
  height,
  particles,
  showDepthShading = false,
  showLabels = false,
  viewMode = "front",
  width,
}: {
  cameraPosition: Vector3;
  fov: number;
  height: number;
  particles: Particle[];
  showDepthShading?: boolean;
  showLabels?: boolean;
  viewMode?: ViewMode;
  width: number;
}): ParticleDrawGroups {
  const colorGroups: ParticleDrawGroups = {};
  const pixelBuffer = new Set<number>();

  for (const particle of particles) {
    const projection = projectPoint({
      camera: cameraPosition,
      canvasHeight: height,
      canvasWidth: width,
      fov,
      point: particle.position,
      viewMode,
    });

    if (!projection) continue;

    const radius = Math.max(2, projection.scale * particle.radius);

    if (
      projection.x + radius < 0 ||
      projection.x - radius > width ||
      projection.y + radius < 0 ||
      projection.y - radius > height
    ) {
      continue;
    }

    const pixelX = Math.floor(projection.x);
    const pixelY = Math.floor(projection.y);
    const pixelKey = (pixelX << 16) | pixelY;

    if (pixelBuffer.has(pixelKey)) continue;
    pixelBuffer.add(pixelKey);

    const color = getDepthColor(particle, projection.scale, showDepthShading);
    colorGroups[color] ??= [];
    colorGroups[color].push({
      collided: particle.collided,
      label: showLabels ? getParticleLabel(particle) : undefined,
      px: projection.x,
      py: projection.y,
      radius,
      scale: projection.scale,
    });
  }

  return colorGroups;
}

export function drawParticleGroups(
  ctx: CanvasRenderingContext2D,
  colorGroups: ParticleDrawGroups
) {
  for (const color in colorGroups) {
    const group = colorGroups[color];

    for (const { collided, px, py, radius } of group) {
      if (!collided) continue;

      ctx.beginPath();
      ctx.arc(px, py, radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = baseTheme.color.particleCollisionRing;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.beginPath();

    for (const { px, py, radius } of group) {
      ctx.moveTo(px + radius, py);
      ctx.arc(px, py, radius, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();

    for (const { label, px, py, radius } of group) {
      if (!label) continue;

      ctx.fillStyle = baseTheme.color.particleLabel;
      ctx.font = baseTheme.typography.canvasLabelFont;
      ctx.fillText(label, px + radius + 4, py - radius - 2);
    }
  }
}

function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const headLength = 5;

  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.lineTo(
    end.x - headLength * Math.cos(angle - Math.PI / 7),
    end.y - headLength * Math.sin(angle - Math.PI / 7)
  );
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - headLength * Math.cos(angle + Math.PI / 7),
    end.y - headLength * Math.sin(angle + Math.PI / 7)
  );
}

export function drawParticleVectors({
  cameraPosition,
  color,
  ctx,
  fov,
  height,
  particles,
  scale,
  viewMode = "front",
  vector,
  width,
}: {
  cameraPosition: Vector3;
  color: string;
  ctx: CanvasRenderingContext2D;
  fov: number;
  height: number;
  particles: Particle[];
  scale: number;
  viewMode?: ViewMode;
  vector: (_particle: Particle) => Vector3;
  width: number;
}) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (const particle of particles) {
    const projection = projectPoint({
      camera: cameraPosition,
      canvasHeight: height,
      canvasWidth: width,
      fov,
      point: particle.position,
      viewMode,
    });
    if (!projection) continue;

    const value = vector(particle).clone().scale(scale);
    if (value.lengthSq() < 0.0001) continue;

    const end = projectPoint({
      camera: cameraPosition,
      canvasHeight: height,
      canvasWidth: width,
      fov,
      point: particle.position.clone().add(value),
      viewMode,
    });
    if (!end) continue;

    drawVectorArrow(ctx, projection, end);
  }

  ctx.stroke();
}

export function drawParticleTrails({
  cameraPosition,
  ctx,
  fov,
  height,
  particles,
  trailHistory,
  trailLength,
  viewMode = "front",
  width,
}: {
  cameraPosition: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  height: number;
  particles: Particle[];
  trailHistory: Map<number, Vector3[]>;
  trailLength: number;
  viewMode?: ViewMode;
  width: number;
}) {
  const activeIds = new Set<number>();

  for (const particle of particles) {
    activeIds.add(particle._id);
    const trail = trailHistory.get(particle._id) ?? [];
    trail.push(particle.position.clone());

    while (trail.length > trailLength) {
      trail.shift();
    }

    trailHistory.set(particle._id, trail);
  }

  for (const id of trailHistory.keys()) {
    if (!activeIds.has(id)) trailHistory.delete(id);
  }

  ctx.lineWidth = 1;

  for (const trail of trailHistory.values()) {
    if (trail.length < 2) continue;

    ctx.beginPath();
    let started = false;

    for (const point of trail) {
      const projection = projectPoint({
        camera: cameraPosition,
        canvasHeight: height,
        canvasWidth: width,
        fov,
        point,
        viewMode,
      });
      if (!projection) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(projection.x, projection.y);
        started = true;
      } else {
        ctx.lineTo(projection.x, projection.y);
      }
    }

    ctx.strokeStyle = baseTheme.color.particleTrail;
    ctx.stroke();
  }
}
