import { enMessages } from "@/i18n/messages/en";
import type { AppMessages, Language } from "@/i18n/types";

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_MESSAGES: AppMessages = enMessages;

export async function loadMessages(
  language: Language = DEFAULT_LANGUAGE
): Promise<AppMessages> {
  if (language !== DEFAULT_LANGUAGE) {
    return DEFAULT_MESSAGES;
  }

  return DEFAULT_MESSAGES;
}
