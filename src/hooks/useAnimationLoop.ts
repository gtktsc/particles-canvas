import { CanvasRefs } from "@/hooks/useCanvasRefs";
import { SimulationSettings } from "@/context/SimulationSettingsContext";

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

    particles.forEach((p) => {
      const baseColor = mouse.contains(p.position)
        ? "rgba(255, 255, 255, 1)"
        : undefined;
      p.render(
        ctx,
        width,
        height,
        settings.fov,
        settings.cameraPosition,
        baseColor
      );
    });

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
