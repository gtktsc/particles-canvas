import { CanvasRefs } from "@/hooks/useCanvasRefs";
import { Particle } from "@/classes/Particle";

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

  const handleMouseDown = () => {
    const mouse = refs.mouseRef.current;
    const particles = refs.particlesRef.current;
    if (mouse && particles) {
      mouse.startDrag(particles);
    }
  };

  const handleMouseUp = () => {
    const result = refs.mouseRef.current?.endDrag();
    if (result) {
      result.targets.forEach((p: Particle) => {
        const force = result.force.clone().scale(p.mass * FORCE_SCALE);

        p.applyForce(force.clone());
      });
    }
  };

  const removeListeners = () => {
    const canvas = refs.canvasRef.current;
    if (canvas && refs.mouseRef.current) {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    }
  };

  return { handleMouseDown, handleMouseUp, removeListeners };
}
