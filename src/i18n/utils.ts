type MessageValue = string | MessageTree;

interface MessageTree {
  readonly [key: string]: MessageValue;
}

const PLACEHOLDER_PATTERN = /\{[^{}]+\}/g;

export function getMessagePaths(
  messages: MessageTree,
  prefix = ""
): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      return [path];
    }

    return getMessagePaths(value, path);
  });
}

export function getPlaceholders(message: string): string[] {
  return Array.from(message.matchAll(PLACEHOLDER_PATTERN), ([match]) => match)
    .sort();
}

export function getMessageAtPath(
  messages: MessageTree,
  path: string
): string | undefined {
  const value = path.split(".").reduce<string | MessageTree | undefined>(
    (current, key) =>
      current && typeof current !== "string" ? current[key] : undefined,
    messages
  );

  return typeof value === "string" ? value : undefined;
}
