import { SliderControl } from "@/features/simulation/components/SliderControl";
import type { ForceDefinition } from "@/features/simulation/model/forceDefinitions";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type ForceCardProps = {
  force: ForceDefinition;
  onReset: (_force: ForceDefinition) => void;
  onScalarChange: (_key: keyof SimulationSettings, _value: number) => void;
  onToggle: (_key: keyof SimulationSettings, _enabled: boolean) => void;
  settings: SimulationSettings;
};

export function ForceCard({
  force,
  onReset,
  onScalarChange,
  onToggle,
  settings,
}: ForceCardProps) {
  const enabled = Boolean(settings[force.enabledKey]);
  const primarySliders = force.sliders.filter((slider) => !slider.advanced);
  const advancedSliders = force.sliders.filter((slider) => slider.advanced);
  const renderSlider = (slider: (typeof force.sliders)[number]) => (
    <SliderControl
      config={slider}
      disabled={!enabled}
      key={slider.key}
      label={slider.label}
      onChange={(value) => onScalarChange(slider.key, value)}
      value={Number(settings[slider.key])}
    />
  );

  return (
    <article className={styles.forceCard}>
      <header className={styles.forceHeader}>
        <label className={styles.toggle}>
          <input
            checked={enabled}
            onChange={(event) => onToggle(force.enabledKey, event.target.checked)}
            type="checkbox"
          />
          <span>{force.title}</span>
        </label>
        <button
          className={styles.smallButton}
          onClick={() => onReset(force)}
          type="button"
        >
          Reset
        </button>
      </header>

      <div className={styles.formula}>{force.formula}</div>
      <p className={styles.description}>{force.description}</p>

      {primarySliders.map(renderSlider)}

      {advancedSliders.length > 0 ? (
        <details className={styles.advancedControls}>
          <summary>Advanced</summary>
          {advancedSliders.map(renderSlider)}
        </details>
      ) : null}
    </article>
  );
}
