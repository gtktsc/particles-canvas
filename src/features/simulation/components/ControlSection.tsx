import type { ReactNode } from "react";
import { PanelButton } from "@/features/simulation/components/PanelButton";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type ControlSectionProps = {
  actionLabel: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onReset: () => void;
  title: string;
};

export function ControlSection({
  actionLabel,
  children,
  defaultOpen = false,
  onReset,
  title,
}: ControlSectionProps) {
  return (
    <details className={styles.section} open={defaultOpen}>
      <summary className={styles.summary}>{title}</summary>
      {children}
      <PanelButton label={actionLabel} onClick={onReset} />
    </details>
  );
}
