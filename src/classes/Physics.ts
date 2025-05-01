import { Particle } from "@/classes/Particle";
import { Vector3 } from "@/classes/Vector3";
import { SimulationSettings } from "@/context/SimulationSettingsContext";

export class Physics {
  settings: SimulationSettings;
  grid = new Map<number, Particle[]>();

  constructor(settings: SimulationSettings) {
    this.settings = settings;
  }

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
    return (((x + OFFSET) & 0x3ff) << 20) |
           (((y + OFFSET) & 0x3ff) << 10) |
           ((z + OFFSET) & 0x3ff);
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

            if (nx < 0 || ny < 0 || nz < 0 || nx > 1023 || ny > 1023 || nz > 1023) continue;

            const neighborKey = ((nx & 0x3ff) << 20) | ((ny & 0x3ff) << 10) | (nz & 0x3ff);
            const neighborParticles = this.grid.get(neighborKey);
            if (!neighborParticles) continue;

            for (const p1 of cellParticles) {
              for (const p2 of neighborParticles) {
                if (p1 === p2 || p1._id >= p2._id) continue;

                const dx = Math.abs(p2.position.x - p1.position.x);
                const dy = Math.abs(p2.position.y - p1.position.y);
                const dz = Math.abs(p2.position.z - p1.position.z);
                if (dx > p1.radius + p2.radius || dy > p1.radius + p2.radius || dz > p1.radius + p2.radius) continue;

                const id = (Math.min(p1._id, p2._id) << 16) | Math.max(p1._id, p2._id);
                if (processed.has(id)) continue;
                processed.add(id);

                const delta = Vector3.scratch1.copyFrom(p2.position).sub(p1.position);
                const dist = delta.length();
                const minDist = p1.radius + p2.radius;

                if (dist < minDist) {
                  const normal = Vector3.scratch2.copyFrom(delta).scale(1 / (dist || 1));
                  const overlap = minDist - dist;
                  const correction = Vector3.scratch3.copyFrom(normal).scale(overlap / 2);
                  p1.position.sub(correction);
                  p2.position.add(correction);

                  const relVel = Vector3.scratch1.copyFrom(p2.velocity).sub(p1.velocity);
                  const speed = relVel.dot(normal);
                  if (speed < 0) {
                    const impulse = Vector3.scratch2.copyFrom(normal).scale(-speed);
                    p1.velocity.sub(Vector3.scratch3.copyFrom(impulse).scale(0.5));
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

  resolveCharges() {
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

            if (nx < 0 || ny < 0 || nz < 0 || nx > 1023 || ny > 1023 || nz > 1023) continue;

            const neighborKey = ((nx & 0x3ff) << 20) | ((ny & 0x3ff) << 10) | (nz & 0x3ff);
            const neighborParticles = this.grid.get(neighborKey);
            if (!neighborParticles) continue;

            for (const p1 of cellParticles) {
              if (p1.charge === 0) continue;

              for (const p2 of neighborParticles) {
                if (p2.charge === 0 || p1 === p2 || p1._id >= p2._id) continue;

                const id = (Math.min(p1._id, p2._id) << 16) | Math.max(p1._id, p2._id);
                if (processed.has(id)) continue;
                processed.add(id);

                const dir = Vector3.scratch1.copyFrom(p2.position).sub(p1.position);
                const distSq = dir.lengthSq() + 1;

                const forceMagnitude = (this.settings.chargeStrength * Math.abs(p1.charge * p2.charge)) / distSq;
                const force = dir.normalize().scale(
                  p1.charge * p2.charge < 0 ? forceMagnitude : -forceMagnitude
                );

                p1.applyForce(force);
                p2.applyForce(force.clone().scale(-1));
              }
            }
          }
        }
      }
    }
  }

  resolveStrongNuclearForce(particles: Particle[]) {
    const range = this.settings.nuclearRange;
    const strength = this.settings.nuclearStrength;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      if (p1.type === "electron") continue;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (p2.type === "electron") continue;

        const delta = Vector3.scratch1.copyFrom(p2.position).sub(p1.position);
        const dist = delta.length();
        if (dist > range) continue;

        const force = delta
          .normalize()
          .scale((1 - dist / range) * strength);

        p1.applyForce(force);
        p2.applyForce(force.clone().scale(-1));
      }
    }
  }

  resolveElectronShells(particles: Particle[], center: Vector3) {
    const k = this.settings.shellConstraintK;

    for (const p of particles) {
      if (p.type !== "electron") continue;

      const toCenter = Vector3.scratch1.copyFrom(center).sub(p.position);
      const dist = toCenter.length();
      const target = p.shellRadius ?? this.settings.defaultElectronRadius;
      const offset = dist - target;

      const force = toCenter.normalize().scale(k * offset);
      p.applyForce(force);
    }
  }
}
