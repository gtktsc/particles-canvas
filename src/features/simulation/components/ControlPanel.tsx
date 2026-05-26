"use client";

import { ControlSection } from "@/features/simulation/components/ControlSection";
import { ForceCard } from "@/features/simulation/components/ForceCard";
import { MeasurementsPanel } from "@/features/simulation/components/MeasurementsPanel";
import { PanelButton } from "@/features/simulation/components/PanelButton";
import { SliderControl } from "@/features/simulation/components/SliderControl";
import { StatsPanel } from "@/features/simulation/components/StatsPanel";
import {
  createDefaultSettings,
  type ExampleLayoutId,
  type SimulationSettings,
  type ViewMode,
  useSimulationSettings,
  useSimulationStats,
} from "@/features/simulation/model/SimulationSettingsContext";
import { Vector3 } from "@/features/simulation/model/Vector3";
import {
  CONTROL_CONFIG,
  type ScalarControl,
  type VectorAxis,
  type VectorControl,
  type VectorSettingKey,
} from "@/features/simulation/model/controlConfig";
import {
  createAllForcesDefaultPatch,
  createAllForcesDisabledPatch,
  createForceDefaultPatch,
  FORCE_DEFINITIONS,
  FORCE_PRESETS,
  type ForceCategory,
  type ForceDefinition,
} from "@/features/simulation/model/forceDefinitions";
import type { ParticleType } from "@/features/simulation/model/Particle";
import {
  createScalarSettingPatch,
  createVectorSettingPatch,
} from "@/features/simulation/model/settingsPatch";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type SliderConfig = ScalarControl | VectorControl;

const FORCE_GROUPS = [
  { id: "fields", title: "Fields" },
  { id: "pairForces", title: "Pair Forces" },
  { id: "constraints", title: "Constraints" },
  { id: "contacts", title: "Contacts" },
] as const satisfies readonly { id: ForceCategory; title: string }[];

const VIEW_MODES = [
  { id: "front", label: "Front" },
  { id: "top", label: "Top" },
  { id: "side", label: "Side" },
  { id: "iso", label: "Iso" },
] as const satisfies readonly { id: ViewMode; label: string }[];

const INITIAL_LAYOUTS = [
  { id: "random", label: "Random" },
  { id: "beam", label: "Beam" },
  { id: "ringOrbit", label: "Orbit Ring" },
  { id: "twoBody", label: "Two Body" },
  { id: "springLine", label: "Spring Line" },
  { id: "gasBox", label: "Gas Box" },
  { id: "fallingColumn", label: "Falling Column" },
] as const satisfies readonly { id: ExampleLayoutId; label: string }[];

const PROBE_TYPES = [
  { id: "proton", label: "Positive" },
  { id: "electron", label: "Negative" },
  { id: "neutron", label: "Neutral" },
] as const satisfies readonly { id: ParticleType; label: string }[];

