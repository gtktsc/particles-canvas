import { Particle } from "@/features/simulation/model/Particle";
import { Vector3 } from "@/features/simulation/model/Vector3";

export type ParticleDrawCommand = {
  px: number;
  py: number;
  radius: number;
};

export type ParticleDrawGroups = Record<string, ParticleDrawCommand[]>;

export function getParticleCellSize(particles: Particle[]) {
  if (particles.length === 0) return null;

  const maxRadius = Math.max(...particles.map((particle) => particle.radius));
  return maxRadius * 2 * 1.2;
}

export function sortParticlesByDepth(particles: Particle[]) {
  return [...particles].sort((a, b) => a.position.z - b.position.z);
}

export function createParticleDrawGroups({
  cameraPosition,
  fov,
  height,
  particles,
  width,
}: {
  cameraPosition: Vector3;
  fov: number;
  height: number;
  particles: Particle[];
  width: number;
}): ParticleDrawGroups {
  const colorGroups: ParticleDrawGroups = {};
  const pixelBuffer = new Set<number>();

  for (const particle of particles) {
    const projection = particle.projectToScreen(
      width,
      height,
      fov,
      cameraPosition
    );

    if (!projection) continue;

    const pixelX = Math.floor(projection.px);
    const pixelY = Math.floor(projection.py);
    const pixelKey = (pixelX << 16) | pixelY;

    if (pixelBuffer.has(pixelKey)) continue;
    pixelBuffer.add(pixelKey);

    colorGroups[projection.color] ??= [];
    colorGroups[projection.color].push({
      px: projection.px,
      py: projection.py,
      radius: projection.radius,
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
    ctx.beginPath();

    for (const { px, py, radius } of group) {
      ctx.moveTo(px + radius, py);
      ctx.arc(px, py, radius, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();
  }
}
