"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "@/i18n/MessagesProvider";
import { useSimulationCanvasController } from "@/features/simulation/hooks/useSimulationCanvasController";
import styles from "@/features/simulation/components/ParticleCanvas.module.css";

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { messages } = useMessages();
  const { start, stop } = useSimulationCanvasController();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    start(ctx);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
    };
  }, [start, stop]);

  return (
    <canvas
      aria-label={messages.simulation.canvas.label}
      className={styles.canvas}
      ref={canvasRef}
    />
  );
}
