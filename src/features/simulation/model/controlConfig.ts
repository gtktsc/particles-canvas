import type { AppMessages } from "@/i18n/types";

export const WORLD_SCALE = 1;
export const NUMBER_OF_PARTICLES = 300;
export const WORLD_Z = 400;
export const WORLD_WIDTH = 400;
export const WORLD_HEIGHT = 400;
export const ZOOM = 1;

export type ScalarSettingKey =
  | "worldWidth"
  | "worldHeight"
  | "worldZ"
  | "fov"
  | "zoom"
  | "electrons"
  | "protons"
  | "neutrons";

export type VectorSettingKey = "forceCenterPoint" | "cameraPosition";
export type VectorAxis = "x" | "y" | "z";
export type ControlFieldKey = keyof AppMessages["simulation"]["controls"]["fields"];
export type ControlSectionKey =
  keyof AppMessages["simulation"]["controls"]["sections"];
export type ControlActionKey =
  keyof AppMessages["simulation"]["controls"]["actions"];

type BaseControl = {
  labelKey: ControlFieldKey;
  min: number;
  max: number;
  step: number;
};

export type ScalarControl = BaseControl & {
  kind: "scalar";
  key: ScalarSettingKey;
};

export type VectorControl = BaseControl & {
  kind: "vector";
  key: VectorSettingKey;
  axis: VectorAxis;
};

export type ControlConfig = Record<
  "world" | "center" | "camera" | "particles",
  readonly (ScalarControl | VectorControl)[]
>;

export const CONTROL_CONFIG = {
  world: [
    { kind: "scalar", labelKey: "width", key: "worldWidth", min: 100, max: 1000, step: 1 },
    { kind: "scalar", labelKey: "height", key: "worldHeight", min: 100, max: 1000, step: 1 },
    { kind: "scalar", labelKey: "depth", key: "worldZ", min: 100, max: 1000, step: 1 },
    { kind: "scalar", labelKey: "fov", key: "fov", min: 100, max: 2000, step: 10 },
    { kind: "scalar", labelKey: "zoom", key: "zoom", min: 0.1, max: 5, step: 0.1 },
  ],
  center: [
    {
      kind: "vector",
      labelKey: "x",
      key: "forceCenterPoint",
      axis: "x",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      kind: "vector",
      labelKey: "y",
      key: "forceCenterPoint",
      axis: "y",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      kind: "vector",
      labelKey: "z",
      key: "forceCenterPoint",
      axis: "z",
      min: -500,
      max: 500,
      step: 10,
    },
  ],
  camera: [
    { kind: "vector", labelKey: "x", key: "cameraPosition", axis: "x", min: -2000, max: 2000, step: 10 },
    { kind: "vector", labelKey: "y", key: "cameraPosition", axis: "y", min: -2000, max: 2000, step: 10 },
    { kind: "vector", labelKey: "z", key: "cameraPosition", axis: "z", min: -2000, max: 2000, step: 10 },
  ],
  particles: [
    { kind: "scalar", labelKey: "electrons", key: "electrons", min: 0, max: 100, step: 1 },
    { kind: "scalar", labelKey: "protons", key: "protons", min: 0, max: 100, step: 1 },
    { kind: "scalar", labelKey: "neutrons", key: "neutrons", min: 0, max: 100, step: 1 },
  ],
} satisfies ControlConfig;
