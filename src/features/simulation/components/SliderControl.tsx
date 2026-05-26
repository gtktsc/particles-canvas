import type {
  ScalarControl,
  VectorControl,
} from "@/features/simulation/model/controlConfig";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type SliderControlProps = {
  config: ScalarControl | VectorControl;
  label: string;
  onChange: (_value: number) => void;
  value: number;
};

export function SliderControl({
  config,
  label,
  onChange,
  value,
}: SliderControlProps) {
  return (
    <label className={styles.slider}>
      {label}: {value}
      <input
        aria-label={label}
        className={styles.range}
        max={config.max}
        min={config.min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={config.step}
        type="range"
        value={value}
      />
    </label>
  );
}
