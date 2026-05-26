import { Particle, ParticleType } from "@/features/simulation/model/Particle";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { getShellIndex } from "@/features/simulation/model/defaults";
import { Vector3 } from "@/features/simulation/model/Vector3";

function applyInitialLayout(particles: Particle[], settings: SimulationSettings) {
  if (settings.initialLayout === "random" || particles.length === 0) return particles;

  const radius = Math.min(settings.worldWidth, settings.worldHeight) * 0.32;
  const lineSpacing = settings.pairSpringRestLength || 36;

  particles.forEach((particle, index) => {
    const centeredIndex = index - (particles.length - 1) / 2;

    if (settings.initialLayout === "beam") {
      particle.position = new Vector3(
        -settings.worldWidth * 0.38,
        centeredIndex * 10,
        centeredIndex % 2 === 0 ? -20 : 20
      );
      particle.velocity = new Vector3(95, 0, 0);
    }

    if (settings.initialLayout === "ringOrbit") {
      const angle = (index / particles.length) * Math.PI * 2;
      particle.position = new Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
      particle.velocity = new Vector3(-Math.sin(angle) * 85, Math.cos(angle) * 85, 0);
    }

    if (settings.initialLayout === "twoBody") {
      const side = index % 2 === 0 ? -1 : 1;
      particle.position = new Vector3(side * 90, 0, 0);
      particle.velocity = new Vector3(0, -side * 80, 0);
    }

    if (settings.initialLayout === "springLine") {
      particle.position = new Vector3(centeredIndex * lineSpacing, 0, 0);
      particle.velocity = new Vector3(index === 0 ? 90 : 0, 0, 0);
    }

    if (settings.initialLayout === "gasBox") {
      particle.velocity = new Vector3(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 60
      );
    }

    if (settings.initialLayout === "fallingColumn") {
      particle.position = new Vector3(
        (index % 5 - 2) * 18,
        -80 + Math.floor(index / 5) * 22,
        (index % 3 - 1) * 12
      );
      particle.velocity = new Vector3(0, 24, 0);
    }
  });

  return particles;
}

export const createParticles = (settings: SimulationSettings): Particle[] => {
  const createType = (count: number, type: ParticleType) =>
    Array.from(
      { length: count },
      (_, index) =>
        new Particle(
          settings.worldWidth,
          settings.worldHeight,
          settings.worldZ,
          type,
          type === "electron" ? getShellIndex(index) : undefined
        )
    );

  return applyInitialLayout([
    ...createType(settings.electrons, "electron"),
    ...createType(settings.protons, "proton"),
    ...createType(settings.neutrons, "neutron"),
  ], settings);
};
