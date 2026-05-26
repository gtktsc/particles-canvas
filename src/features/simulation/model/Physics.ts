import { Particle } from "@/features/simulation/model/Particle";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";

// Toy simulation units: one fixed step equals one 60 Hz tick, not one SI second.
// Cutoffs keep CPU pair forces bounded and stable for interactive canvas use.
const GRID_OFFSET = 512;
const GRID_MASK = 0x3ff;
const CHARGE_RANGE = 24;
const MASS_REFERENCE = 1836;
const LENNARD_JONES_CUTOFF_MULTIPLIER = 3;
const LENNARD_JONES_MAX_FORCE = 50;
const COLLISION_RESTITUTION = 0.85;

type SimulationBounds = {
  depth: number;
  height: number;
  width: number;
};

type NeighborPairVisitor = (
  p1: Particle,
  p2: Particle,
  delta: Vector3,
  distSq: number
) => void;

export class Physics {
  settings: SimulationSettings;
  grid = new Map<number, Particle[]>();
  private cellSize = 1;

  constructor(settings: SimulationSettings) {
    this.settings = settings;
  }

  step({
    bounds,
    center,
    centerAttraction,
    damping,
    dtScale = 1,
    particles,
  }: {
    bounds: SimulationBounds;
    center: Vector3;
    centerAttraction: number;
    damping: number;
    dtScale?: number;
    particles: Particle[];
  }) {
    for (const particle of particles) {
      particle.clearAcceleration();
    }

    const cellSize = this.getInteractionCellSize(particles);
    this.index(particles, cellSize);

    this.applyCenterAttraction(particles, center, centerAttraction);
    this.resolveCharges();
    this.resolveElectronShells(particles, center);
    this.resolveStrongNuclearForce();
    this.resolveGravity();
    this.resolveLennardJones();

    for (const particle of particles) {
      particle.integrate(dtScale, damping, bounds);
    }

    this.index(particles, cellSize);
    this.resolveCollisions();
  }

  index(particles: Particle[], cellSize: number) {
    this.cellSize = Math.max(1, cellSize);
    this.grid.clear();
    for (const p of particles) {
      const key = this.hash(p.position);
      if (!this.grid.has(key)) this.grid.set(key, []);
      this.grid.get(key)!.push(p);
    }
  }

  private hash(pos: Vector3) {
    const x = Math.floor(pos.x / this.cellSize);
    const y = Math.floor(pos.y / this.cellSize);
    const z = Math.floor(pos.z / this.cellSize);

    return (((x + GRID_OFFSET) & GRID_MASK) << 20) |
           (((y + GRID_OFFSET) & GRID_MASK) << 10) |
           ((z + GRID_OFFSET) & GRID_MASK);
  }

  private getInteractionCellSize(particles: Particle[]) {
    if (particles.length === 0) return 1;

    const maxRadius = Math.max(...particles.map((particle) => particle.radius));
    const sizes = [maxRadius * 2 * 1.2];

    if (this.settings.chargeStrength > 0) sizes.push(CHARGE_RANGE);
    if (this.settings.nuclearStrength > 0) sizes.push(this.settings.nuclearRange);
    if (this.settings.gravityStrength > 0) sizes.push(this.settings.gravityRange);
    if (this.settings.lennardJonesStrength > 0) {
      sizes.push(this.settings.lennardJonesRadius * LENNARD_JONES_CUTOFF_MULTIPLIER);
    }

    return Math.max(1, ...sizes);
  }

