import {
  SimulationScreen,
  SimulationSettingsProvider,
} from "@/features/simulation";

export default function HomePage() {
  return (
    <SimulationSettingsProvider>
      <SimulationScreen />
    </SimulationSettingsProvider>
  );
}
