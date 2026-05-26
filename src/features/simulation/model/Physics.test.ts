import { describe, expect, it } from "vitest";
import { Particle } from "@/features/simulation/model/Particle";
import { Physics } from "@/features/simulation/model/Physics";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";

const createParticle = (type: "electron" | "proton" | "neutron") => {
  const particle = new Particle(100, 100, 100, type);
  particle.position = new Vector3(0, 0, 0);
  particle.velocity = new Vector3(0, 0, 0);
  return particle;
};

const step = (physics: Physics, particles: Particle[]) => {
  physics.step({
    bounds: { width: 1000, height: 1000, depth: 1000 },
    center: new Vector3(0, 0, 0),
    centerAttraction: 0,
    damping: 1,
    particles,
  });
};

describe("Physics", () => {
  it("keeps charge forces equal and opposite", () => {
    const settings = createDefaultSettings();
    settings.chargeStrength = 100;
    settings.nuclearStrength = 0;
    settings.shellConstraintK = 0;
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

  it("separates overlapping particles during collision resolution", () => {
    const settings = createDefaultSettings();
    settings.chargeStrength = 0;
    settings.nuclearStrength = 0;
    settings.shellConstraintK = 0;
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
    const physics = new Physics(createDefaultSettings());
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
    settings.chargeStrength = 0;
    settings.nuclearStrength = 0;
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
    settings.chargeStrength = 0;
    settings.gravityRange = 100;
    settings.gravityStrength = 1;
    settings.lennardJonesStrength = 0;
    settings.nuclearStrength = 0;
    settings.shellConstraintK = 0;
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
    settings.chargeStrength = 0;
    settings.gravityStrength = 0;
    settings.lennardJonesRadius = 12;
    settings.lennardJonesStrength = 1;
    settings.nuclearStrength = 0;
    settings.shellConstraintK = 0;
    const physics = new Physics(settings);
    const closeLeft = createParticle("electron");
    const closeRight = createParticle("electron");
    closeRight.position = new Vector3(6, 0, 0);

    step(physics, [closeLeft, closeRight]);

    expect(closeLeft.velocity.x).toBeLessThan(0);
    expect(closeRight.velocity.x).toBeGreaterThan(0);

    const farLeft = createParticle("electron");
    const farRight = createParticle("electron");
    farRight.position = new Vector3(18, 0, 0);

    step(physics, [farLeft, farRight]);

    expect(farLeft.velocity.x).toBeGreaterThan(0);
    expect(farRight.velocity.x).toBeLessThan(0);
  });
});
