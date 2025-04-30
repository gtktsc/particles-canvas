import ParticleCanvas from "@/components/ParticleCanvas";
import Controls from "@/components/Controls";
import { SimulationSettingsProvider } from "@/context/SimulationSettingsContext";

export default function HomePage() {
  return (
    <SimulationSettingsProvider>
      <Controls />
      <ParticleCanvas />
    </SimulationSettingsProvider>
  );
}
