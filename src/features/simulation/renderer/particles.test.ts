import { describe, expect, it } from "vitest";
import {
  createParticleDrawGroups,
  getParticleCellSize,
  sortParticlesByDepth,
} from "@/features/simulation/renderer/particles";
import { Particle } from "@/features/simulation/model/Particle";
import { Vector3 } from "@/features/simulation/model/Vector3";

const createParticle = (z: number) => {
  const particle = new Particle(100, 100, 100, "proton");
  particle.position = new Vector3(0, 0, z);
  return particle;
};

describe("particle renderer", () => {
  it("returns no spatial cell size for empty particle sets", () => {
    expect(getParticleCellSize([])).toBeNull();
  });

  it("sorts particles by depth without mutating input", () => {
    const far = createParticle(20);
    const near = createParticle(-10);
    const particles = [far, near];

    expect(sortParticlesByDepth(particles)).toEqual([near, far]);
    expect(particles).toEqual([far, near]);
  });

  it("groups projected particles by draw color", () => {
    const particle = createParticle(0);

    expect(
      createParticleDrawGroups({
        cameraPosition: new Vector3(0, 0, -400),
        fov: 400,
        height: 100,
        particles: [particle],
        width: 100,
      })
    ).toEqual({
      "rgba(255, 0, 0, 1)": [
        { collided: false, px: 50, py: 50, radius: 2, scale: 0.5 },
      ],
    });
  });
});
