"use client";

import { SliderControl } from "@/features/simulation/components/SliderControl";
import type {
  ForceDefinition,
  ForceEnabledKey,
  ForceScalarSettingKey,
} from "@/features/simulation/model/forceTypes";
import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type ForceCardProps = {
  force: ForceDefinition;
  onReset: (_force: ForceDefinition) => void;
  onScalarChange: (_key: ForceScalarSettingKey, _value: number) => void;
  onToggle: (_key: ForceEnabledKey, _enabled: boolean) => void;
  settings: SimulationSettings;
};

export function ForceCard({
  force,
  onReset,
  onScalarChange,
  onToggle,
  settings,
}: ForceCardProps) {
  const { messages } = useMessages();
  const forceLab = messages.simulation.forceLab;
  const forceCopy = forceLab.forces[force.id];
  const enabled = Boolean(settings[force.enabledKey]);
  const primarySliders = force.sliders.filter((slider) => !slider.advanced);
  const advancedSliders = force.sliders.filter((slider) => slider.advanced);
  const renderSlider = (slider: (typeof force.sliders)[number]) => (
    <SliderControl
      config={slider}
      disabled={!enabled}
      key={slider.key}
      label={forceLab.sliderLabels[slider.key]}
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
          <span>{forceCopy.title}</span>
        </label>
        <button
          className={styles.smallButton}
          onClick={() => onReset(force)}
          type="button"
        >
          {forceLab.forceCard.reset}
        </button>
      </header>

      <div className={styles.formula}>{forceCopy.formula}</div>
      <p className={styles.description}>{forceCopy.description}</p>

      {primarySliders.map(renderSlider)}

      {advancedSliders.length > 0 ? (
        <details className={styles.advancedControls}>
          <summary>{forceLab.forceCard.advanced}</summary>
          {advancedSliders.map(renderSlider)}
        </details>
      ) : null}
    </article>
  );
}
