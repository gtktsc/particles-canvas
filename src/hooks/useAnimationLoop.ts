import { CanvasRefs } from "@/hooks/useCanvasRefs";
import { SimulationSettings } from "@/context/SimulationSettingsContext";
import { Vector3 } from "@/classes/Vector3";

type useAnimationLoopProps = {
  refs: CanvasRefs;
  settings: SimulationSettings;
  initialize: (canvas: HTMLCanvasElement) => void;
};

export function useAnimationLoop({
  refs,
  settings,
  initialize,
}: useAnimationLoopProps) {
  const animate = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;

    if (
      !refs.particlesRef.current ||
      !refs.physicsRef.current ||
      !refs.mouseRef.current ||
      !refs.worldRef.current
    ) {
      initialize(ctx.canvas);
    }

    const now = performance.now();
    const delta = now - refs.lastFpsTime.current;
    if (delta >= 1000) {
      refs.smoothedFps.current = Math.round(
        (refs.frameCount.current * 1000) / delta
      );
      refs.frameCount.current = 0;
      refs.lastFpsTime.current = now;
    }

    const particles = refs.particlesRef.current!;
    const physics = refs.physicsRef.current!;
    const mouse = refs.mouseRef.current!;
    const world = refs.worldRef.current!;
    const center = settings.centerAttractionPoint;

    refs.frameCount.current++;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    world.updateSize(
      settings.worldWidth,
      settings.worldHeight,
      settings.worldZ
    );
    world.render(ctx, settings.fov, settings.cameraPosition);

    particles.forEach((p) => {
      p.update(
        center,
        {
          width: settings.worldWidth,
          height: settings.worldHeight,
          depth: settings.worldZ,
        },
        settings.damping,
        settings.centerAttraction
      );
    });

    const maxRadius = Math.max(...particles.map((p) => p.radius));
    const cellSize = maxRadius * 2 * 1.2;
    physics.index(particles, cellSize);

    if (refs.frameCount.current % 2 === 0) {
      physics.resolveCollisions();
    }

    if (refs.frameCount.current % 2 === 0) {
      physics.resolveCharges();
    }

    const colorGroups: Record<
      string,
      { px: number; py: number; radius: number }[]
    > = {};

    if (refs.frameCount.current % 4 === 0) {
      refs.sortedParticlesRef.current = [...particles].sort(
        (a, b) => a.position.z - b.position.z
      );
    }
    const sortedParticles = refs.sortedParticlesRef.current ?? particles;

    const pixelBuffer = new Set<number>();

    for (let i = 0; i < sortedParticles.length; i++) {
      const p = sortedParticles[i];
      const baseColor = mouse.contains(p.position)
        ? "rgba(255,255,255,1)"
        : undefined;

      const proj = p.projectToScreen(
        width,
        height,
        settings.fov,
        settings.cameraPosition,
        baseColor
      );
      if (!proj) continue;

      const pixelX = Math.floor(proj.px);
      const pixelY = Math.floor(proj.py);
      const pixelKey = (pixelX << 16) | pixelY;

      if (pixelBuffer.has(pixelKey)) continue;
      pixelBuffer.add(pixelKey);

      const color = proj.color;
      if (!colorGroups[color]) colorGroups[color] = [];

      colorGroups[color].push({
        px: proj.px,
        py: proj.py,
        radius: proj.radius,
      });
    }

    for (const color in colorGroups) {
      const group = colorGroups[color];
      ctx.beginPath();

      for (let i = 0; i < group.length; i++) {
        const { px, py, radius } = group[i];
        ctx.moveTo(px + radius, py);
        ctx.arc(px, py, radius, 0, Math.PI * 2);
      }

      ctx.fillStyle = color;
      ctx.fill();
    }

    mouse.render(ctx, settings.fov, settings.cameraPosition);
    refs.requestRef.current = requestAnimationFrame(() => animate(ctx));

    const fpsText = `FPS: ${refs.smoothedFps.current}`;
    ctx.font = "14px sans-serif";
    const textWidth = ctx.measureText(fpsText).width;
    ctx.fillStyle =
      refs.smoothedFps.current > 50
        ? "lime"
        : refs.smoothedFps.current > 30
        ? "yellow"
        : "red";
    ctx.fillText(fpsText, ctx.canvas.width - textWidth - 10, 20);
  };

  return { animate };
}
