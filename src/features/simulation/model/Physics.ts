import { Particle, type ParticleType } from "@/features/simulation/model/Particle";
import {
  COLLISION_RESTITUTION,
  DT_SECONDS,
  LENNARD_JONES_MAX_FORCE,
  MASS_REFERENCE,
} from "@/features/simulation/model/physicsConstants";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";

// Toy simulation units: one fixed step equals one 60 Hz tick, not one SI second.
// Cutoffs and softening keep CPU pair forces bounded for classroom interaction.
const GRID_OFFSET = 512;
const GRID_MASK = 0x3ff;

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
    dtSeconds = DT_SECONDS,
    particles,
  }: {
    bounds: SimulationBounds;
    center: Vector3;
    dtSeconds?: number;
    particles: Particle[];
  }) {
    for (const particle of particles) {
      particle.clearAcceleration();
    }

    const cellSize = this.getInteractionCellSize(particles);
    this.index(particles, cellSize);

    this.applyCenterSpring(particles, center);
    this.applyDrag(particles);
    this.applyUniformField(particles);
    this.applyElectricField(particles);
    this.applyMagneticField(particles);
    this.applyCentralGravity(particles, center);
    this.applyPointChargeField(particles, center);
    this.applyFluidDrag(particles);
    this.applyBuoyancy(particles);
    this.resolveCharges();
    this.resolveElectronShells(particles, center);
    this.resolveStrongNuclearForce();
    this.resolveGravity();
    this.resolveLennardJones();
    this.resolvePairSpring();

    for (const particle of particles) {
      particle.integrate(dtSeconds, bounds);
    }

    if (this.settings.collisionEnabled) {
      this.index(particles, cellSize);
      this.resolveCollisions();
    }
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

    if (this.settings.chargeEnabled) sizes.push(this.settings.chargeRange);
    if (this.settings.nuclearEnabled) sizes.push(this.settings.nuclearRange);
    if (this.settings.gravityEnabled) sizes.push(this.settings.gravityRange);
    if (this.settings.pairSpringEnabled) sizes.push(this.settings.pairSpringRange);
    if (this.settings.lennardJonesEnabled) {
      sizes.push(this.settings.lennardJonesRange);
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

  private applyCenterSpring(particles: Particle[], center: Vector3) {
    if (!this.settings.centerSpringEnabled || this.settings.centerSpringStrength <= 0) {
      return;
    }

    for (const particle of particles) {
      const displacement = Vector3.scratch1.copyFrom(center).sub(particle.position);
      const distance = displacement.length();
      const force = displacement
        .normalize()
        .scale(distance * this.settings.centerSpringStrength * particle.mass);

      particle.applyForce(force);
    }
  }

  sampleAccelerationAt(point: Vector3, testParticleType: ParticleType) {
    const acceleration = new Vector3();
    const { charge, mass } = this.getParticleProperties(testParticleType);

    this.addCenterSpringAcceleration(acceleration, point);
    this.addUniformFieldAcceleration(acceleration);
    this.addElectricFieldAcceleration(acceleration, charge, mass);
    this.addCentralGravityAcceleration(
      acceleration,
      point,
      this.settings.forceCenterPoint
    );
    this.addPointChargeFieldAcceleration(
      acceleration,
      point,
      this.settings.forceCenterPoint,
      charge,
      mass
    );
    this.addBuoyancyAcceleration(acceleration, point);

    return acceleration;
  }

  samplePotentialAt(point: Vector3, testParticleType: ParticleType) {
    const { charge, mass } = this.getParticleProperties(testParticleType);
    let potential = 0;

    if (this.settings.centerSpringEnabled && this.settings.centerSpringStrength > 0) {
      const displacement = point.distanceTo(this.settings.forceCenterPoint);
      potential +=
        0.5 * mass * this.settings.centerSpringStrength * displacement * displacement;
    }

    if (
      this.settings.centralGravityEnabled &&
      this.settings.centralGravityStrength > 0
    ) {
      const softenedDistance = Math.sqrt(
        point.distanceTo(this.settings.forceCenterPoint) ** 2 +
          this.settings.centralGravitySoftening ** 2
      );
      potential -= (mass * this.settings.centralGravityStrength) / softenedDistance;
    }

    if (
      this.settings.pointChargeFieldEnabled &&
      this.settings.pointChargeStrength > 0 &&
      charge !== 0
    ) {
      const softenedDistance = Math.sqrt(
        point.distanceTo(this.settings.forceCenterPoint) ** 2 +
          this.settings.pointChargeSoftening ** 2
      );
      potential +=
        (this.settings.pointChargeStrength *
          this.settings.pointChargeAmount *
          charge) /
        softenedDistance;
    }

    return Number.isFinite(potential) ? potential : 0;
  }

  estimatePotentialEnergy(particles: Particle[]) {
    let potential = 0;

    for (const particle of particles) {
      potential += this.samplePotentialAt(particle.position, particle.type);
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const distSq = p1.position.distanceTo(p2.position) ** 2;

        if (this.settings.lennardJonesEnabled) {
          const rangeSq =
            this.settings.lennardJonesRange * this.settings.lennardJonesRange;
          if (distSq > 0 && distSq <= rangeSq) {
            const dist = Math.max(
              Math.sqrt(distSq),
              this.settings.lennardJonesRadius * 0.35
            );
            const ratio = this.settings.lennardJonesRadius / dist;
            const ratio6 = ratio ** 6;
            potential +=
              4 *
              this.settings.lennardJonesStrength *
              (ratio6 * ratio6 - ratio6);
          }
        }

        if (this.settings.pairSpringEnabled) {
          const rangeSq = this.settings.pairSpringRange * this.settings.pairSpringRange;
          if (distSq > 0 && distSq <= rangeSq) {
            const extension =
              Math.sqrt(distSq) - this.settings.pairSpringRestLength;
            potential +=
              0.5 * this.settings.pairSpringStrength * extension * extension;
          }
        }
      }
    }

    return Number.isFinite(potential) ? potential : 0;
  }

  private getParticleProperties(type: ParticleType) {
    switch (type) {
      case "electron":
        return { charge: -1, mass: 1 };
      case "proton":
        return { charge: 1, mass: 1836 };
      case "neutron":
        return { charge: 0, mass: 1839 };
    }
  }

  private addCenterSpringAcceleration(acceleration: Vector3, point: Vector3) {
    if (!this.settings.centerSpringEnabled || this.settings.centerSpringStrength <= 0) {
      return;
    }

    acceleration.add(
      Vector3.scratch1
        .copyFrom(this.settings.forceCenterPoint)
        .sub(point)
        .scale(this.settings.centerSpringStrength)
    );
  }

  private addUniformFieldAcceleration(acceleration: Vector3) {
    if (!this.settings.uniformFieldEnabled) return;

    acceleration.add(
      new Vector3(
        this.settings.uniformFieldX,
        this.settings.uniformFieldY,
        this.settings.uniformFieldZ
      )
    );
  }

  private addElectricFieldAcceleration(
    acceleration: Vector3,
    charge: number,
    mass: number
  ) {
    if (!this.settings.electricFieldEnabled || charge === 0) return;

    acceleration.add(
      new Vector3(
        (this.settings.electricFieldX * charge) / mass,
        (this.settings.electricFieldY * charge) / mass,
        (this.settings.electricFieldZ * charge) / mass
      )
    );
  }

  private addCentralGravityAcceleration(
    acceleration: Vector3,
    point: Vector3,
    center: Vector3
  ) {
    if (
      !this.settings.centralGravityEnabled ||
      this.settings.centralGravityStrength <= 0
    ) {
      return;
    }

    const towardCenter = Vector3.scratch1.copyFrom(center).sub(point);
    const distSq = towardCenter.lengthSq();
    const softeningSq =
      this.settings.centralGravitySoftening *
      this.settings.centralGravitySoftening;
    const denom = (distSq + softeningSq) ** 1.5 || 1;

    acceleration.add(
      towardCenter.scale(this.settings.centralGravityStrength / denom)
    );
  }

  private addPointChargeFieldAcceleration(
    acceleration: Vector3,
    point: Vector3,
    center: Vector3,
    charge: number,
    mass: number
  ) {
    if (
      !this.settings.pointChargeFieldEnabled ||
      this.settings.pointChargeStrength <= 0 ||
      charge === 0
    ) {
      return;
    }

    const fromCenter = point.clone().sub(center);
    const distSq = fromCenter.lengthSq();
    const softeningSq =
      this.settings.pointChargeSoftening * this.settings.pointChargeSoftening;
    const denom = (distSq + softeningSq) ** 1.5 || 1;

    acceleration.add(
      fromCenter.scale(
        (this.settings.pointChargeStrength *
          this.settings.pointChargeAmount *
          charge) /
          (mass * denom)
      )
    );
  }

  private addBuoyancyAcceleration(acceleration: Vector3, point: Vector3) {
    if (
      !this.settings.buoyancyEnabled ||
      this.settings.buoyancyDensity <= 0 ||
      this.settings.buoyancyStrength <= 0 ||
      point.y < this.settings.fluidSurfaceY
    ) {
      return;
    }

    acceleration.y -= this.settings.buoyancyDensity * this.settings.buoyancyStrength;
  }

  private applyDrag(particles: Particle[]) {
    if (!this.settings.dragEnabled || this.settings.dragStrength <= 0) return;

    for (const particle of particles) {
      const force = Vector3.scratch1
        .copyFrom(particle.velocity)
        .scale(-this.settings.dragStrength * particle.mass);

      particle.applyForce(force);
    }
  }

  private applyUniformField(particles: Particle[]) {
    if (!this.settings.uniformFieldEnabled) return;

    for (const particle of particles) {
      particle.applyForce(
        new Vector3(
          this.settings.uniformFieldX * particle.mass,
          this.settings.uniformFieldY * particle.mass,
          this.settings.uniformFieldZ * particle.mass
        )
      );
    }
  }

  private applyElectricField(particles: Particle[]) {
    if (!this.settings.electricFieldEnabled) return;

    for (const particle of particles) {
      if (particle.charge === 0) continue;

      particle.applyForce(
        new Vector3(
          this.settings.electricFieldX * particle.charge,
          this.settings.electricFieldY * particle.charge,
          this.settings.electricFieldZ * particle.charge
        )
      );
    }
  }

  private applyMagneticField(particles: Particle[]) {
    if (!this.settings.magneticFieldEnabled || this.settings.magneticFieldZ === 0) {
      return;
    }

    const bz = this.settings.magneticFieldZ;

    for (const particle of particles) {
      if (particle.charge === 0) continue;

      particle.applyForce(
        new Vector3(
          particle.velocity.y * bz * particle.charge,
          -particle.velocity.x * bz * particle.charge,
          0
        )
      );
    }
  }

  private applyCentralGravity(particles: Particle[], center: Vector3) {
    if (
      !this.settings.centralGravityEnabled ||
      this.settings.centralGravityStrength <= 0
    ) {
      return;
    }

    for (const particle of particles) {
      const acceleration = new Vector3();
      this.addCentralGravityAcceleration(acceleration, particle.position, center);
      particle.applyForce(acceleration.scale(particle.mass));
    }
  }

  private applyPointChargeField(particles: Particle[], center: Vector3) {
    if (
      !this.settings.pointChargeFieldEnabled ||
      this.settings.pointChargeStrength <= 0
    ) {
      return;
    }

    for (const particle of particles) {
      if (particle.charge === 0) continue;

      const acceleration = new Vector3();
      this.addPointChargeFieldAcceleration(
        acceleration,
        particle.position,
        center,
        particle.charge,
        particle.mass
      );
      particle.applyForce(acceleration.scale(particle.mass));
    }
  }

  private applyFluidDrag(particles: Particle[]) {
    if (
      !this.settings.fluidDragEnabled ||
      (this.settings.fluidDragLinear <= 0 && this.settings.fluidDragQuadratic <= 0)
    ) {
      return;
    }

    const mediumVelocity = new Vector3(
      this.settings.mediumVelocityX,
      this.settings.mediumVelocityY,
      this.settings.mediumVelocityZ
    );

    for (const particle of particles) {
      const relativeVelocity = particle.velocity.clone().sub(mediumVelocity);
      const speed = relativeVelocity.length();
      if (speed === 0) continue;

      const acceleration = relativeVelocity.scale(
        -(this.settings.fluidDragLinear +
          this.settings.fluidDragQuadratic * speed)
      );
      particle.applyForce(acceleration.scale(particle.mass));
    }
  }

  private applyBuoyancy(particles: Particle[]) {
    if (
      !this.settings.buoyancyEnabled ||
      this.settings.buoyancyDensity <= 0 ||
      this.settings.buoyancyStrength <= 0
    ) {
      return;
    }

    for (const particle of particles) {
      if (particle.position.y < this.settings.fluidSurfaceY) continue;

      const volumeScale = Math.max(0.25, particle.radius / 3);
      const acceleration =
        this.settings.buoyancyDensity *
        this.settings.buoyancyStrength *
        volumeScale;

      particle.applyForce(new Vector3(0, -particle.mass * acceleration, 0));
    }
  }

  resolveCollisions() {
    if (!this.settings.collisionEnabled) return;

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
    if (!this.settings.chargeEnabled || this.settings.chargeStrength <= 0) return;

    const rangeSq = this.settings.chargeRange * this.settings.chargeRange;
    const softeningSq = this.settings.chargeSoftening * this.settings.chargeSoftening;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (p1.charge === 0 || p2.charge === 0 || distSq > rangeSq) return;

      const chargeProduct = p1.charge * p2.charge;
      const forceMagnitude =
        (this.settings.chargeStrength * Math.abs(chargeProduct)) /
        (distSq + softeningSq);
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
    if (!this.settings.nuclearEnabled || range <= 0 || strength <= 0) return;

    const rangeSq = range * range;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (p1.type === "electron" || p2.type === "electron" || distSq > rangeSq) {
        return;
      }

      const dist = Math.sqrt(distSq);
      const force = delta
        .normalize()
        .scale((1 - dist / range) * strength * MASS_REFERENCE);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolveElectronShells(particles: Particle[], center: Vector3) {
    const k = this.settings.shellConstraintK;
    if (!this.settings.shellEnabled || k <= 0) return;

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
    if (!this.settings.gravityEnabled || range <= 0 || strength <= 0) return;

    const rangeSq = range * range;
    const softeningSq =
      this.settings.gravitySoftening * this.settings.gravitySoftening;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (distSq === 0 || distSq > rangeSq) return;

      const forceMagnitude =
        (strength * p1.mass * p2.mass) / (MASS_REFERENCE * (distSq + softeningSq));
      const force = delta.normalize().scale(forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolveLennardJones() {
    const sigma = this.settings.lennardJonesRadius;
    const epsilon = this.settings.lennardJonesStrength;
    if (!this.settings.lennardJonesEnabled || sigma <= 0 || epsilon <= 0) return;

    const rangeSq = this.settings.lennardJonesRange * this.settings.lennardJonesRange;
    const minDist = sigma * 0.35;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (distSq === 0 || distSq > rangeSq) return;

      const dist = Math.max(Math.sqrt(distSq), minDist);
      const ratio = sigma / dist;
      const ratio6 = ratio ** 6;
      const forceMagnitude = Math.max(
        -LENNARD_JONES_MAX_FORCE,
        Math.min(
          LENNARD_JONES_MAX_FORCE,
          (24 * epsilon * (2 * ratio6 * ratio6 - ratio6)) / dist
        )
      );

      if (forceMagnitude === 0) return;

      const force = delta.normalize().scale(-forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }

  resolvePairSpring() {
    if (
      !this.settings.pairSpringEnabled ||
      (this.settings.pairSpringStrength <= 0 &&
        this.settings.pairSpringDamping <= 0) ||
      this.settings.pairSpringRange <= 0
    ) {
      return;
    }

    const rangeSq = this.settings.pairSpringRange * this.settings.pairSpringRange;

    this.forEachNeighborPair((p1, p2, delta, distSq) => {
      if (distSq === 0 || distSq > rangeSq) return;

      const dist = Math.sqrt(distSq);
      const normal = delta.normalize();
      const relVelAlongSpring = p2.velocity.clone().sub(p1.velocity).dot(normal);
      const forceMagnitude =
        this.settings.pairSpringStrength *
          (dist - this.settings.pairSpringRestLength) +
        this.settings.pairSpringDamping * relVelAlongSpring;
      const force = normal.scale(forceMagnitude);

      p1.applyForce(force);
      p2.applyForce(Vector3.scratch2.copyFrom(force).scale(-1));
    });
  }
}
