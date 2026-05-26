import { Box3D } from "@/features/simulation/model/Box3d";
import type { ParticleType } from "@/features/simulation/model/Particle";
import type { Physics } from "@/features/simulation/model/Physics";
import type { ViewMode } from "@/features/simulation/model/SimulationSettingsContext";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { projectPoint, type Projection } from "@/features/simulation/renderer/projection";
import { baseTheme } from "@/theme/theme";
import { rgba } from "@/theme/utils";

export type BoxEdge = {
  a: number;
  b: number;
  depth: number;
};

export type BoxFace = {
  depth: number;
  points: Projection[];
};

export type BoxDrawModel = {
  edges: BoxEdge[];
  faces: BoxFace[];
  projected: Projection[];
};

const BOX_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
] as const;

const BOX_FACES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
  [1, 2, 6, 5],
  [0, 3, 7, 4],
] as const;

function drawScreenArrow({
  color,
  ctx,
  end,
  start,
}: {
  color: string;
  ctx: CanvasRenderingContext2D;
  end: Projection;
  start: Projection;
}) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const headLength = 6;

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
  ctx.strokeStyle = color;
  ctx.stroke();
}

function createGridLines(size: number, spacing: number, viewMode: ViewMode) {
  const lines: [Vector3, Vector3][] = [];

  for (let value = -size; value <= size; value += spacing) {
    if (viewMode === "top") {
      lines.push(
        [new Vector3(-size, 0, value), new Vector3(size, 0, value)],
        [new Vector3(value, 0, -size), new Vector3(value, 0, size)]
      );
    } else if (viewMode === "side") {
      lines.push(
        [new Vector3(0, -size, value), new Vector3(0, size, value)],
        [new Vector3(0, value, -size), new Vector3(0, value, size)]
      );
    } else {
      lines.push(
        [new Vector3(-size, value, 0), new Vector3(size, value, 0)],
        [new Vector3(value, -size, 0), new Vector3(value, size, 0)]
      );
    }
  }

  return lines;
}

function createFieldSamplePoint(x: number, y: number, viewMode: ViewMode) {
  if (viewMode === "top") return new Vector3(x, 0, y);
  if (viewMode === "side") return new Vector3(0, y, x);
  return new Vector3(x, y, 0);
}

export function createBoxDrawModel({
  box,
  camera,
  canvasHeight,
  canvasWidth,
  fov,
  viewMode,
}: {
  box: Box3D;
  camera: Vector3;
  canvasHeight: number;
  canvasWidth: number;
  fov: number;
  viewMode: ViewMode;
}): BoxDrawModel | null {
  const projected = box
    .getCorners()
    .map((point) =>
      projectPoint({ camera, canvasHeight, canvasWidth, fov, point, viewMode })
    );

  if (projected.some((point) => point === null)) return null;

  const points = projected as Projection[];
  const edges = BOX_EDGES.map(([a, b]) => ({
    a,
    b,
    depth: (points[a].depth + points[b].depth) / 2,
  })).sort((a, b) => b.depth - a.depth);
  const faces = BOX_FACES.map((face) => {
    const facePoints = face.map((index) => points[index]);
    return {
      depth:
        facePoints.reduce((sum, point) => sum + point.depth, 0) /
        facePoints.length,
      points: facePoints,
    };
  }).sort((a, b) => b.depth - a.depth);

  return { edges, faces, projected: points };
}

