import { WORLD_HEIGHT, WORLD_WIDTH, WORLD_Z } from "@/lib/constants";
import { Vector3 } from "@/classes/Vector3";

export const getInitialPosition = (
  width: number,
  height: number,
  depth: number
) => {
  return {
    x: (Math.random() - 0.5) * width,
    y: (Math.random() - 0.5) * height,
    z: (Math.random() - 0.5) * depth,
  };
};

export const getInitialVelocity = () => {
  return {
    x: (Math.random() - 0.5) * 3,
    y: (Math.random() - 0.5) * 3,
    z: (Math.random() - 0.5) * 3,
  };
};

export const getInitialElectronsNumber = () => {
  return 6;
};

export const getInitialProtonsNumber = () => {
  return 6;
};

export const getInitialNeutronsNumber = () => {
  return 6;
};

export const getInitialFOV = () => {
  return Math.max(WORLD_WIDTH, WORLD_HEIGHT, WORLD_Z, 300);
};

export const getInitialCameraPosition = () => {
  return new Vector3(0, 0, -getInitialFOV());
};

export const getShellIndex = (electronIndex: number): number => {
  return Math.floor(Math.sqrt(electronIndex));
};
