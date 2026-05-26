"use client";

import type { ReactNode } from "react";
import { MessagesProvider } from "@/i18n/MessagesProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MessagesProvider>{children}</MessagesProvider>
    </ThemeProvider>
  );
}
