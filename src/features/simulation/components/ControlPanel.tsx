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
import { FORCE_DEFINITIONS } from "@/features/simulation/model/forceDefinitions";
import {
  createAllForcesDefaultPatch,
  createAllForcesDisabledPatch,
  createForceDefaultPatch,
} from "@/features/simulation/model/forcePatches";
import {
  FORCE_PRESETS,
  type ForcePreset,
} from "@/features/simulation/model/forcePresets";
import type {
  ForceCategory,
  ForceDefinition,
  ForceScalarSettingKey,
} from "@/features/simulation/model/forceTypes";
import type { ParticleType } from "@/features/simulation/model/Particle";
import {
  createBooleanSettingPatch,
  createForceScalarSettingPatch,
  createNumberSettingPatch,
  createScalarSettingPatch,
  createVectorSettingPatch,
  type BooleanSettingKey,
} from "@/features/simulation/model/settingsPatch";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type SliderConfig = ScalarControl | VectorControl;

const FORCE_GROUPS = [
  { id: "fields" },
  { id: "pairForces" },
  { id: "constraints" },
  { id: "contacts" },
] as const satisfies readonly { id: ForceCategory }[];

const VIEW_MODES = [
  { id: "front" },
  { id: "top" },
  { id: "side" },
  { id: "iso" },
] as const satisfies readonly { id: ViewMode }[];

const INITIAL_LAYOUTS = [
  { id: "random" },
  { id: "beam" },
  { id: "ringOrbit" },
  { id: "twoBody" },
  { id: "springLine" },
  { id: "gasBox" },
  { id: "fallingColumn" },
] as const satisfies readonly { id: ExampleLayoutId }[];

const PROBE_TYPES = [
  { id: "proton" },
  { id: "electron" },
  { id: "neutron" },
] as const satisfies readonly { id: ParticleType }[];

type OverlaySettingKey =
  | "showAxes"
  | "showGrid"
  | "showFieldVectors"
  | "showPotentialHeatmap"
  | "showVelocityVectors"
  | "showForceVectors"
  | "showParticleLabels"
  | "showTrails"
  | "showDepthShading"
  | "showGraphs"
  | "probeEnabled";

