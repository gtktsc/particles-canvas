"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_MESSAGES,
} from "@/i18n/messages";
import type { AppMessages, Language } from "@/i18n/types";

type MessagesContextValue = {
  language: Language;
  messages: AppMessages;
  isLoading: boolean;
};

const MessagesContext = createContext<MessagesContextValue>({
  language: DEFAULT_LANGUAGE,
  messages: DEFAULT_MESSAGES,
  isLoading: false,
});

export function MessagesProvider({ children }: { children: ReactNode }) {
  const value = useMemo<MessagesContextValue>(
    () => ({
      language: DEFAULT_LANGUAGE,
      messages: DEFAULT_MESSAGES,
      isLoading: false,
    }),
    []
  );

  return (
    <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
