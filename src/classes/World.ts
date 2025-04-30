import { Vector3 } from "@/classes/Vector3";
import { Box3D } from "@/classes/Box3d";

export class World {
  box: Box3D;

  constructor(width: number, height: number, depth: number) {
    const center = new Vector3(0, 0, 0);
    const size = new Vector3(width, height, depth);
    this.box = new Box3D(center, size);
  }

  updateSize(width: number, height: number, depth: number) {
    this.box.size = new Vector3(width, height, depth);
  }

  render(ctx: CanvasRenderingContext2D, fov: number, cameraPosition: Vector3) {
    const { width, height } = ctx.canvas;
    const corners = this.box.getCorners();
    Box3D.renderEdges(
      ctx,
      corners,
      fov,
      width,
      height,
      cameraPosition,
      "lime",
      1.5
    );
  }

  contains(point: Vector3): boolean {
    return this.box.contains(point);
  }
}
