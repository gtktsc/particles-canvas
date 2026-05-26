import type { AppMessages } from "@/i18n/types";

export const WORLD_SCALE = 1;
export const NUMBER_OF_PARTICLES = 300;
export const DAMPING = 0.8;
export const CHANGE_STRENGTH = 500;
export const CENTER_ATTRACTION = 1.5;
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
  | "centerAttraction"
  | "damping"
  | "chargeStrength"
  | "gravityRange"
  | "gravityStrength"
  | "lennardJonesRadius"
  | "lennardJonesStrength"
  | "electrons"
  | "protons"
  | "neutrons";

export type VectorSettingKey = "centerAttractionPoint" | "cameraPosition";
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
  "world" | "center" | "camera" | "physics" | "particles",
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
      kind: "scalar",
      labelKey: "attraction",
      key: "centerAttraction",
      min: 0,
      max: 2,
      step: 0.01,
    },
    {
      kind: "vector",
      labelKey: "x",
      key: "centerAttractionPoint",
      axis: "x",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      kind: "vector",
      labelKey: "y",
      key: "centerAttractionPoint",
      axis: "y",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      kind: "vector",
      labelKey: "z",
      key: "centerAttractionPoint",
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
  physics: [
    { kind: "scalar", labelKey: "damping", key: "damping", min: 0.8, max: 1.0, step: 0.01 },
    {
      kind: "scalar",
      labelKey: "chargeStrength",
      key: "chargeStrength",
      min: 0,
      max: 500,
      step: 1,
    },
    {
      kind: "scalar",
      labelKey: "gravityStrength",
      key: "gravityStrength",
      min: 0,
      max: 2,
      step: 0.01,
    },
    {
      kind: "scalar",
      labelKey: "gravityRange",
      key: "gravityRange",
      min: 20,
      max: 500,
      step: 5,
    },
    {
      kind: "scalar",
      labelKey: "lennardJonesStrength",
      key: "lennardJonesStrength",
      min: 0,
      max: 5,
      step: 0.01,
    },
    {
      kind: "scalar",
      labelKey: "lennardJonesRadius",
      key: "lennardJonesRadius",
      min: 2,
      max: 80,
      step: 1,
    },
  ],
  particles: [
    { kind: "scalar", labelKey: "electrons", key: "electrons", min: 0, max: 100, step: 1 },
    { kind: "scalar", labelKey: "protons", key: "protons", min: 0, max: 100, step: 1 },
    { kind: "scalar", labelKey: "neutrons", key: "neutrons", min: 0, max: 100, step: 1 },
  ],
} satisfies ControlConfig;
