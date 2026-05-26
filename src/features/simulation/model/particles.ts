import { Particle, ParticleType } from "@/features/simulation/model/Particle";
import { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { getShellIndex } from "@/features/simulation/model/defaults";

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

  return [
    ...createType(settings.electrons, "electron"),
    ...createType(settings.protons, "proton"),
    ...createType(settings.neutrons, "neutron"),
  ];
};
