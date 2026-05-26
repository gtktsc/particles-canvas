import { describe, expect, it } from "vitest";
import { Particle } from "@/features/simulation/model/Particle";
import { Physics } from "@/features/simulation/model/Physics";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { calculateSimulationStats } from "@/features/simulation/model/simulationStats";
import {
  createDefaultSettings,
  type SimulationSettings,
} from "@/features/simulation/model/SimulationSettingsContext";

const createParticle = (type: "electron" | "proton" | "neutron") => {
  const particle = new Particle(100, 100, 100, type);
  particle.position = new Vector3(0, 0, 0);
  particle.velocity = new Vector3(0, 0, 0);
  return particle;
};

const disableForces = (settings: SimulationSettings) => {
  settings.centerSpringEnabled = false;
  settings.dragEnabled = false;
  settings.uniformFieldEnabled = false;
  settings.electricFieldEnabled = false;
  settings.magneticFieldEnabled = false;
  settings.centralGravityEnabled = false;
  settings.pointChargeFieldEnabled = false;
  settings.chargeEnabled = false;
  settings.gravityEnabled = false;
  settings.lennardJonesEnabled = false;
  settings.pairSpringEnabled = false;
  settings.nuclearEnabled = false;
  settings.shellEnabled = false;
  settings.fluidDragEnabled = false;
  settings.buoyancyEnabled = false;
  settings.collisionEnabled = false;
};

const step = (physics: Physics, particles: Particle[]) => {
  physics.step({
    bounds: { width: 1000, height: 1000, depth: 1000 },
    center: new Vector3(0, 0, 0),
    dtSeconds: 1,
    particles,
  });
};

