import { Vector3 } from "@/classes/Vector3";

export const WORLD_SCALE = 1;
export const NUMBER_OF_PARTICLES = 7000;
export const DAMPING = 1;
export const CENTER_ATTRACTION = 0;
export const WORLD_Z = 800;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;
export const CENTER_ATTRACTION_POINT = new Vector3(0, 0, 0);
export const CONTROL_CONFIG = {
  world: [
    { label: "Width", key: "worldWidth", min: 100, max: 1000, step: 1 },
    { label: "Height", key: "worldHeight", min: 100, max: 1000, step: 1 },
    { label: "Depth", key: "worldZ", min: 100, max: 1000, step: 1 },
    { label: "FOV", key: "fov", min: 100, max: 2000, step: 10 },
  ],
  center: [
    {
      label: "Attraction",
      key: "centerAttraction",
      min: 0,
      max: 0.2,
      step: 0.01,
    },
    {
      label: "X",
      key: "centerAttractionPoint.x",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      label: "Y",
      key: "centerAttractionPoint.y",
      min: -500,
      max: 500,
      step: 10,
    },
    {
      label: "Z",
      key: "centerAttractionPoint.z",
      min: -500,
      max: 500,
      step: 10,
    },
  ],
  camera: [
    { label: "X", key: "cameraPosition.x", min: -2000, max: 2000, step: 10 },
    { label: "Y", key: "cameraPosition.y", min: -2000, max: 2000, step: 10 },
    { label: "Z", key: "cameraPosition.z", min: -2000, max: 2000, step: 10 },
  ],
  physics: [
    { label: "Damping", key: "damping", min: 0.8, max: 1.0, step: 0.01 },
    {
      label: "Particles",
      key: "numberOfParticles",
      min: 50,
      max: 10000,
      step: 10,
    },
  ],
};
