import styles from "@/features/simulation/components/ControlPanel.module.css";

type PanelButtonProps = {
  label: string;
  onClick: () => void;
};

export function PanelButton({ label, onClick }: PanelButtonProps) {
  return (
    <button className={styles.button} onClick={onClick} type="button">
      {label}
    </button>
  );
}
