import { Particle } from "@/features/simulation/model/Particle";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { Box3D } from "@/features/simulation/model/Box3d";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
} from "@/features/simulation/model/controlConfig";
import { baseTheme } from "@/theme/theme";

export class Mouse3D {
  zoom: number;
  position = new Vector3(0, 0, 0);
  z = 0;
  size = Math.max(WORLD_WIDTH, WORLD_HEIGHT, WORLD_Z);
  speed = 20;

  private canvas: HTMLCanvasElement;
  private fov: number;
  private camera: Vector3;
  private lastScreenX: number;
  private lastScreenY: number;
  private dragStartTime = 0;

  private isDragging = false;
  private dragStart?: Vector3;
  private dragEnd?: Vector3;
  private draggedParticles: Particle[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    zoom: number,
    fov: number,
    camera: Vector3
  ) {
    this.canvas = canvas;
    this.lastScreenX = canvas.width / 2;
    this.lastScreenY = canvas.height / 2;

    this.zoom = zoom;
    this.fov = fov;
    this.camera = camera.clone();

    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("keydown", this.onKeyDown);
  }

  destroy() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  updateView(zoom: number, fov: number, camera: Vector3) {
    this.zoom = zoom;
    this.fov = fov;
    this.camera.copyFrom(camera);
    this.position = this.screenToWorld(
      this.lastScreenX,
      this.lastScreenY,
      this.z
    );
  }

  private screenToWorld(screenX: number, screenY: number, z: number): Vector3 {
    const { width, height } = this.canvas;
    const relativeZ = z - this.camera.z;
    const scale = this.fov / (this.fov + relativeZ);

    const adjustedX =
      this.camera.x + (screenX - width / 2) / (scale * this.zoom);
    const adjustedY =
      this.camera.y + (screenY - height / 2) / (scale * this.zoom);

    return new Vector3(adjustedX, adjustedY, z);
  }

  contains(point: Vector3): boolean {
    const box = new Box3D(
      this.position,
      new Vector3(this.size, this.size, this.size)
    );
    return box.contains(point);
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.lastScreenX = e.clientX - rect.left;
    this.lastScreenY = e.clientY - rect.top;
    this.position = this.screenToWorld(
      this.lastScreenX,
      this.lastScreenY,
      this.z
    );
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") this.z -= this.speed;
    if (e.key === "ArrowDown") this.z += this.speed;
    if (e.key === "w" || e.key === "W") this.size += 10;
    if (e.key === "s" || e.key === "S")
      this.size = Math.max(10, this.size - 10);
    this.position = this.screenToWorld(
      this.lastScreenX,
      this.lastScreenY,
      this.z
    );
  };

  startDrag(allParticles: Particle[]) {
    this.isDragging = true;
    this.dragStart = this.position.clone();
    this.dragStartTime = Date.now();
    this.draggedParticles = allParticles.filter((p) =>
      this.contains(p.position)
    );
  }

  endDrag(): { force: Vector3; targets: Particle[] } | null {
    if (this.isDragging && this.dragStart) {
      this.dragEnd = this.position.clone();
      const dragVector = this.dragEnd.clone().sub(this.dragStart);
      const duration = (Date.now() - this.dragStartTime) / 1000;
      const force = dragVector.scale(0.2 * duration);
      const targets = this.draggedParticles;
      this.draggedParticles = [];
      this.isDragging = false;
      return { force, targets };
    }

    this.isDragging = false;
    return null;
  }

  render(ctx: CanvasRenderingContext2D, fov: number, camera: Vector3) {
    const { width, height } = ctx.canvas;
    const box = new Box3D(
      this.position,
      new Vector3(this.size, this.size, this.size)
    );
    const corners = box.getCorners();
    Box3D.renderEdges(ctx, corners, fov, width, height, camera);

    if (this.isDragging && this.dragStart) {
      const project = (point: Vector3) => {
        const relative = point.clone().sub(camera);
        const scale = fov / (fov + relative.z);

        return {
          x: width / 2 + relative.x * scale,
          y: height / 2 + relative.y * scale,
        };
      };
      const start = project(this.dragStart);
      const end = project(this.position);

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = baseTheme.color.dragVector;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
