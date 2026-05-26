export type ForceId =
  | "centerSpring"
  | "uniformField"
  | "electricField"
  | "magneticField"
  | "centralGravity"
  | "pointChargeField"
  | "drag"
  | "charge"
  | "gravity"
  | "lennardJones"
  | "pairSpring"
  | "nuclear"
  | "shell"
  | "fluidDrag"
  | "buoyancy"
  | "collision";

export type ForceEnabledKey =
  | "centerSpringEnabled"
  | "uniformFieldEnabled"
  | "electricFieldEnabled"
  | "magneticFieldEnabled"
  | "centralGravityEnabled"
  | "pointChargeFieldEnabled"
  | "dragEnabled"
  | "chargeEnabled"
  | "gravityEnabled"
  | "lennardJonesEnabled"
  | "pairSpringEnabled"
  | "nuclearEnabled"
  | "shellEnabled"
  | "fluidDragEnabled"
  | "buoyancyEnabled"
  | "collisionEnabled";

export type ForceScalarSettingKey =
  | "centerSpringStrength"
  | "uniformFieldX"
  | "uniformFieldY"
  | "uniformFieldZ"
  | "electricFieldX"
  | "electricFieldY"
  | "electricFieldZ"
  | "magneticFieldZ"
  | "centralGravityStrength"
  | "centralGravitySoftening"
  | "pointChargeStrength"
  | "pointChargeAmount"
  | "pointChargeSoftening"
  | "dragStrength"
  | "chargeStrength"
  | "chargeSoftening"
  | "chargeRange"
  | "gravityStrength"
  | "gravitySoftening"
  | "gravityRange"
  | "lennardJonesStrength"
  | "lennardJonesRadius"
  | "lennardJonesRange"
  | "pairSpringStrength"
  | "pairSpringRestLength"
  | "pairSpringDamping"
  | "pairSpringRange"
  | "nuclearStrength"
  | "nuclearRange"
  | "shellConstraintK"
  | "defaultElectronRadius"
  | "fluidDragLinear"
  | "fluidDragQuadratic"
  | "mediumVelocityX"
  | "mediumVelocityY"
  | "mediumVelocityZ"
  | "buoyancyDensity"
  | "buoyancyStrength"
  | "fluidSurfaceY";

export type ForceCategory =
  | "constraints"
  | "fields"
  | "pairForces"
  | "contacts";

export type ForcePresetId =
  | "none"
  | "constantAcceleration"
  | "spring"
  | "electricFieldDeflection"
  | "magneticCircularMotion"
  | "orbitAttempt"
  | "pointChargeField"
  | "springChain"
  | "orbitRing"
  | "twoBodyAttempt"
  | "viscousMedium"
  | "windTunnel"
  | "buoyantRise"
  | "energyExchange"
  | "chargeDipole"
  | "chargeAttraction"
  | "chargeRepulsion"
  | "gravityCluster"
  | "lennardJonesGas"
  | "nuclearCore"
  | "collisionMomentum"
  | "fullMix";

export type ForceSlider = {
  advanced?: boolean;
  key: ForceScalarSettingKey;
  min: number;
  max: number;
  step: number;
};

export type ForceDefinition = {
  category: ForceCategory;
  id: ForceId;
  enabledKey: ForceEnabledKey;
  sliders: readonly ForceSlider[];
};
