import type { CSSProperties } from "react";

type TokenValue = string | number | TokenTree;

interface TokenTree {
  readonly [key: string]: TokenValue;
}

const toKebabCase = (value: string) =>
  value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export function createCssVariables(
  tokens: TokenTree,
  path: string[] = []
): CSSProperties {
  return Object.entries(tokens).reduce<CSSProperties>((variables, [key, value]) => {
    const nextPath = [...path, toKebabCase(key)];

    if (typeof value === "string" || typeof value === "number") {
      return {
        ...variables,
        [`--${nextPath.join("-")}`]: String(value),
      } as CSSProperties;
    }

    return {
      ...variables,
      ...createCssVariables(value, nextPath),
    };
  }, {});
}

export function applyCssVariables(
  target: HTMLElement,
  variables: CSSProperties
) {
  for (const [key, value] of Object.entries(variables)) {
    target.style.setProperty(key, String(value));
  }
}
