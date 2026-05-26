import { colors } from "@/theme/tokens/colors";
import { motion } from "@/theme/tokens/motion";
import { radius } from "@/theme/tokens/radius";
import { spacing } from "@/theme/tokens/spacing";
import { typography } from "@/theme/tokens/typography";
import { zIndex } from "@/theme/tokens/zIndex";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = "light" | "dark";
export type ThemeTone = "default";

export const baseTheme = {
  mode: "dark" as ResolvedThemeMode,
  tone: "default" as ThemeTone,
  color: colors,
  spacing,
  radius,
  typography,
  motion,
  zIndex,
  layout: {
    controlPanelTop: "10px",
    controlPanelLeft: "10px",
    controlPanelWidth: "260px",
    controlPanelMaxHeight: "95vh",
  },
} as const;

export type AppTheme = typeof baseTheme;

export function createTheme(
  mode: ResolvedThemeMode = "dark",
  tone: ThemeTone = "default"
): AppTheme {
  return {
    ...baseTheme,
    mode,
    tone,
  };
}