describe("Physics", () => {
  it("does not apply disabled forces", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.centerSpringStrength = 4;
    settings.chargeStrength = 20_000;
    const physics = new Physics(settings);
    const particle = createParticle("electron");
    particle.position = new Vector3(100, 0, 0);

    step(physics, [particle]);

    expect(particle.velocity).toMatchObject({ x: 0, y: 0, z: 0 });
  });

  it("applies center spring proportional to displacement", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.centerSpringEnabled = true;
    settings.centerSpringStrength = 2;
    const physics = new Physics(settings);
    const particle = createParticle("proton");
    particle.position = new Vector3(100, 0, 0);

    step(physics, [particle]);

    expect(particle.velocity.x).toBeCloseTo(-200);
  });

  it("applies drag opposite to velocity", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.dragEnabled = true;
    settings.dragStrength = 2;
    const physics = new Physics(settings);
    const particle = createParticle("electron");
    particle.velocity = new Vector3(10, 0, 0);

    step(physics, [particle]);

    expect(particle.velocity.x).toBeLessThan(10);
    expect(particle.velocity.x).toBeCloseTo(-10);
  });

  it("applies uniform field as mass-independent acceleration", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.uniformFieldEnabled = true;
    settings.uniformFieldX = 30;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const proton = createParticle("proton");

    step(physics, [electron, proton]);

    expect(electron.velocity.x).toBeCloseTo(30);
    expect(proton.velocity.x).toBeCloseTo(30);
  });

  it("applies electric field by charge sign", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.electricFieldEnabled = true;
    settings.electricFieldX = 120;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const proton = createParticle("proton");
    const neutron = createParticle("neutron");

    step(physics, [electron, proton, neutron]);

    expect(electron.velocity.x).toBeLessThan(0);
    expect(proton.velocity.x).toBeGreaterThan(0);
    expect(neutron.velocity.x).toBe(0);
  });

  it("applies magnetic force perpendicular to velocity", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.magneticFieldEnabled = true;
    settings.magneticFieldZ = 2;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const initialVelocity = new Vector3(10, 0, 0);
    electron.velocity = initialVelocity.clone();

    step(physics, [electron]);

    const deltaVelocity = electron.velocity.clone().sub(initialVelocity);
    expect(deltaVelocity.dot(initialVelocity)).toBeCloseTo(0);
    expect(deltaVelocity.y).toBeGreaterThan(0);
  });

  it("applies softened central inverse-square attraction", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.centralGravityEnabled = true;
    settings.centralGravityStrength = 36_000;
    settings.centralGravitySoftening = 45;
    const physics = new Physics(settings);
    const particle = createParticle("proton");
    particle.position = new Vector3(100, 0, 0);

    step(physics, [particle]);

    expect(particle.velocity.x).toBeLessThan(0);
    expect(Number.isFinite(particle.velocity.x)).toBe(true);

    const nearCenter = createParticle("proton");
    nearCenter.position = new Vector3(0.1, 0, 0);
    step(physics, [nearCenter]);

    expect(Number.isFinite(nearCenter.velocity.x)).toBe(true);
  });

  it("applies point charge field by external charge sign and softening", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.pointChargeFieldEnabled = true;
    settings.pointChargeStrength = 160_000;
    settings.pointChargeAmount = 1;
    settings.pointChargeSoftening = 10;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const proton = createParticle("proton");
    electron.position = new Vector3(100, 0, 0);
    proton.position = new Vector3(100, 0, 0);

    step(physics, [electron, proton]);

    expect(electron.velocity.x).toBeLessThan(0);
    expect(proton.velocity.x).toBeGreaterThan(0);

    const sample = physics.sampleAccelerationAt(new Vector3(0.01, 0, 0), "electron");
    expect(Number.isFinite(sample.x)).toBe(true);
  });

  it("keeps charge forces equal and opposite", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.chargeEnabled = true;
    settings.chargeStrength = 10_000;
    settings.chargeSoftening = 1;
    settings.chargeRange = 100;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const proton = createParticle("proton");
    proton.position = new Vector3(10, 0, 0);

    step(physics, [electron, proton]);

    expect(electron.velocity.x).toBeGreaterThan(0);
    expect(proton.velocity.x).toBeLessThan(0);
    expect(
      electron.velocity.x * electron.mass + proton.velocity.x * proton.mass
    ).toBeCloseTo(0);
  });

  it("repels like charges", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.chargeEnabled = true;
    settings.chargeStrength = 10_000;
    settings.chargeSoftening = 1;
    settings.chargeRange = 100;
    const physics = new Physics(settings);
    const left = createParticle("electron");
    const right = createParticle("electron");
    right.position = new Vector3(10, 0, 0);

    step(physics, [left, right]);

    expect(left.velocity.x).toBeLessThan(0);
    expect(right.velocity.x).toBeGreaterThan(0);
  });

  it("separates overlapping particles during collision resolution", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.collisionEnabled = true;
    const physics = new Physics(settings);
    const left = createParticle("proton");
    const right = createParticle("neutron");
    right.position = new Vector3(4, 0, 0);

    step(physics, [left, right]);

    expect(left.position.distanceTo(right.position)).toBeCloseTo(
      left.radius + right.radius
    );
    expect(left.collided).toBe(true);
    expect(right.collided).toBe(true);
  });

  it("uses mass-weighted collision response", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.collisionEnabled = true;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    const proton = createParticle("proton");
    proton.position = new Vector3(3.5, 0, 0);
    electron.velocity = new Vector3(1, 0, 0);
    proton.velocity = new Vector3(-1, 0, 0);
    const electronStartX = electron.position.x;
    const protonStartX = proton.position.x;
    const momentumBefore =
      electron.velocity.x * electron.mass + proton.velocity.x * proton.mass;

    physics.index([electron, proton], 10);
    physics.resolveCollisions();

    const electronCorrection = Math.abs(electron.position.x - electronStartX);
    const protonCorrection = Math.abs(proton.position.x - protonStartX);
    const momentumAfter =
      electron.velocity.x * electron.mass + proton.velocity.x * proton.mass;

    expect(electronCorrection).toBeGreaterThan(protonCorrection * 100);
    expect(momentumAfter).toBeCloseTo(momentumBefore);
  });

  it("pushes electrons toward their shell radius", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.shellEnabled = true;
    settings.shellConstraintK = 0.5;
    const physics = new Physics(settings);
    const electron = createParticle("electron");
    electron.position = new Vector3(100, 0, 0);
    electron.shellRadius = 50;

    step(physics, [electron]);

    expect(electron.velocity.x).toBeCloseTo(-25);
    expect(electron.velocity.y).toBe(0);
    expect(electron.velocity.z).toBe(0);
  });

  it("applies local gravity within range only", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.gravityEnabled = true;
    settings.gravityRange = 100;
    settings.gravitySoftening = 1;
    settings.gravityStrength = 10;
    const physics = new Physics(settings);
    const left = createParticle("proton");
    const right = createParticle("proton");
    right.position = new Vector3(50, 0, 0);

    step(physics, [left, right]);

    expect(left.velocity.x).toBeGreaterThan(0);
    expect(right.velocity.x).toBeLessThan(0);

    const outsideLeft = createParticle("proton");
    const outsideRight = createParticle("proton");
    outsideRight.position = new Vector3(200, 0, 0);

    step(physics, [outsideLeft, outsideRight]);

    expect(outsideLeft.velocity.x).toBe(0);
    expect(outsideRight.velocity.x).toBe(0);
  });

  it("repels and attracts with Lennard-Jones force", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.lennardJonesEnabled = true;
    settings.lennardJonesRadius = 10;
    settings.lennardJonesRange = 50;
    settings.lennardJonesStrength = 100;
    const physics = new Physics(settings);
    const closeLeft = createParticle("electron");
    const closeRight = createParticle("electron");
    closeRight.position = new Vector3(8, 0, 0);

    step(physics, [closeLeft, closeRight]);

    expect(closeLeft.velocity.x).toBeLessThan(0);
    expect(closeRight.velocity.x).toBeGreaterThan(0);

    const farLeft = createParticle("electron");
    const farRight = createParticle("electron");
    farRight.position = new Vector3(15, 0, 0);

    step(physics, [farLeft, farRight]);

    expect(farLeft.velocity.x).toBeGreaterThan(0);
    expect(farRight.velocity.x).toBeLessThan(0);
  });

  it("clamps near-zero Lennard-Jones acceleration", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.lennardJonesEnabled = true;
    settings.lennardJonesRadius = 10;
    settings.lennardJonesRange = 50;
    settings.lennardJonesStrength = 6_000;
    const physics = new Physics(settings);
    const left = createParticle("electron");
    const right = createParticle("electron");
    right.position = new Vector3(0.1, 0, 0);

    step(physics, [left, right]);

    expect(Number.isFinite(left.velocity.x)).toBe(true);
    expect(Math.abs(left.velocity.x)).toBeLessThanOrEqual(260);
  });

  it("pulls pair springs toward rest length and damps relative velocity", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.pairSpringEnabled = true;
    settings.pairSpringStrength = 1;
    settings.pairSpringRestLength = 40;
    settings.pairSpringDamping = 0;
    settings.pairSpringRange = 120;
    const physics = new Physics(settings);
    const left = createParticle("electron");
    const right = createParticle("electron");
    right.position = new Vector3(80, 0, 0);

    step(physics, [left, right]);

    expect(left.velocity.x).toBeGreaterThan(0);
    expect(right.velocity.x).toBeLessThan(0);

    const dampingSettings = createDefaultSettings();
    disableForces(dampingSettings);
    dampingSettings.pairSpringEnabled = true;
    dampingSettings.pairSpringStrength = 0;
    dampingSettings.pairSpringRestLength = 80;
    dampingSettings.pairSpringDamping = 0.5;
    dampingSettings.pairSpringRange = 120;
    const dampingPhysics = new Physics(dampingSettings);
    const dampingLeft = createParticle("electron");
    const dampingRight = createParticle("electron");
    dampingRight.position = new Vector3(80, 0, 0);
    dampingLeft.velocity = new Vector3(-10, 0, 0);
    dampingRight.velocity = new Vector3(10, 0, 0);

    step(dampingPhysics, [dampingLeft, dampingRight]);

    expect(dampingLeft.velocity.x).toBeGreaterThan(-10);
    expect(dampingRight.velocity.x).toBeLessThan(10);
  });

  it("applies fluid drag against relative medium velocity", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.fluidDragEnabled = true;
    settings.fluidDragLinear = 1;
    settings.fluidDragQuadratic = 0;
    settings.mediumVelocityX = 0;
    const physics = new Physics(settings);
    const particle = createParticle("electron");
    particle.velocity = new Vector3(20, 0, 0);

    step(physics, [particle]);

    expect(particle.velocity.x).toBeLessThan(20);

    const fast = createParticle("electron");
    const slow = createParticle("electron");
    fast.velocity = new Vector3(100, 0, 0);
    slow.velocity = new Vector3(50, 0, 0);
    const quadraticSettings = createDefaultSettings();
    disableForces(quadraticSettings);
    quadraticSettings.fluidDragEnabled = true;
    quadraticSettings.fluidDragLinear = 0;
    quadraticSettings.fluidDragQuadratic = 0.01;
    const quadraticPhysics = new Physics(quadraticSettings);

    step(quadraticPhysics, [fast, slow]);

    expect(100 - fast.velocity.x).toBeGreaterThan(50 - slow.velocity.x);
  });

  it("applies buoyancy upward only below the fluid surface", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.buoyancyEnabled = true;
    settings.buoyancyDensity = 1;
    settings.buoyancyStrength = 20;
    settings.fluidSurfaceY = 0;
    const physics = new Physics(settings);
    const submerged = createParticle("neutron");
    const above = createParticle("neutron");
    submerged.position = new Vector3(0, 10, 0);
    above.position = new Vector3(0, -10, 0);

    step(physics, [submerged, above]);

    expect(submerged.velocity.y).toBeLessThan(0);
    expect(above.velocity.y).toBe(0);
  });

  it("keeps potential estimates finite near softened singularities", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.centralGravityEnabled = true;
    settings.pointChargeFieldEnabled = true;
    settings.pointChargeStrength = 160_000;
    settings.pointChargeSoftening = 10;
    const physics = new Physics(settings);

    const potential = physics.samplePotentialAt(new Vector3(0.01, 0, 0), "proton");

    expect(Number.isFinite(potential)).toBe(true);
  });

  it("reports finite momentum and angular momentum stats", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    const particle = createParticle("proton");
    particle.position = new Vector3(10, 0, 0);
    particle.velocity = new Vector3(0, 10, 0);

    const stats = calculateSimulationStats({
      fps: 60,
      particles: [particle],
      potentialEnergy: 10,
      settings,
    });

    expect(Number.isFinite(stats.momentum)).toBe(true);
    expect(Number.isFinite(stats.angularMomentum)).toBe(true);
    expect(stats.totalEnergy).toBeCloseTo(stats.kineticEnergy + 10);
  });

  it("samples finite acceleration for field overlays", () => {
    const settings = createDefaultSettings();
    disableForces(settings);
    settings.centerSpringEnabled = true;
    settings.uniformFieldEnabled = true;
    settings.electricFieldEnabled = true;
    settings.centralGravityEnabled = true;
    const physics = new Physics(settings);

    const sample = physics.sampleAccelerationAt(new Vector3(30, -20, 10), "proton");

    expect(Number.isFinite(sample.x)).toBe(true);
    expect(Number.isFinite(sample.y)).toBe(true);
    expect(Number.isFinite(sample.z)).toBe(true);
  });
});
