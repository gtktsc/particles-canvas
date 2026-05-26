import { describe, expect, it } from "vitest";
import { Box3D } from "@/features/simulation/model/Box3d";
import { createDefaultSettings } from "@/features/simulation/model/SimulationSettingsContext";
import { Physics } from "@/features/simulation/model/Physics";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { projectPoint } from "@/features/simulation/renderer/projection";
import { createBoxDrawModel } from "@/features/simulation/renderer/world";

describe("world renderer model", () => {
  it("culls points behind the camera plane", () => {
    expect(
      projectPoint({
        camera: new Vector3(0, 0, 0),
        canvasHeight: 100,
        canvasWidth: 100,
        fov: 400,
        point: new Vector3(0, 0, -500),
        viewMode: "front",
      })
    ).toBeNull();
  });

  it("builds ordered box faces and all twelve edges", () => {
    const model = createBoxDrawModel({
      box: new Box3D(new Vector3(0, 0, 0), new Vector3(100, 100, 100)),
      camera: new Vector3(0, 0, -400),
      canvasHeight: 500,
      canvasWidth: 500,
      fov: 400,
      viewMode: "front",
    });

    expect(model?.edges).toHaveLength(12);
    expect(model?.faces).toHaveLength(6);
    expect(model?.faces[0].depth).toBeGreaterThanOrEqual(model?.faces[1].depth ?? 0);
  });

  it("projects probe points across view modes", () => {
    for (const viewMode of ["front", "top", "side", "iso"] as const) {
      expect(
        projectPoint({
          camera: new Vector3(0, 0, -400),
          canvasHeight: 500,
          canvasWidth: 500,
          fov: 400,
          point: new Vector3(20, 30, 40),
          viewMode,
        })
      ).not.toBeNull();
    }
  });

  it("keeps potential heatmap samples finite", () => {
    const settings = createDefaultSettings();
    settings.centerSpringEnabled = true;
    settings.centralGravityEnabled = true;
    settings.pointChargeFieldEnabled = true;
    const physics = new Physics(settings);

    expect(
      Number.isFinite(physics.samplePotentialAt(new Vector3(0.01, 0, 0), "proton"))
    ).toBe(true);
  });
});
