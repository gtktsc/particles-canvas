import { CanvasRefs } from "@/features/simulation/hooks/useSimulationRefs";
import { Particle } from "@/features/simulation/model/Particle";
import { useCallback } from "react";

type MouseHandlers = {
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  removeListeners: () => void;
};

type UseMouseHandlersProps = {
  refs: CanvasRefs;
};

export function useMouseHandlers({
  refs,
}: UseMouseHandlersProps): MouseHandlers {
  const FORCE_SCALE = 2;

  const handleMouseDown = useCallback(() => {
    const mouse = refs.mouseRef.current;
    const particles = refs.particlesRef.current;
    if (mouse && particles) {
      mouse.startDrag(particles);
    }
  }, [refs]);

  const handleMouseUp = useCallback(() => {
    const result = refs.mouseRef.current?.endDrag();
    if (result) {
      result.targets.forEach((p: Particle) => {
        const impulse = result.force.clone().scale(p.mass * FORCE_SCALE);

        p.applyImpulse(impulse);
      });
    }
  }, [refs]);

  const removeListeners = useCallback(() => {
    const canvas = refs.canvasRef.current;
    if (canvas && refs.mouseRef.current) {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    }
  }, [handleMouseDown, handleMouseUp, refs]);

  return { handleMouseDown, handleMouseUp, removeListeners };
}
