"use client";

import { ControlSection } from "@/features/simulation/components/ControlSection";
import { SliderControl } from "@/features/simulation/components/SliderControl";
import {
  createDefaultSettings,
  useSimulationSettings,
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
  createScalarSettingPatch,
  createVectorSettingPatch,
} from "@/features/simulation/model/settingsPatch";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "@/features/simulation/components/ControlPanel.module.css";

type SliderConfig = ScalarControl | VectorControl;

export function ControlPanel() {
  const [settings, setSettings] = useSimulationSettings();
  const { messages } = useMessages();
  const defaults = createDefaultSettings();
  const controls = messages.simulation.controls;

  const setScalarSetting = (key: ScalarControl["key"], value: number) => {
    setSettings(createScalarSettingPatch(key, value));
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

  return (
    <div className={styles.panel}>
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
            centerAttraction: defaults.centerAttraction,
            centerAttractionPoint: new Vector3(0, 0, 0),
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
          })
        }
        title={controls.sections.particles}
      >
        {CONTROL_CONFIG.particles.map(renderSlider)}
      </ControlSection>

      <ControlSection
        actionLabel={controls.actions.resetPhysics}
        onReset={() =>
          setSettings({
            damping: defaults.damping,
            chargeStrength: defaults.chargeStrength,
            nuclearRange: defaults.nuclearRange,
            nuclearStrength: defaults.nuclearStrength,
            shellConstraintK: defaults.shellConstraintK,
            defaultElectronRadius: defaults.defaultElectronRadius,
            gravityStrength: defaults.gravityStrength,
            gravityRange: defaults.gravityRange,
            lennardJonesStrength: defaults.lennardJonesStrength,
            lennardJonesRadius: defaults.lennardJonesRadius,
          })
        }
        title={controls.sections.physics}
      >
        {CONTROL_CONFIG.physics.map(renderSlider)}
      </ControlSection>
    </div>
  );
}