export function drawWorldFrame({
  box,
  camera,
  ctx,
  fov,
  viewMode,
}: {
  box: Box3D;
  camera: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  viewMode: ViewMode;
}) {
  const model = createBoxDrawModel({
    box,
    camera,
    canvasHeight: ctx.canvas.height,
    canvasWidth: ctx.canvas.width,
    fov,
    viewMode,
  });
  if (!model) return;

  for (const face of model.faces) {
    ctx.beginPath();
    ctx.moveTo(face.points[0].x, face.points[0].y);
    for (const point of face.points.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fillStyle = baseTheme.color.worldFace;
    ctx.fill();
  }

  for (const edge of model.edges) {
    const a = model.projected[edge.a];
    const b = model.projected[edge.b];
    const alpha = Math.max(0.2, Math.min(0.9, 1 - edge.depth / 1200));

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = rgba(baseTheme.color.worldEdgeRgb, alpha);
    ctx.lineWidth = alpha > 0.55 ? 1.8 : 1;
    ctx.stroke();
  }
}

export function drawAxes({
  camera,
  center,
  ctx,
  fov,
  size,
  viewMode,
}: {
  camera: Vector3;
  center: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  size: number;
  viewMode: ViewMode;
}) {
  const axes = [
    { color: baseTheme.color.worldAxisX, label: "X", vector: new Vector3(size, 0, 0) },
    { color: baseTheme.color.worldAxisY, label: "Y", vector: new Vector3(0, size, 0) },
    { color: baseTheme.color.worldAxisZ, label: "Z", vector: new Vector3(0, 0, size) },
  ];
  const origin = projectPoint({
    camera,
    canvasHeight: ctx.canvas.height,
    canvasWidth: ctx.canvas.width,
    fov,
    point: center,
    viewMode,
  });
  if (!origin) return;

  ctx.font = baseTheme.typography.canvasAxisFont;
  ctx.textBaseline = "middle";

  for (const axis of axes) {
    const end = projectPoint({
      camera,
      canvasHeight: ctx.canvas.height,
      canvasWidth: ctx.canvas.width,
      fov,
      point: center.clone().add(axis.vector),
      viewMode,
    });
    if (!end) continue;

    ctx.lineWidth = 2;
    drawScreenArrow({ color: axis.color, ctx, end, start: origin });

    for (let tick = size / 4; tick < size; tick += size / 4) {
      const tickPoint = projectPoint({
        camera,
        canvasHeight: ctx.canvas.height,
        canvasWidth: ctx.canvas.width,
        fov,
        point: center.clone().add(axis.vector.clone().scale(tick / size)),
        viewMode,
      });
      if (!tickPoint) continue;

      ctx.beginPath();
      ctx.moveTo(tickPoint.x - 3, tickPoint.y);
      ctx.lineTo(tickPoint.x + 3, tickPoint.y);
      ctx.moveTo(tickPoint.x, tickPoint.y - 3);
      ctx.lineTo(tickPoint.x, tickPoint.y + 3);
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillStyle = axis.color;
    ctx.fillText(axis.label, end.x + 5, end.y - 5);
  }
}

export function drawGrid({
  camera,
  ctx,
  fov,
  size,
  spacing,
  viewMode,
}: {
  camera: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  size: number;
  spacing: number;
  viewMode: ViewMode;
}) {
  ctx.beginPath();
  ctx.strokeStyle = baseTheme.color.worldGrid;
  ctx.lineWidth = 1;

  for (const [start, end] of createGridLines(size, spacing, viewMode)) {
    const a = projectPoint({
      camera,
      canvasHeight: ctx.canvas.height,
      canvasWidth: ctx.canvas.width,
      fov,
      point: start,
      viewMode,
    });
    const b = projectPoint({
      camera,
      canvasHeight: ctx.canvas.height,
      canvasWidth: ctx.canvas.width,
      fov,
      point: end,
      viewMode,
    });

    if (a && b) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
  }

  ctx.stroke();
}

export function drawForceCenter({
  camera,
  center,
  ctx,
  fov,
  viewMode,
}: {
  camera: Vector3;
  center: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  viewMode: ViewMode;
}) {
  const projected = projectPoint({
    camera,
    canvasHeight: ctx.canvas.height,
    canvasWidth: ctx.canvas.width,
    fov,
    point: center,
    viewMode,
  });
  if (!projected) return;

  ctx.beginPath();
  ctx.arc(projected.x, projected.y, 6, 0, Math.PI * 2);
  ctx.strokeStyle = baseTheme.color.worldCenterStroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = baseTheme.color.worldCenterLabel;
  ctx.fillText("center", projected.x + 8, projected.y - 8);
}

export function drawFieldVectors({
  camera,
  ctx,
  fov,
  physics,
  size,
  spacing,
  testParticleType,
  viewMode,
}: {
  camera: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  physics: Physics;
  size: number;
  spacing: number;
  testParticleType: ParticleType;
  viewMode: ViewMode;
}) {
  ctx.strokeStyle = baseTheme.color.fieldVector;
  ctx.lineWidth = 1;

  for (let x = -size; x <= size; x += spacing) {
    for (let y = -size; y <= size; y += spacing) {
      const point = createFieldSamplePoint(x, y, viewMode);
      const projected = projectPoint({
        camera,
        canvasHeight: ctx.canvas.height,
        canvasWidth: ctx.canvas.width,
        fov,
        point,
        viewMode,
      });
      if (!projected) continue;

      const field = physics.sampleAccelerationAt(point, testParticleType).clampLength(80);
      if (field.lengthSq() < 0.0001) continue;

      const end = projectPoint({
        camera,
        canvasHeight: ctx.canvas.height,
        canvasWidth: ctx.canvas.width,
        fov,
        point: point.clone().add(field.scale(0.55)),
        viewMode,
      });
      if (!end) continue;

      drawScreenArrow({
        color: baseTheme.color.fieldVector,
        ctx,
        end,
        start: projected,
      });
    }
  }
}

export function drawPotentialHeatmap({
  camera,
  ctx,
  fov,
  physics,
  size,
  spacing,
  testParticleType,
  viewMode,
}: {
  camera: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  physics: Physics;
  size: number;
  spacing: number;
  testParticleType: ParticleType;
  viewMode: ViewMode;
}) {
  for (let x = -size; x <= size; x += spacing) {
    for (let y = -size; y <= size; y += spacing) {
      const point = createFieldSamplePoint(x, y, viewMode);
      const projected = projectPoint({
        camera,
        canvasHeight: ctx.canvas.height,
        canvasWidth: ctx.canvas.width,
        fov,
        point,
        viewMode,
      });
      if (!projected) continue;

      const potential = physics.samplePotentialAt(point, testParticleType);
      if (!Number.isFinite(potential) || Math.abs(potential) < 0.001) continue;

      const intensity = Math.min(0.38, Math.abs(potential) / 18_000);
      ctx.fillStyle =
        potential >= 0
          ? rgba(baseTheme.color.potentialPositiveRgb, intensity)
          : rgba(baseTheme.color.potentialNegativeRgb, intensity);
      ctx.fillRect(projected.x - 10, projected.y - 10, 20, 20);
    }
  }
}

export function drawProbe({
  camera,
  ctx,
  fov,
  physics,
  point,
  testParticleType,
  viewMode,
}: {
  camera: Vector3;
  ctx: CanvasRenderingContext2D;
  fov: number;
  physics: Physics;
  point: Vector3;
  testParticleType: ParticleType;
  viewMode: ViewMode;
}) {
  const projected = projectPoint({
    camera,
    canvasHeight: ctx.canvas.height,
    canvasWidth: ctx.canvas.width,
    fov,
    point,
    viewMode,
  });
  if (!projected) return;

  const acceleration = physics.sampleAccelerationAt(point, testParticleType).clampLength(90);
  const end = projectPoint({
    camera,
    canvasHeight: ctx.canvas.height,
    canvasWidth: ctx.canvas.width,
    fov,
    point: point.clone().add(acceleration.scale(0.6)),
    viewMode,
  });

  ctx.beginPath();
  ctx.arc(projected.x, projected.y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = baseTheme.color.probeStroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = baseTheme.color.probeLabel;
  ctx.fillText("probe", projected.x + 10, projected.y - 8);

  if (end) {
    ctx.lineWidth = 2;
    drawScreenArrow({
      color: baseTheme.color.probeVector,
      ctx,
      end,
      start: projected,
    });
  }
}
