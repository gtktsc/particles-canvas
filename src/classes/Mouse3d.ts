import { Particle } from "@/classes/Particle";
import { Vector3 } from "@/classes/Vector3";
import { WORLD_WIDTH, WORLD_HEIGHT, WORLD_Z } from "@/lib/constants";
import { Box3D } from "@/classes/Box3d";

export class Mouse3D {
  zoom: number;
  position = new Vector3(0, 0, 0);
  z = 0;
  size = Math.max(WORLD_WIDTH, WORLD_HEIGHT, WORLD_Z);
  speed = 20;

  private canvas: HTMLCanvasElement;
  private fov = 300;
  private lastScreenX: number;
  private lastScreenY: number;
  private dragStartTime = 0;

  private isDragging = false;
  private dragStart?: Vector3;
  private dragEnd?: Vector3;
  private draggedParticles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement, zoom: number) {
    this.canvas = canvas;
    this.lastScreenX = canvas.width / 2;
    this.lastScreenY = canvas.height / 2;

    this.zoom = zoom;

    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("keydown", this.onKeyDown);
  }

  destroy() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private screenToWorld(
    screenX: number,
    screenY: number,
    z: number,
    zoom: number
  ): Vector3 {
    const { width, height } = this.canvas;
    const scale = this.fov / (this.fov + z);

    const adjustedX = (screenX - width / 2) / (scale * zoom);
    const adjustedY = (screenY - height / 2) / (scale * zoom);

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
      this.z,
      this.zoom
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
      this.z,
      this.zoom
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
      const scale = fov / (fov + this.dragStart.z);
      const startX = width / 2 + this.dragStart.x * scale;
      const startY = height / 2 + this.dragStart.y * scale;
      const endX = width / 2 + this.position.x * scale;
      const endY = height / 2 + this.position.y * scale;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(0, 128, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
