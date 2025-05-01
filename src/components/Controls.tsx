"use client";

import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { getInitialCameraPosition, getInitialFOV } from "@/lib/defaults";
import {
  CENTER_ATTRACTION,
  CENTER_ATTRACTION_POINT,
  CONTROL_CONFIG,
  DAMPING,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  WORLD_Z,
} from "@/lib/constants";

export default function Controls() {
  const [settings, setSettings] = useSimulationSettings();

  const makeSlider = (
    label: string,
    key: string,
    min: number,
    max: number,
    step: number
  ) => {
    const value = key.split(".").reduce((o, k) => o[k], settings as any);
    return (
      <label style={{ display: "block", marginBottom: 10 }} key={key}>
        {label}: {value}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const [outer, inner] = key.split(".");
            if (inner) {
              setSettings({
                [outer]: {
                  ...(settings as any)[outer],
                  [inner]: Number(e.target.value),
                },
              });
            } else {
              setSettings({ [outer]: Number(e.target.value) });
            }
          }}
          style={{ width: "100%" }}
        />
      </label>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        zIndex: 10,
        padding: "1rem",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        borderRadius: 8,
        width: 260,
        fontFamily: "sans-serif",
        fontSize: 14,
        overflowY: "auto",
        maxHeight: "95vh",
      }}
    >
      <details open>
        <summary
          style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 10 }}
        >
          World
        </summary>
        {CONTROL_CONFIG.world.map((cfg) =>
          makeSlider(cfg.label, cfg.key, cfg.min, cfg.max, cfg.step)
        )}
        <button
          style={{ marginTop: 5 }}
          onClick={() =>
            setSettings({
              worldWidth: WORLD_WIDTH,
              worldHeight: WORLD_HEIGHT,
              worldZ: WORLD_Z,
              fov: getInitialFOV(),
            })
          }
        >
          Reset World
        </button>
      </details>

      <details>
        <summary
          style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 10 }}
        >
          Center
        </summary>
        {CONTROL_CONFIG.center.map((cfg) =>
          makeSlider(cfg.label, cfg.key, cfg.min, cfg.max, cfg.step)
        )}
        <button
          style={{ marginTop: 5 }}
          onClick={() =>
            setSettings({
              centerAttraction: CENTER_ATTRACTION,
              centerAttractionPoint: CENTER_ATTRACTION_POINT,
            })
          }
        >
          Reset Center
        </button>
      </details>

      <details>
        <summary
          style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 10 }}
        >
          Camera
        </summary>
        {CONTROL_CONFIG.camera.map((cfg) =>
          makeSlider(cfg.label, cfg.key, cfg.min, cfg.max, cfg.step)
        )}
        <button
          style={{ marginTop: 5 }}
          onClick={() =>
            setSettings({ cameraPosition: getInitialCameraPosition() })
          }
        >
          Reset Camera
        </button>
      </details>

      <details>
        <summary
          style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 10 }}
        >
          Particles
        </summary>
        {CONTROL_CONFIG.particles.map((cfg) =>
          makeSlider(cfg.label, cfg.key, cfg.min, cfg.max, cfg.step)
        )}
        <button
          style={{ marginTop: 5 }}
          onClick={() =>
            setSettings({ electrons: 100, protons: 100, neutrons: 100 })
          }
        >
          Reset Particles
        </button>
      </details>

      <details>
        <summary
          style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 10 }}
        >
          Physics
        </summary>
        {CONTROL_CONFIG.physics.map((cfg) =>
          makeSlider(cfg.label, cfg.key, cfg.min, cfg.max, cfg.step)
        )}
        <button
          style={{ marginTop: 5 }}
          onClick={() =>
            setSettings({
              damping: DAMPING,
            })
          }
        >
          Reset Physics
        </button>
      </details>
    </div>
  );
}
