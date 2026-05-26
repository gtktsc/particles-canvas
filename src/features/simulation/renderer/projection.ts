import type { ViewMode } from "@/features/simulation/model/SimulationSettingsContext";
import { Vector3 } from "@/features/simulation/model/Vector3";

export type Projection = {
  depth: number;
  scale: number;
  x: number;
  y: number;
};

export function toViewSpace(point: Vector3, camera: Vector3, viewMode: ViewMode) {
  const x = point.x - camera.x;
  const y = point.y - camera.y;
  const z = point.z - camera.z;

  switch (viewMode) {
    case "top":
      return { x, y: z, z: y };
    case "side":
      return { x: z, y, z: x };
    case "iso": {
      const isoX = (x - z) * 0.7071;
      const isoY = y * 0.82 + (x + z) * 0.29;
      const isoZ = (x + y + z) * 0.333;
      return { x: isoX, y: isoY, z: isoZ };
    }
    case "front":
      return { x, y, z };
  }
}

export function getViewDepth(point: Vector3, camera: Vector3, viewMode: ViewMode) {
  return toViewSpace(point, camera, viewMode).z;
}

export function projectPoint({
  camera,
  canvasHeight,
  canvasWidth,
  fov,
  point,
  viewMode,
}: {
  camera: Vector3;
  canvasHeight: number;
  canvasWidth: number;
  fov: number;
  point: Vector3;
  viewMode: ViewMode;
}): Projection | null {
  const view = toViewSpace(point, camera, viewMode);
  if (view.z <= -fov) return null;

  const scale = fov / (fov + view.z);

  return {
    depth: view.z,
    scale,
    x: canvasWidth / 2 + view.x * scale,
    y: canvasHeight / 2 + view.y * scale,
  };
}