export function ControlPanel() {
  const [settings, setSettings] = useSimulationSettings();
  const [stats] = useSimulationStats();
  const { messages } = useMessages();
  const defaults = createDefaultSettings();
  const controls = messages.simulation.controls;
  const forceLab = messages.simulation.forceLab;

  const setScalarSetting = (key: ScalarControl["key"], value: number) => {
    setSettings(createScalarSettingPatch(key, value));
  };

  const setForceScalarSetting = (
    key: ForceScalarSettingKey,
    value: number
  ) => {
    setSettings(createForceScalarSettingPatch(key, value));
  };

  const setNumberSetting = (key: "trailLength", value: number) => {
    setSettings(createNumberSettingPatch(key, value));
  };

  const setBooleanSetting = (key: BooleanSettingKey, value: boolean) => {
    setSettings(createBooleanSettingPatch(key, value));
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

  const applyPreset = (preset: ForcePreset) => {
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

  const renderToggle = (key: OverlaySettingKey) => (
    <label className={styles.toggle} key={String(key)}>
      <input
        checked={settings[key]}
        onChange={(event) => setBooleanSetting(key, event.target.checked)}
        type="checkbox"
      />
      <span>{forceLab.overlays[key]}</span>
    </label>
  );

  const activeExample =
    FORCE_PRESETS.find((preset) => preset.id === settings.activeExampleId) ??
    FORCE_PRESETS[0];
  const activeExampleCopy = forceLab.examples[activeExample.id];
  const activeForceIds = new Set<string>(activeExample.activeForces);
  const activeForceTitles = activeExample.activeForces
    .map((forceId) => forceLab.forces[forceId].title)
    .filter(Boolean)
    .join(", ");
  const suggestedSliders = FORCE_DEFINITIONS
    .filter((force) => activeForceIds.has(force.id))
    .flatMap((force) =>
      force.sliders.map((slider) => forceLab.sliderLabels[slider.key])
    )
    .slice(0, 5)
    .join(", ");

  return (
    <div className={styles.panel}>
      <header className={styles.panelHeader}>
        <div>
          <h1 className={styles.title}>{forceLab.title}</h1>
          <p className={styles.subtitle}>{forceLab.subtitle}</p>
        </div>
        <PanelButton
          label={settings.isPaused ? forceLab.actions.resume : forceLab.actions.pause}
          onClick={() => setBooleanSetting("isPaused", !settings.isPaused)}
        />
      </header>

      <div className={styles.toolbar}>
        <PanelButton
          label={forceLab.actions.step}
          onClick={() =>
            setSettings({
              isPaused: true,
              stepSignal: settings.stepSignal + 1,
            })
          }
        />
        <PanelButton
          label={forceLab.actions.resetSimulation}
          onClick={() => setSettings({ resetSignal: settings.resetSignal + 1 })}
        />
        <PanelButton label={forceLab.actions.resetForces} onClick={resetForces} />
      </div>

      <div className={styles.viewControls} aria-label={forceLab.aria.viewControls}>
        {VIEW_MODES.map((view) => (
          <button
            className={`${styles.viewButton} ${
              settings.viewMode === view.id ? styles.activeButton : ""
            }`}
            key={view.id}
            onClick={() => setViewMode(view.id)}
            type="button"
          >
            {forceLab.viewModes[view.id]}
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
          {forceLab.actions.resetView}
        </button>
      </div>

      <div className={styles.overlayControls}>
        {renderToggle("showAxes")}
        {renderToggle("showGrid")}
        {renderToggle("showFieldVectors")}
        {renderToggle("showPotentialHeatmap")}
        {renderToggle("showVelocityVectors")}
        {renderToggle("showForceVectors")}
        {renderToggle("showParticleLabels")}
        {renderToggle("showTrails")}
        {renderToggle("showDepthShading")}
        {renderToggle("showGraphs")}
        {renderToggle("probeEnabled")}
      </div>

      <div className={styles.selectGrid}>
        <label className={styles.selectLabel}>
          <span>{forceLab.selects.initialLayout}</span>
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
                {forceLab.initialLayouts[layout.id]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectLabel}>
          <span>{forceLab.selects.probeType}</span>
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
                {forceLab.probeTypes[type.id]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SliderControl
        config={{ min: 0, max: 180, step: 5 }}
        disabled={!settings.showTrails}
        label={forceLab.fields.trailLength}
        onChange={(value) => setNumberSetting("trailLength", value)}
        value={settings.trailLength}
      />

      <StatsPanel stats={stats} />

      {(settings.showGraphs || settings.probeEnabled) ? (
        <MeasurementsPanel settings={settings} stats={stats} />
      ) : null}

      <section
        className={styles.examplePanel}
        aria-label={forceLab.aria.currentExample}
      >
        <h2 className={styles.groupTitle}>{activeExampleCopy.title}</h2>
        <div className={styles.formula}>{activeExampleCopy.formula}</div>
        <p className={styles.description}>{activeExampleCopy.whatToNotice}</p>
        <dl className={styles.exampleMeta}>
          <div>
            <dt>{forceLab.currentExample.active}</dt>
            <dd>{activeForceTitles || forceLab.currentExample.none}</dd>
          </div>
          <div>
            <dt>{forceLab.currentExample.try}</dt>
            <dd>
              {suggestedSliders || forceLab.currentExample.fallbackSliders}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.examples} aria-label={forceLab.aria.examples}>
        {FORCE_PRESETS.map((preset) => {
          const presetCopy = forceLab.examples[preset.id];

          return (
            <button
              className={`${styles.exampleButton} ${
                settings.activeExampleId === preset.id ? styles.activeExample : ""
              }`}
              key={preset.id}
              onClick={() => applyPreset(preset)}
              type="button"
            >
              <strong>{presetCopy.title}</strong>
              <span>{presetCopy.description}</span>
              <em>{presetCopy.whatToNotice}</em>
            </button>
          );
        })}
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

      <section className={styles.forceList} aria-label={forceLab.aria.forces}>
        {FORCE_GROUPS.map((group) => (
          <div className={styles.forceGroup} key={group.id}>
            <h2 className={styles.groupTitle}>
              {forceLab.forceGroups[group.id]}
            </h2>
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
