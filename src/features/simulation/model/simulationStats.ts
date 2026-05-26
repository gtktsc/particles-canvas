import { FORCE_DEFINITIONS } from "@/features/simulation/model/forceDefinitions";
import { Particle } from "@/features/simulation/model/Particle";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type { SimulationHistorySample } from "@/features/simulation/model/simulationHistory";
import { Vector3 } from "@/features/simulation/model/Vector3";

export type SimulationStats = {
  activeForces: number;
  angularMomentum: number;
  averageSpeed: number;
  fps: number;
  history: SimulationHistorySample[];
  kineticEnergy: number;
  momentum: number;
  particleCount: number;
  potentialEnergy: number;
  probeAcceleration: Vector3;
  probePotential: number;
  totalEnergy: number;
};

export const createInitialSimulationStats = (): SimulationStats => ({
  activeForces: 0,
  angularMomentum: 0,
  averageSpeed: 0,
  fps: 0,
  history: [],
  kineticEnergy: 0,
  momentum: 0,
  particleCount: 0,
  potentialEnergy: 0,
  probeAcceleration: new Vector3(),
  probePotential: 0,
  totalEnergy: 0,
});

export function getActiveForceCount(settings: SimulationSettings) {
  return FORCE_DEFINITIONS.filter((force) => settings[force.enabledKey]).length;
}

export function calculateSimulationStats({
  fps,
  history = [],
  particles,
  potentialEnergy = 0,
  probeAcceleration = new Vector3(),
  probePotential = 0,
  settings,
}: {
  fps: number;
  history?: SimulationHistorySample[];
  particles: Particle[];
  potentialEnergy?: number;
  probeAcceleration?: Vector3;
  probePotential?: number;
  settings: SimulationSettings;
}): SimulationStats {
  const angularMomentum = new Vector3();
  const momentum = new Vector3();
  let speedSum = 0;
  let kineticEnergy = 0;

  for (const particle of particles) {
    const speed = particle.velocity.length();
    const particleMomentum = particle.velocity.clone().scale(particle.mass);

    speedSum += speed;
    kineticEnergy += 0.5 * particle.mass * speed * speed;
    momentum.add(particleMomentum);
    angularMomentum.add(particle.position.clone().cross(particleMomentum));
  }

  return {
    activeForces: getActiveForceCount(settings),
    angularMomentum: angularMomentum.length(),
    averageSpeed: particles.length === 0 ? 0 : speedSum / particles.length,
    fps,
    history,
    kineticEnergy,
    momentum: momentum.length(),
    particleCount: particles.length,
    potentialEnergy,
    probeAcceleration,
    probePotential,
    totalEnergy: kineticEnergy + potentialEnergy,
  };
}
