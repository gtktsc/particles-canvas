"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { AppTheme, createTheme } from "@/theme/theme";
import { applyCssVariables, createCssVariables } from "@/theme/utils";

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createTheme("dark"), []);
  const variables = useMemo(() => createCssVariables(theme), [theme]);

  useEffect(() => {
    applyCssVariables(document.documentElement, variables);
    document.documentElement.dataset.theme = theme.mode;
  }, [theme, variables]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return theme;
}
