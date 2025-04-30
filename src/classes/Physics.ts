import { Particle } from "@/classes/Particle";
import { Vector3 } from "@/classes/Vector3";

export class Physics {
  grid = new Map<string, Particle[]>();

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
    return `${x},${y},${z}`;
  }

  resolveCollisions() {
    const processed = new Set<string>();

    for (const [key, cellParticles] of this.grid.entries()) {
      const [cx, cy] = key.split(",").map(Number);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborKey = `${cx + dx},${cy + dy}`;
          if (!this.grid.has(neighborKey)) continue;

          const neighborParticles = this.grid.get(neighborKey)!;

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

              const id = `${p1._id}-${p2._id}`;
              if (processed.has(id)) continue;
              processed.add(id);

              const delta = p2.position.clone().sub(p1.position);
              const dist = delta.length();
              const minDist = p1.radius + p2.radius;

              if (dist < minDist) {
                const normal = delta.clone().scale(1 / (dist || 1));
                const overlap = minDist - dist;
                const correction = normal.clone().scale(overlap / 2);

                p1.position.sub(correction);
                p2.position.add(correction);

                const relVel = p2.velocity.clone().sub(p1.velocity);
                const speed = relVel.dot(normal);

                if (speed < 0) {
                  const impulse = normal.clone().scale(speed * -1);
                  p1.velocity.sub(impulse.clone().scale(0.5));
                  p2.velocity.add(impulse.clone().scale(0.5));
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
