import { Vector3 } from "@/classes/Vector3";

export class Box3D {
  constructor(public center: Vector3, public size: Vector3) {}

  contains(point: Vector3): boolean {
    return (
      Math.abs(point.x - this.center.x) <= this.size.x / 2 &&
      Math.abs(point.y - this.center.y) <= this.size.y / 2 &&
      Math.abs(point.z - this.center.z) <= this.size.z / 2
    );
  }

  getCorners(): Vector3[] {
    const hx = this.size.x / 2;
    const hy = this.size.y / 2;
    const hz = this.size.z / 2;

    return [
      new Vector3(this.center.x - hx, this.center.y - hy, this.center.z - hz),
      new Vector3(this.center.x + hx, this.center.y - hy, this.center.z - hz),
      new Vector3(this.center.x + hx, this.center.y + hy, this.center.z - hz),
      new Vector3(this.center.x - hx, this.center.y + hy, this.center.z - hz),
      new Vector3(this.center.x - hx, this.center.y - hy, this.center.z + hz),
      new Vector3(this.center.x + hx, this.center.y - hy, this.center.z + hz),
      new Vector3(this.center.x + hx, this.center.y + hy, this.center.z + hz),
      new Vector3(this.center.x - hx, this.center.y + hy, this.center.z + hz),
    ];
  }

  static renderEdges(
    ctx: CanvasRenderingContext2D,
    corners: Vector3[],
    fov: number,
    canvasWidth: number,
    canvasHeight: number,
    camera: Vector3,
    strokeStyle = "rgba(0,255,0,0.8)",
    lineWidth = 1
  ) {
    const project = (v: Vector3) => {
      const relative = v.clone().sub(camera);
      const scale = fov / (fov + relative.z);
      return {
        x: canvasWidth / 2 + relative.x * scale,
        y: canvasHeight / 2 + relative.y * scale,
      };
    };

    const projected = corners.map(project);
    const connect = (a: number, b: number) => {
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.stroke();
    };

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    connect(0, 1);
    connect(1, 2);
    connect(2, 3);
    connect(3, 0);
    connect(4, 5);
    connect(5, 6);
    connect(6, 7);
    connect(7, 4);
    connect(0, 4);
    connect(1, 5);
    connect(2, 6);
    connect(3, 7);
  }
}
