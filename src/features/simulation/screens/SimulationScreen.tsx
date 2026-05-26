import { ControlPanel } from "@/features/simulation/components/ControlPanel";
import { ParticleCanvas } from "@/features/simulation/components/ParticleCanvas";

export function SimulationScreen() {
  return (
    <>
      <ControlPanel />
      <ParticleCanvas />
    </>
  );
}
