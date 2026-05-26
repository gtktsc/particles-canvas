import { baseTheme } from "@/theme/theme";

export function calculateFps(frameCount: number, elapsedMs: number) {
  return Math.round((frameCount * 1000) / elapsedMs);
}

export function getFpsColor(fps: number) {
  if (fps > 50) return baseTheme.color.fpsGood;
  if (fps > 30) return baseTheme.color.fpsWarning;
  return baseTheme.color.fpsDanger;
}

export function drawFps(ctx: CanvasRenderingContext2D, fps: number) {
  const fpsText = `FPS: ${fps}`;
  ctx.font = baseTheme.typography.fpsFont;
  const textWidth = ctx.measureText(fpsText).width;
  ctx.fillStyle = getFpsColor(fps);
  ctx.fillText(fpsText, ctx.canvas.width - textWidth - 10, 20);
}