export function ControlPanel() {
  const [settings, setSettings] = useSimulationSettings();
  const [stats] = useSimulationStats();
  const { messages } = useMessages();
  const defaults = createDefaultSettings();
  const controls = messages.simulation.controls;

  const setScalarSetting = (key: ScalarControl["key"], value: number) => {
    setSettings(createScalarSettingPatch(key, value));
  };

  const setForceScalarSetting = (
    key: keyof SimulationSettings,
    value: number
  ) => {
    setSettings({ [key]: value } as Partial<SimulationSettings>);
  };

  const setBooleanSetting = (key: keyof SimulationSettings, value: boolean) => {
    setSettings({ [key]: value } as Partial<SimulationSettings>);
  };

  const setVectorSetting = (
    key: VectorSettingKey,
    axis: VectorAxis,
    value: number
  ) => {
    setSettings(createVectorSettingPatch(settings, key, axis, value));
  };

  const getSliderValue = (config: SliderConfig) => {
    if (config.kind === "scalar") {
      return settings[config.key];
    }

    return settings[config.key][config.axis];
  };

  const renderSlider = (config: SliderConfig) => (
    <SliderControl
      config={config}
      key={`${config.kind}-${config.key}-${"axis" in config ? config.axis : ""}`}
      label={controls.fields[config.labelKey]}
      onChange={(value) => {
        if (config.kind === "scalar") {
          setScalarSetting(config.key, value);
          return;
        }

        setVectorSetting(config.key, config.axis, value);
      }}
      value={getSliderValue(config)}
    />
  );

  const applyPreset = (preset: (typeof FORCE_PRESETS)[number]) => {
    setSettings({
      ...createAllForcesDisabledPatch(),
      ...preset.settings,
      activeExampleId: preset.id,
      resetSignal: settings.resetSignal + 1,
    });
  };

  const resetForce = (force: ForceDefinition) => {
    setSettings(createForceDefaultPatch(force, defaults));
  };

  const resetForces = () => {
    setSettings(createAllForcesDefaultPatch(defaults));
  };

  const setViewMode = (viewMode: ViewMode) => {
    const distance = settings.fov;
    const cameraPosition =
      viewMode === "front"
        ? new Vector3(0, 0, -distance)
        : viewMode === "top"
          ? new Vector3(0, -distance, 0)
          : viewMode === "side"
            ? new Vector3(-distance, 0, 0)
            : new Vector3(0, 0, 0);

    setSettings({ cameraPosition, viewMode });
  };

  const renderToggle = (
    key: keyof SimulationSettings,
    label: string
  ) => (
    <label className={styles.toggle} key={String(key)}>
      <input
        checked={Boolean(settings[key])}
        onChange={(event) => setBooleanSetting(key, event.target.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );

  const activeExample =
    FORCE_PRESETS.find((preset) => preset.id === settings.activeExampleId) ??
    FORCE_PRESETS[0];
  const activeForceIds = new Set<string>(activeExample.activeForces);
  const activeForceTitles = activeExample.activeForces
    .map((forceId) => FORCE_DEFINITIONS.find((force) => force.id === forceId)?.title)
    .filter(Boolean)
    .join(", ");
  const suggestedSliders = FORCE_DEFINITIONS
    .filter((force) => activeForceIds.has(force.id))
    .flatMap((force) => force.sliders.map((slider) => slider.label))
    .slice(0, 5)
    .join(", ");

  return (
    <div className={styles.panel}>
      <header className={styles.panelHeader}>
        <div>
          <h1 className={styles.title}>Forces Lab</h1>
          <p className={styles.subtitle}>Toy units. Real force patterns.</p>
        </div>
        <PanelButton
          label={settings.isPaused ? "Resume" : "Pause"}
          onClick={() => setBooleanSetting("isPaused", !settings.isPaused)}
        />
      </header>

      <div className={styles.toolbar}>
        <PanelButton
          label="Step"
          onClick={() =>
            setSettings({
              isPaused: true,
              stepSignal: settings.stepSignal + 1,
            })
          }
        />
        <PanelButton
          label="Reset Simulation"
          onClick={() => setSettings({ resetSignal: settings.resetSignal + 1 })}
        />
        <PanelButton label="Reset Forces" onClick={resetForces} />
      </div>

      <div className={styles.viewControls} aria-label="View controls">
        {VIEW_MODES.map((view) => (
          <button
            className={`${styles.viewButton} ${
              settings.viewMode === view.id ? styles.activeButton : ""
            }`}
            key={view.id}
            onClick={() => setViewMode(view.id)}
            type="button"
          >
            {view.label}
          </button>
        ))}
        <button
          className={styles.viewButton}
          onClick={() =>
            setSettings({
              cameraPosition: defaults.cameraPosition,
              fov: defaults.fov,
              viewMode: defaults.viewMode,
              zoom: defaults.zoom,
            })
          }
          type="button"
        >
          Reset View
        </button>
      </div>

      <div className={styles.overlayControls}>
        {renderToggle("showAxes", "Axes")}
        {renderToggle("showGrid", "Grid")}
        {renderToggle("showFieldVectors", "Field")}
        {renderToggle("showPotentialHeatmap", "Potential")}
        {renderToggle("showVelocityVectors", "Velocity")}
        {renderToggle("showForceVectors", "Force")}
        {renderToggle("showParticleLabels", "Labels")}
        {renderToggle("showTrails", "Trails")}
        {renderToggle("showDepthShading", "Depth")}
        {renderToggle("showGraphs", "Graphs")}
        {renderToggle("probeEnabled", "Probe")}
      </div>

      <div className={styles.selectGrid}>
        <label className={styles.selectLabel}>
          <span>Initial layout</span>
          <select
            className={styles.select}
            onChange={(event) =>
              setSettings({
                initialLayout: event.target.value as ExampleLayoutId,
                resetSignal: settings.resetSignal + 1,
              })
            }
            value={settings.initialLayout}
          >
            {INITIAL_LAYOUTS.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectLabel}>
          <span>Probe type</span>
          <select
            className={styles.select}
            disabled={!settings.probeEnabled}
            onChange={(event) =>
              setSettings({ probeParticleType: event.target.value as ParticleType })
            }
            value={settings.probeParticleType}
          >
            {PROBE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SliderControl
        config={{ min: 0, max: 180, step: 5 }}
        disabled={!settings.showTrails}
        label="Trail length"
        onChange={(value) => setForceScalarSetting("trailLength", value)}
        value={settings.trailLength}
      />

      <StatsPanel stats={stats} />

      {(settings.showGraphs || settings.probeEnabled) ? (
        <MeasurementsPanel settings={settings} stats={stats} />
      ) : null}

      <section className={styles.examplePanel} aria-label="Current example">
        <h2 className={styles.groupTitle}>{activeExample.title}</h2>
        <div className={styles.formula}>{activeExample.formula}</div>
        <p className={styles.description}>{activeExample.whatToNotice}</p>
        <dl className={styles.exampleMeta}>
          <div>
            <dt>Active</dt>
            <dd>{activeForceTitles || "None"}</dd>
          </div>
          <div>
            <dt>Try</dt>
            <dd>{suggestedSliders || "Initial velocity, particle count"}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.examples} aria-label="Examples">
        {FORCE_PRESETS.map((preset) => (
          <button
            className={`${styles.exampleButton} ${
              settings.activeExampleId === preset.id ? styles.activeExample : ""
            }`}
            key={preset.id}
            onClick={() => applyPreset(preset)}
            type="button"
          >
            <strong>{preset.title}</strong>
            <span>{preset.description}</span>
            <em>{preset.whatToNotice}</em>
          </button>
        ))}
      </section>

      <ControlSection
        actionLabel={controls.actions.resetWorld}
        defaultOpen
        onReset={() =>
          setSettings({
            worldWidth: defaults.worldWidth,
            worldHeight: defaults.worldHeight,
            worldZ: defaults.worldZ,
            fov: defaults.fov,
            zoom: defaults.zoom,
          })
        }
        title={controls.sections.world}
      >
        {CONTROL_CONFIG.world.map(renderSlider)}
      </ControlSection>

      <ControlSection
        actionLabel={controls.actions.resetCenter}
        onReset={() =>
          setSettings({
            forceCenterPoint: new Vector3(0, 0, 0),
          })
        }
        title={controls.sections.center}
      >
        {CONTROL_CONFIG.center.map(renderSlider)}
      </ControlSection>

      <ControlSection
        actionLabel={controls.actions.resetCamera}
        onReset={() => setSettings({ cameraPosition: defaults.cameraPosition })}
        title={controls.sections.camera}
      >
        {CONTROL_CONFIG.camera.map(renderSlider)}
      </ControlSection>

      <ControlSection
        actionLabel={controls.actions.resetParticles}
        onReset={() =>
          setSettings({
            electrons: defaults.electrons,
            protons: defaults.protons,
            neutrons: defaults.neutrons,
            resetSignal: settings.resetSignal + 1,
          })
        }
        title={controls.sections.particles}
      >
        {CONTROL_CONFIG.particles.map(renderSlider)}
      </ControlSection>

      <section className={styles.forceList} aria-label="Forces">
        {FORCE_GROUPS.map((group) => (
          <div className={styles.forceGroup} key={group.id}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            {FORCE_DEFINITIONS.filter((force) => force.category === group.id).map(
              (force) => (
                <ForceCard
                  force={force}
                  key={force.id}
                  onReset={resetForce}
                  onScalarChange={setForceScalarSetting}
                  onToggle={setBooleanSetting}
                  settings={settings}
                />
              )
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