  private forEachNeighborPair(visitor: NeighborPairVisitor) {
    for (const [key, cellParticles] of this.grid.entries()) {
      const cx = (key >> 20) & GRID_MASK;
      const cy = (key >> 10) & GRID_MASK;
      const cz = key & GRID_MASK;

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
              nx > GRID_MASK ||
              ny > GRID_MASK ||
              nz > GRID_MASK
            ) {
              continue;
            }

            const neighborKey = ((nx & GRID_MASK) << 20) |
                                ((ny & GRID_MASK) << 10) |
                                (nz & GRID_MASK);
            const neighborParticles = this.grid.get(neighborKey);
            if (!neighborParticles) continue;

            for (const p1 of cellParticles) {
              for (const p2 of neighborParticles) {
                if (p1 === p2 || p1._id >= p2._id) continue;

                const delta = Vector3.scratch1.copyFrom(p2.position).sub(p1.position);
                visitor(p1, p2, delta, delta.lengthSq());
              }
            }
          }
        }
      }
    }
  }

  private applyCenterAttraction(
    particles: Particle[],
    center: Vector3,
    centerAttraction: number
  ) {
    if (centerAttraction === 0) return;

    for (const particle of particles) {
      const toCenter = Vector3.scratch1.copyFrom(center).sub(particle.position);
      const dist = toCenter.length() + 0.01;
      const force = toCenter
        .normalize()
        .scale((centerAttraction / dist) * particle.mass);

      particle.applyForce(force);
    }
  }

  resolveCollisions() {
    this.forEachNeighborPair((p1, p2, delta) => {
      const minDist = p1.radius + p2.radius;
      const dx = Math.abs(delta.x);
      const dy = Math.abs(delta.y);
      const dz = Math.abs(delta.z);

      if (dx > minDist || dy > minDist || dz > minDist) return;

      const dist = delta.length();
      if (dist >= minDist) return;

      const normal = Vector3.scratch2.copyFrom(delta);
      if (dist === 0) {
        normal.x = 1;
        normal.y = 0;
        normal.z = 0;
      } else {
        normal.scale(1 / dist);
      }

      const overlap = minDist - dist;
      const inverseMass1 = 1 / p1.mass;
      const inverseMass2 = 1 / p2.mass;
      const inverseMassSum = inverseMass1 + inverseMass2;
      const correction1 = (overlap * inverseMass1) / inverseMassSum;
      const correction2 = (overlap * inverseMass2) / inverseMassSum;

      p1.position.x -= normal.x * correction1;
      p1.position.y -= normal.y * correction1;
      p1.position.z -= normal.z * correction1;
      p2.position.x += normal.x * correction2;
      p2.position.y += normal.y * correction2;
      p2.position.z += normal.z * correction2;

      const relVel = Vector3.scratch1.copyFrom(p2.velocity).sub(p1.velocity);
      const speed = relVel.dot(normal);
      if (speed < 0) {
        const impulseMagnitude =
          (-(1 + COLLISION_RESTITUTION) * speed) / inverseMassSum;
        const impulse = Vector3.scratch2.copyFrom(normal).scale(impulseMagnitude);

        p1.velocity.sub(Vector3.scratch3.copyFrom(impulse).scale(inverseMass1));
        p2.velocity.add(impulse.scale(inverseMass2));
      }

      p1.collided = p2.collided = true;
    });
  }

  resolveCharges() {
    if (this.settings.chargeStrength <= 0) return;
    const chargeRangeSq = CHARGE_RANGE * CHARGE_RANGE;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (p1.charge === 0 || p2.charge === 0 || distSq > chargeRangeSq) return;

      const softenedDistSq = distSq + 1;
      const chargeProduct = p1.charge * p2.charge;
      const forceMagnitude =
        (this.settings.chargeStrength * Math.abs(chargeProduct)) / softenedDistSq;
      const force = delta
        .normalize()
        .scale(chargeProduct < 0 ? forceMagnitude : -forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolveStrongNuclearForce() {
    const range = this.settings.nuclearRange;
    const strength = this.settings.nuclearStrength;
    if (range <= 0 || strength <= 0) return;

    const rangeSq = range * range;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (p1.type === "electron" || p2.type === "electron" || distSq > rangeSq) {
        return;
      }

      const dist = Math.sqrt(distSq);
      const force = delta
        .normalize()
        .scale((1 - dist / range) * strength);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolveElectronShells(particles: Particle[], center: Vector3) {
    const k = this.settings.shellConstraintK;
    if (k === 0) return;

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

  resolveGravity() {
    const range = this.settings.gravityRange;
    const strength = this.settings.gravityStrength;
    if (range <= 0 || strength <= 0) return;

    const rangeSq = range * range;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (distSq === 0 || distSq > rangeSq) return;

      const forceMagnitude =
        (strength * p1.mass * p2.mass) / (MASS_REFERENCE * (distSq + 25));
      const force = delta.normalize().scale(forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolveLennardJones() {
    const radius = this.settings.lennardJonesRadius;
    const strength = this.settings.lennardJonesStrength;
    if (radius <= 0 || strength <= 0) return;

    const cutoff = radius * LENNARD_JONES_CUTOFF_MULTIPLIER;
    const cutoffSq = cutoff * cutoff;
    const minDist = radius * 0.35;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (distSq === 0 || distSq > cutoffSq) return;

      const dist = Math.max(Math.sqrt(distSq), minDist);
      const ratio = radius / dist;
      const ratio6 = ratio ** 6;
      const unclampedForce = strength * (ratio6 * ratio6 - ratio6);
      const forceMagnitude = Math.max(
        -LENNARD_JONES_MAX_FORCE,
        Math.min(LENNARD_JONES_MAX_FORCE, unclampedForce)
      );

      if (forceMagnitude === 0) return;

      const force = delta.normalize().scale(-forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }
}
