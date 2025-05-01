import { Particle } from "@/classes/Particle";
import { Vector3 } from "@/classes/Vector3";

export class Physics {
  grid = new Map<number, Particle[]>();

  index(particles: Particle[], cellSize: number) {
    this.grid.clear();
    for (const p of particles) {
      const key = this.hash(p.position, cellSize);
      if (!this.grid.has(key)) this.grid.set(key, []);
      this.grid.get(key)!.push(p);
    }
  }

  private hash(pos: Vector3, cellSize: number) {
    const x = Math.floor(pos.x / cellSize);
    const y = Math.floor(pos.y / cellSize);
    const z = Math.floor(pos.z / cellSize);

    const OFFSET = 512;
    const key =
      (((x + OFFSET) & 0x3ff) << 20) |
      (((y + OFFSET) & 0x3ff) << 10) |
      ((z + OFFSET) & 0x3ff);

    return key;
  }

  resolveCollisions() {
    const processed = new Set<number>();

    for (const [key, cellParticles] of this.grid.entries()) {
      const cx = (key >> 20) & 0x3ff;
      const cy = (key >> 10) & 0x3ff;
      const cz = key & 0x3ff;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const nx = cx + dx;
            const ny = cy + dy;
            const nz = cz + dz;

            if (
              nx < 0 ||
              ny < 0 ||
              nz < 0 ||
              nx > 1023 ||
              ny > 1023 ||
              nz > 1023
            )
              continue;

            const neighborKey =
              ((nx & 0x3ff) << 20) | ((ny & 0x3ff) << 10) | (nz & 0x3ff);
            const neighborParticles = this.grid.get(neighborKey);
            if (!neighborParticles) continue;

            for (const p1 of cellParticles) {
              for (const p2 of neighborParticles) {
                if (p1 === p2 || p1._id >= p2._id) continue;

                const dx = Math.abs(p2.position.x - p1.position.x);
                const dy = Math.abs(p2.position.y - p1.position.y);
                const dz = Math.abs(p2.position.z - p1.position.z);
                if (
                  dx > p1.radius + p2.radius ||
                  dy > p1.radius + p2.radius ||
                  dz > p1.radius + p2.radius
                )
                  continue;

                const min = Math.min(p1._id, p2._id);
                const max = Math.max(p1._id, p2._id);
                const id = (min << 16) | max;

                if (processed.has(id)) continue;
                processed.add(id);

                const delta = Vector3.scratch1
                  .copyFrom(p2.position)
                  .sub(p1.position);
                const dist = delta.length();
                const minDist = p1.radius + p2.radius;

                if (dist < minDist) {
                  const normal = Vector3.scratch2
                    .copyFrom(delta)
                    .scale(1 / (dist || 1));
                  const overlap = minDist - dist;
                  const correction = Vector3.scratch3
                    .copyFrom(normal)
                    .scale(overlap / 2);

                  p1.position.sub(correction);
                  p2.position.add(correction);

                  const relVel = Vector3.scratch1
                    .copyFrom(p2.velocity)
                    .sub(p1.velocity);
                  const speed = relVel.dot(normal);

                  if (speed < 0) {
                    const impulse = Vector3.scratch2
                      .copyFrom(normal)
                      .scale(-speed);
                    p1.velocity.sub(
                      Vector3.scratch3.copyFrom(impulse).scale(0.5)
                    );
                    p2.velocity.add(impulse.scale(0.5));
                  }

                  p1.collided = p2.collided = true;
                }
              }
            }
          }
        }
      }
    }
  }
}
