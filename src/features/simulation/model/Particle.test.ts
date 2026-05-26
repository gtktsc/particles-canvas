import { describe, expect, it } from "vitest";
import { Particle } from "@/features/simulation/model/Particle";
import {
  BOUNDARY_RESTITUTION,
  MAX_ACCELERATION,
  MAX_SPEED,
} from "@/features/simulation/model/physicsConstants";
import { Vector3 } from "@/features/simulation/model/Vector3";

describe("Particle", () => {
  it("accumulates force without mutating the force vector", () => {
    const particle = new Particle(100, 100, 100, "electron");
    particle.velocity = new Vector3(0, 0, 0);
    const force = new Vector3(3, -6, 9);

    particle.applyForce(force);

    expect(particle.acceleration).toMatchObject({ x: 3, y: -6, z: 9 });
    expect(particle.velocity).toMatchObject({ x: 0, y: 0, z: 0 });
    expect(force).toMatchObject({ x: 3, y: -6, z: 9 });
  });

  it("applies impulse directly to velocity", () => {
    const particle = new Particle(100, 100, 100, "electron");
    particle.velocity = new Vector3(0, 0, 0);

    particle.applyImpulse(new Vector3(2, -4, 6));

    expect(particle.velocity).toMatchObject({ x: 2, y: -4, z: 6 });
    expect(particle.acceleration).toMatchObject({ x: 0, y: 0, z: 0 });
  });

  it("integrates acceleration, clamps, resolves bounds, then clears acceleration", () => {
    const particle = new Particle(100, 100, 100, "electron");
    particle.position = new Vector3(49, 0, 0);
    particle.velocity = new Vector3(2, 0, 0);

    particle.applyForce(new Vector3(1, 0, 0));
    particle.integrate(1, { width: 100, height: 100, depth: 100 });

    expect(particle.position.x).toBe(50);
    expect(particle.velocity.x).toBeCloseTo(-3 * BOUNDARY_RESTITUTION);
    expect(particle.acceleration).toMatchObject({ x: 0, y: 0, z: 0 });
    expect(particle.lastAcceleration).toMatchObject({ x: 1, y: 0, z: 0 });
  });

  it("clamps invalidly large acceleration and velocity", () => {
    const particle = new Particle(1000, 1000, 1000, "electron");
    particle.position = new Vector3(0, 0, 0);
    particle.velocity = new Vector3(MAX_SPEED * 2, 0, 0);

    particle.applyForce(new Vector3(MAX_ACCELERATION * 2, 0, 0));
    particle.integrate(1, { width: 1000, height: 1000, depth: 1000 });

    expect(particle.lastAcceleration.length()).toBeCloseTo(MAX_ACCELERATION);
    expect(particle.velocity.length()).toBeLessThanOrEqual(MAX_SPEED);
  });

  it("projects visible particles and culls particles behind the camera plane", () => {
    const particle = new Particle(100, 100, 100, "proton");
    particle.position = new Vector3(0, 0, 0);

    expect(
      particle.projectToScreen(100, 100, 400, new Vector3(0, 0, -400))
    ).toMatchObject({ px: 50, py: 50, scale: 0.5 });

    particle.position = new Vector3(0, 0, -900);

    expect(
      particle.projectToScreen(100, 100, 400, new Vector3(0, 0, 0))
    ).toBeNull();
  });
});
