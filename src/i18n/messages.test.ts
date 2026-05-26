import { describe, expect, it } from "vitest";
import { DEFAULT_MESSAGES } from "@/i18n/messages";
import {
  getMessageAtPath,
  getMessagePaths,
  getPlaceholders,
} from "@/i18n/utils";

describe("messages", () => {
  it("keeps English messages non-empty", () => {
    for (const path of getMessagePaths(DEFAULT_MESSAGES)) {
      expect(getMessageAtPath(DEFAULT_MESSAGES, path), path).not.toBe("");
    }
  });

  it("keeps placeholder syntax discoverable for parity checks", () => {
    expect(getPlaceholders("Drag {count} particles into {target}")).toEqual([
      "{count}",
      "{target}",
    ]);
  });

  it("exposes nested simulation control keys", () => {
    expect(getMessagePaths(DEFAULT_MESSAGES)).toContain(
      "simulation.controls.actions.resetWorld"
    );
  });
});
