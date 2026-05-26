import { Particle } from "@/features/simulation/model/Particle";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { Box3D } from "@/features/simulation/model/Box3d";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
} from "@/features/simulation/model/controlConfig";
import type { ViewMode } from "@/features/simulation/model/SimulationSettingsContext";
import {
  createBoxDrawModel,
} from "@/features/simulation/renderer/world";
import { projectPoint } from "@/features/simulation/renderer/projection";
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

  render(
    ctx: CanvasRenderingContext2D,
    fov: number,
    camera: Vector3,
    viewMode: ViewMode = "front"
  ) {
    const { width, height } = ctx.canvas;
    const box = new Box3D(
      this.position,
      new Vector3(this.size, this.size, this.size)
    );
    const model = createBoxDrawModel({
      box,
      camera,
      canvasHeight: height,
      canvasWidth: width,
      fov,
      viewMode,
    });

    if (model) {
      for (const face of model.faces) {
        ctx.beginPath();
        ctx.moveTo(face.points[0].x, face.points[0].y);
        for (const point of face.points.slice(1)) {
          ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fillStyle = this.draggedParticles.length > 0
          ? "rgba(0, 255, 120, 0.08)"
          : "rgba(0, 255, 120, 0.035)";
        ctx.fill();
      }

      ctx.strokeStyle = baseTheme.color.selectionFrame;
      ctx.lineWidth = 1.2;
      for (const edge of model.edges) {
        const a = model.projected[edge.a];
        const b = model.projected[edge.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (this.isDragging && this.dragStart) {
      const start = projectPoint({
        camera,
        canvasHeight: height,
        canvasWidth: width,
        fov,
        point: this.dragStart,
        viewMode,
      });
      const end = projectPoint({
        camera,
        canvasHeight: height,
        canvasWidth: width,
        fov,
        point: this.position,
        viewMode,
      });

      if (!start || !end) return;

      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headLength = 8;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle - Math.PI / 7),
        end.y - headLength * Math.sin(angle - Math.PI / 7)
      );
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle + Math.PI / 7),
        end.y - headLength * Math.sin(angle + Math.PI / 7)
      );
      ctx.strokeStyle = baseTheme.color.dragVector;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
