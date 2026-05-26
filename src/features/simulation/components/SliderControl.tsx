import styles from "@/features/simulation/components/ControlPanel.module.css";

type SliderConfig = {
  max: number;
  min: number;
  step: number;
};

type SliderControlProps = {
  config: SliderConfig;
  disabled?: boolean;
  label: string;
  onChange: (_value: number) => void;
  value: number;
};

export function SliderControl({
  config,
  disabled = false,
  label,
  onChange,
  value,
}: SliderControlProps) {
  return (
    <label className={`${styles.slider} ${disabled ? styles.disabled : ""}`}>
      <span>
        {label}: {value}
      </span>
      <input
        aria-label={label}
        className={styles.range}
        disabled={disabled}
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
