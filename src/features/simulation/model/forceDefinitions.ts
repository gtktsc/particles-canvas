import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";

export type ForceId =
  | "centerSpring"
  | "drag"
  | "uniformField"
  | "electricField"
  | "magneticField"
  | "centralGravity"
  | "pointChargeField"
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
  | "dragEnabled"
  | "uniformFieldEnabled"
  | "electricFieldEnabled"
  | "magneticFieldEnabled"
  | "centralGravityEnabled"
  | "pointChargeFieldEnabled"
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
  | "dragStrength"
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
  | "fluidDragLinear"
  | "fluidDragQuadratic"
  | "mediumVelocityX"
  | "mediumVelocityY"
  | "mediumVelocityZ"
  | "buoyancyDensity"
  | "buoyancyStrength"
  | "fluidSurfaceY"
  | "defaultElectronRadius";

export type ForceSlider = {
  advanced?: boolean;
  key: ForceScalarSettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
};

export type ForceCategory = "fields" | "pairForces" | "constraints" | "contacts";

export type ForceDefinition = {
  category: ForceCategory;
  id: ForceId;
  title: string;
  formula: string;
  description: string;
  enabledKey: ForceEnabledKey;
  sliders: readonly ForceSlider[];
};

export type ForcePreset = {
  activeForces: readonly ForceId[];
  id: string;
  title: string;
  description: string;
  formula: string;
  settings: Partial<SimulationSettings>;
  whatToNotice: string;
};

export const FORCE_DEFINITIONS = [
  {
    category: "constraints",
    id: "centerSpring",
    title: "Center Spring",
    formula: "F = -k x",
    description: "Pulls particles back toward the selected center point.",
    enabledKey: "centerSpringEnabled",
    sliders: [
      { key: "centerSpringStrength", label: "Spring k", min: 0, max: 4, step: 0.01 },
    ],
  },
  {
    category: "fields",
    id: "uniformField",
    title: "Uniform Acceleration",
    formula: "F = m a",
    description: "Applies the same acceleration to every particle.",
    enabledKey: "uniformFieldEnabled",
    sliders: [
      { key: "uniformFieldX", label: "ax", min: -80, max: 80, step: 1 },
      { key: "uniformFieldY", label: "ay", min: -80, max: 80, step: 1 },
      { key: "uniformFieldZ", label: "az", min: -80, max: 80, step: 1 },
    ],
  },
  {
    category: "fields",
    id: "electricField",
    title: "Electric Field",
    formula: "F = qE",
    description: "Positive and negative particles accelerate in opposite directions.",
    enabledKey: "electricFieldEnabled",
    sliders: [
      { key: "electricFieldX", label: "Ex", min: -500, max: 500, step: 10 },
      { key: "electricFieldY", label: "Ey", min: -500, max: 500, step: 10 },
      { key: "electricFieldZ", label: "Ez", min: -500, max: 500, step: 10 },
    ],
  },
  {
    category: "fields",
    id: "magneticField",
    title: "Magnetic Field",
    formula: "F = q(v x B)",
    description: "A velocity-dependent sideways force that bends charged paths.",
    enabledKey: "magneticFieldEnabled",
    sliders: [
      { key: "magneticFieldZ", label: "Bz", min: -80, max: 80, step: 1 },
    ],
  },
  {
    category: "fields",
    id: "centralGravity",
    title: "Central Inverse-Square",
    formula: "F = -k m r / (r^2 + e^2)^(3/2)",
    description: "Attracts particles toward the center like a softened orbital force.",
    enabledKey: "centralGravityEnabled",
    sliders: [
      { key: "centralGravityStrength", label: "k", min: 0, max: 80_000, step: 500 },
      { key: "centralGravitySoftening", label: "Softening", min: 1, max: 120, step: 1 },
    ],
  },
  {
    category: "fields",
    id: "pointChargeField",
    title: "Point Charge Field",
    formula: "F = q k Q r / (r^2 + e^2)^(3/2)",
    description: "External point charge at the force center.",
    enabledKey: "pointChargeFieldEnabled",
    sliders: [
      { key: "pointChargeStrength", label: "k", min: 0, max: 500_000, step: 5_000 },
      { key: "pointChargeAmount", label: "Q", min: -5, max: 5, step: 0.1 },
      { advanced: true, key: "pointChargeSoftening", label: "Softening", min: 1, max: 140, step: 1 },
    ],
  },
  {
    category: "constraints",
    id: "drag",
    title: "Drag",
    formula: "F = -c v",
    description: "Removes energy by pushing opposite to velocity.",
    enabledKey: "dragEnabled",
    sliders: [
      { key: "dragStrength", label: "Drag c", min: 0, max: 8, step: 0.01 },
    ],
  },
  {
    category: "pairForces",
    id: "charge",
    title: "Charge",
    formula: "F = k q1 q2 / (r^2 + e^2)",
    description: "Like charges repel. Opposite charges attract.",
    enabledKey: "chargeEnabled",
    sliders: [
      { key: "chargeStrength", label: "Strength", min: 0, max: 20_000, step: 100 },
      { key: "chargeSoftening", label: "Softening", min: 1, max: 80, step: 1 },
      { key: "chargeRange", label: "Range", min: 20, max: 600, step: 5 },
    ],
  },
  {
    category: "pairForces",
    id: "gravity",
    title: "Gravity",
    formula: "F = G m1 m2 / (r^2 + e^2)",
    description: "Masses attract each other inside a local range.",
    enabledKey: "gravityEnabled",
    sliders: [
      { key: "gravityStrength", label: "G", min: 0, max: 20, step: 0.1 },
      { key: "gravitySoftening", label: "Softening", min: 1, max: 100, step: 1 },
      { key: "gravityRange", label: "Range", min: 20, max: 600, step: 5 },
    ],
  },
  {
    category: "pairForces",
    id: "lennardJones",
    title: "Lennard-Jones",
    formula: "F = 24e/r (2(s/r)^12 - (s/r)^6)",
    description: "Short-range repulsion and medium-range attraction.",
    enabledKey: "lennardJonesEnabled",
    sliders: [
      { key: "lennardJonesStrength", label: "Epsilon", min: 0, max: 6_000, step: 50 },
      { key: "lennardJonesRadius", label: "Sigma", min: 2, max: 80, step: 1 },
      { key: "lennardJonesRange", label: "Range", min: 10, max: 240, step: 2 },
    ],
  },
  {
    category: "pairForces",
    id: "pairSpring",
    title: "Pair Spring",
    formula: "F = -k(r - L0) - c v_rel",
    description: "Connects nearby particles with damped Hooke springs.",
    enabledKey: "pairSpringEnabled",
    sliders: [
      { key: "pairSpringStrength", label: "Spring k", min: 0, max: 160, step: 1 },
      { key: "pairSpringRestLength", label: "Rest length", min: 4, max: 140, step: 1 },
      { advanced: true, key: "pairSpringDamping", label: "Damping c", min: 0, max: 30, step: 0.5 },
      { advanced: true, key: "pairSpringRange", label: "Range", min: 8, max: 200, step: 2 },
    ],
  },
  {
    category: "pairForces",
    id: "nuclear",
    title: "Nuclear",
    formula: "F = k(1 - r/R)",
    description: "Toy short-range attraction between positive and neutral particles.",
    enabledKey: "nuclearEnabled",
    sliders: [
      { key: "nuclearStrength", label: "Strength", min: 0, max: 200, step: 1 },
      { key: "nuclearRange", label: "Range", min: 2, max: 80, step: 1 },
    ],
  },
  {
    category: "constraints",
    id: "shell",
    title: "Shell Constraint",
    formula: "F = -k(r - R)",
    description: "Visual-only shell radius for negative particles.",
    enabledKey: "shellEnabled",
    sliders: [
      { key: "shellConstraintK", label: "Shell k", min: 0, max: 30, step: 0.1 },
      { key: "defaultElectronRadius", label: "Default radius", min: 10, max: 240, step: 5 },
    ],
  },
  {
    category: "constraints",
    id: "fluidDrag",
    title: "Fluid Drag",
    formula: "F = -c1(v-u) - c2|v-u|(v-u)",
    description: "Moving medium with linear and quadratic drag.",
    enabledKey: "fluidDragEnabled",
    sliders: [
      { key: "fluidDragLinear", label: "Linear c1", min: 0, max: 8, step: 0.1 },
      { key: "fluidDragQuadratic", label: "Quadratic c2", min: 0, max: 0.2, step: 0.005 },
      { key: "mediumVelocityX", label: "Wind X", min: -180, max: 180, step: 5 },
      { advanced: true, key: "mediumVelocityY", label: "Wind Y", min: -180, max: 180, step: 5 },
      { advanced: true, key: "mediumVelocityZ", label: "Wind Z", min: -180, max: 180, step: 5 },
    ],
  },
  {
    category: "constraints",
    id: "buoyancy",
    title: "Buoyancy",
    formula: "F = rho V g",
    description: "Toy upward force below the fluid surface.",
    enabledKey: "buoyancyEnabled",
    sliders: [
      { key: "buoyancyDensity", label: "Density", min: 0, max: 4, step: 0.05 },
      { key: "buoyancyStrength", label: "g", min: 0, max: 60, step: 1 },
      { advanced: true, key: "fluidSurfaceY", label: "Surface Y", min: -300, max: 300, step: 5 },
    ],
  },
  {
    category: "contacts",
    id: "collision",
    title: "Collisions",
    formula: "J = -(1 + e)vn / invMass",
    description: "Mass-weighted contact response with restitution.",
    enabledKey: "collisionEnabled",
    sliders: [],
  },
] as const satisfies readonly ForceDefinition[];

export const FORCE_PRESETS = [
  {
    activeForces: [],
    id: "none",
    title: "Free Motion",
    description: "Free particles. Useful baseline.",
    formula: "v = constant",
    settings: {
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: false,
    },
    whatToNotice: "Particles keep moving in straight lines until a wall or impulse changes them.",
  },
  {
    activeForces: ["uniformField"],
    id: "constantAcceleration",
    title: "Constant Acceleration",
    description: "Uniform acceleration bends all paths the same way.",
    formula: "F = m a",
    settings: {
      electrons: 8,
      protons: 8,
      neutrons: 8,
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: true,
      uniformFieldX: 0,
      uniformFieldY: 40,
      uniformFieldZ: 0,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
      showFieldVectors: true,
      showVelocityVectors: true,
    },
    whatToNotice: "Mass cancels because F = ma, so every particle gets the same acceleration.",
  },
  {
    activeForces: ["centerSpring", "drag"],
    id: "spring",
    title: "Damped Spring",
    description: "Center spring plus drag.",
    formula: "F = -k x - c v",
    settings: {
      centerSpringEnabled: true,
      centerSpringStrength: 0.9,
      dragEnabled: true,
      dragStrength: 0.6,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "The spring pulls toward equilibrium. Drag shrinks the oscillation over time.",
  },
  {
    activeForces: ["electricField"],
    id: "electricFieldDeflection",
    title: "Electric Field Deflection",
    description: "Positive and negative particles curve in opposite directions.",
    formula: "F = qE",
    settings: {
      electrons: 14,
      protons: 14,
      neutrons: 0,
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: true,
      electricFieldX: 220,
      electricFieldY: 0,
      electricFieldZ: 0,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: false,
      showFieldVectors: true,
      showTrails: true,
      trailLength: 60,
    },
    whatToNotice: "The sign of q changes force direction; neutral particles would ignore the field.",
  },
  {
    activeForces: ["magneticField"],
    id: "magneticCircularMotion",
    title: "Magnetic Circular Motion",
    description: "Charged particles bend sideways in a magnetic field.",
    formula: "F = q(v x B)",
    settings: {
      electrons: 18,
      protons: 0,
      neutrons: 0,
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: true,
      magneticFieldZ: 45,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: false,
      showVelocityVectors: true,
      showTrails: true,
      trailLength: 90,
    },
    whatToNotice: "Magnetic force stays perpendicular to velocity, bending direction more than speed.",
  },
  {
    activeForces: ["centralGravity"],
    id: "orbitAttempt",
    title: "Orbit Attempt",
    description: "Softened inverse-square attraction around the center.",
    formula: "F = -k m r / (r^2 + e^2)^(3/2)",
    settings: {
      electrons: 0,
      protons: 10,
      neutrons: 0,
      initialLayout: "ringOrbit",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: true,
      centralGravityStrength: 36_000,
      centralGravitySoftening: 45,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: false,
      showTrails: true,
      trailLength: 120,
    },
    whatToNotice: "Initial velocity decides whether particles fall inward, loop, or escape.",
  },
  {
    activeForces: ["pointChargeField"],
    id: "pointChargeField",
    title: "Point Charge Field",
    description: "External center charge bends charged particles.",
    formula: "F = q k Q r / (r^2 + e^2)^(3/2)",
    settings: {
      electrons: 12,
      protons: 12,
      neutrons: 0,
      initialLayout: "beam",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: true,
      pointChargeStrength: 180_000,
      pointChargeAmount: 1,
      pointChargeSoftening: 40,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: false,
      buoyancyEnabled: false,
      collisionEnabled: false,
      probeEnabled: true,
      showFieldVectors: true,
      showPotentialHeatmap: true,
      showTrails: true,
      trailLength: 90,
    },
    whatToNotice: "Changing Q flips which sign is attracted and which sign is repelled.",
  },
  {
    activeForces: ["pairSpring"],
    id: "springChain",
    title: "Spring Chain",
    description: "Nearby particles linked by damped springs.",
    formula: "F = -k(r - L0) - c v_rel",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 14,
      initialLayout: "springLine",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: true,
      pairSpringStrength: 42,
      pairSpringRestLength: 34,
      pairSpringDamping: 7,
      pairSpringRange: 52,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: false,
      buoyancyEnabled: false,
      collisionEnabled: false,
      showGraphs: true,
      showVelocityVectors: true,
      showTrails: true,
      trailLength: 120,
    },
    whatToNotice: "Energy trades between motion and spring stretch while damping removes it.",
  },
  {
    activeForces: ["centralGravity"],
    id: "orbitRing",
    title: "Orbit Ring",
    description: "Particles start in a ring with tangential velocity.",
    formula: "F = -k m r / (r^2 + e^2)^(3/2)",
    settings: {
      electrons: 0,
      protons: 18,
      neutrons: 0,
      initialLayout: "ringOrbit",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: true,
      centralGravityStrength: 50_000,
      centralGravitySoftening: 35,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: false,
      buoyancyEnabled: false,
      collisionEnabled: false,
      showGraphs: true,
      showPotentialHeatmap: true,
      showTrails: true,
      trailLength: 140,
    },
    whatToNotice: "Small speed changes decide between falling inward and escaping outward.",
  },
  {
    activeForces: ["centralGravity"],
    id: "twoBodyAttempt",
    title: "Two-Body Attempt",
    description: "Two particles orbit the same softened center.",
    formula: "F = -k m r / (r^2 + e^2)^(3/2)",
    settings: {
      electrons: 0,
      protons: 2,
      neutrons: 0,
      initialLayout: "twoBody",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: true,
      centralGravityStrength: 46_000,
      centralGravitySoftening: 35,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: false,
      buoyancyEnabled: false,
      collisionEnabled: false,
      showGraphs: true,
      showTrails: true,
      trailLength: 160,
    },
    whatToNotice: "This is a central-force model, not full mutual orbital gravity.",
  },
  {
    activeForces: ["fluidDrag"],
    id: "viscousMedium",
    title: "Viscous Medium",
    description: "Particles slow toward the surrounding medium velocity.",
    formula: "F = -c1(v-u) - c2|v-u|(v-u)",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 28,
      initialLayout: "gasBox",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: true,
      fluidDragLinear: 2.2,
      fluidDragQuadratic: 0.01,
      mediumVelocityX: 0,
      mediumVelocityY: 0,
      mediumVelocityZ: 0,
      buoyancyEnabled: false,
      collisionEnabled: true,
      showGraphs: true,
      showVelocityVectors: true,
    },
    whatToNotice: "Linear drag dominates slow motion; quadratic drag grows quickly at high speed.",
  },
  {
    activeForces: ["fluidDrag"],
    id: "windTunnel",
    title: "Wind Tunnel",
    description: "Moving medium pushes a beam of particles sideways.",
    formula: "F = -c1(v-u) - c2|v-u|(v-u)",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 24,
      initialLayout: "beam",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: true,
      fluidDragLinear: 1,
      fluidDragQuadratic: 0.02,
      mediumVelocityX: 120,
      mediumVelocityY: -20,
      mediumVelocityZ: 0,
      buoyancyEnabled: false,
      collisionEnabled: false,
      showVelocityVectors: true,
      showTrails: true,
      trailLength: 100,
    },
    whatToNotice: "Particles tend toward the medium velocity instead of simply stopping.",
  },
  {
    activeForces: ["uniformField", "buoyancy", "fluidDrag"],
    id: "buoyantRise",
    title: "Buoyant Rise",
    description: "Gravity-like acceleration competes with buoyancy and drag.",
    formula: "F = m a + rho V g - drag",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 20,
      initialLayout: "fallingColumn",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: true,
      uniformFieldX: 0,
      uniformFieldY: 28,
      uniformFieldZ: 0,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: true,
      fluidDragLinear: 1.4,
      fluidDragQuadratic: 0.012,
      mediumVelocityX: 0,
      mediumVelocityY: 0,
      mediumVelocityZ: 0,
      buoyancyEnabled: true,
      buoyancyDensity: 1.2,
      buoyancyStrength: 22,
      fluidSurfaceY: -120,
      collisionEnabled: true,
      showGraphs: true,
      showVelocityVectors: true,
      showTrails: true,
      trailLength: 100,
    },
    whatToNotice: "Below the surface, buoyancy can overcome downward acceleration.",
  },
  {
    activeForces: ["pairSpring"],
    id: "energyExchange",
    title: "Energy Exchange",
    description: "Spring potential and kinetic energy trade back and forth.",
    formula: "E = K + U_spring",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 8,
      initialLayout: "springLine",
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      pointChargeFieldEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      pairSpringEnabled: true,
      pairSpringStrength: 50,
      pairSpringRestLength: 40,
      pairSpringDamping: 0,
      pairSpringRange: 64,
      nuclearEnabled: false,
      shellEnabled: false,
      fluidDragEnabled: false,
      buoyancyEnabled: false,
      collisionEnabled: false,
      showGraphs: true,
      showTrails: true,
      trailLength: 140,
    },
    whatToNotice: "With damping off, total energy stays more stable than either part alone.",
  },
  {
    activeForces: ["charge"],
    id: "chargeDipole",
    title: "Charge Dipole",
    description: "Equal positive and negative counts under charge force.",
    formula: "F = k q1 q2 / (r^2 + e^2)",
    settings: {
      electrons: 14,
      protons: 14,
      neutrons: 0,
      centerSpringEnabled: false,
      dragEnabled: true,
      dragStrength: 0.7,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: true,
      chargeStrength: 9_000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
      showParticleLabels: true,
      showVelocityVectors: true,
    },
    whatToNotice: "Opposite signs pull together while like signs push apart.",
  },
  {
    activeForces: ["charge"],
    id: "chargeAttraction",
    title: "Charge Attraction",
    description: "Opposite charges pull together.",
    formula: "F = k q1 q2 / (r^2 + e^2)",
    settings: {
      electrons: 12,
      protons: 12,
      neutrons: 0,
      centerSpringEnabled: false,
      dragEnabled: true,
      dragStrength: 0.9,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: true,
      chargeStrength: 10_000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "Equal and opposite pair forces conserve total momentum.",
  },
  {
    activeForces: ["charge"],
    id: "chargeRepulsion",
    title: "Charge Repulsion",
    description: "Like charges spread apart.",
    formula: "F = k q1 q2 / (r^2 + e^2)",
    settings: {
      electrons: 24,
      protons: 0,
      neutrons: 0,
      centerSpringEnabled: true,
      centerSpringStrength: 0.25,
      dragEnabled: true,
      dragStrength: 0.7,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: true,
      chargeStrength: 9_000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "Like charges move apart until other constraints or walls redirect them.",
  },
  {
    activeForces: ["gravity"],
    id: "gravityCluster",
    title: "Gravity Cluster",
    description: "Masses gather into a cluster.",
    formula: "F = G m1 m2 / (r^2 + e^2)",
    settings: {
      electrons: 0,
      protons: 18,
      neutrons: 18,
      centerSpringEnabled: false,
      dragEnabled: true,
      dragStrength: 0.25,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: true,
      gravityStrength: 8,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "Pair gravity is always attractive; drag helps the cluster settle.",
  },
  {
    activeForces: ["lennardJones"],
    id: "lennardJonesGas",
    title: "Lennard-Jones Gas",
    description: "Particles settle around preferred spacing.",
    formula: "F = 24e/r (2(s/r)^12 - (s/r)^6)",
    settings: {
      electrons: 0,
      protons: 0,
      neutrons: 36,
      centerSpringEnabled: false,
      dragEnabled: true,
      dragStrength: 0.15,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: true,
      lennardJonesStrength: 3_000,
      lennardJonesRadius: 18,
      lennardJonesRange: 64,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "Repulsion prevents overlap; attraction creates a preferred spacing.",
  },
  {
    activeForces: ["charge", "nuclear"],
    id: "nuclearCore",
    title: "Nuclear Core",
    description: "Short-range attraction competes with charge repulsion.",
    formula: "F_nuclear = k(1 - r/R)",
    settings: {
      electrons: 0,
      protons: 12,
      neutrons: 14,
      centerSpringEnabled: true,
      centerSpringStrength: 0.18,
      dragEnabled: true,
      dragStrength: 0.5,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: true,
      chargeStrength: 6_000,
      nuclearEnabled: true,
      nuclearStrength: 55,
      nuclearRange: 20,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
    },
    whatToNotice: "Nuclear attraction acts only at short range, while charge repulsion reaches farther.",
  },
  {
    activeForces: ["collision"],
    id: "collisionMomentum",
    title: "Collision Momentum",
    description: "Contact impulses exchange momentum.",
    formula: "J = -(1 + e)vn / invMass",
    settings: {
      electrons: 0,
      protons: 10,
      neutrons: 10,
      centerSpringEnabled: false,
      dragEnabled: false,
      uniformFieldEnabled: false,
      electricFieldEnabled: false,
      magneticFieldEnabled: false,
      centralGravityEnabled: false,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
      showVelocityVectors: true,
    },
    whatToNotice: "The lighter-looking motion changes more, but total momentum is approximately conserved.",
  },
  {
    activeForces: [
      "centerSpring",
      "drag",
      "uniformField",
      "electricField",
      "magneticField",
      "centralGravity",
      "pointChargeField",
      "charge",
      "gravity",
      "lennardJones",
      "pairSpring",
      "nuclear",
      "shell",
      "fluidDrag",
      "buoyancy",
      "collision",
    ],
    id: "fullMix",
    title: "Full Mix",
    description: "All visible forces enabled.",
    formula: "Combined toy model",
    settings: {
      electrons: 8,
      protons: 8,
      neutrons: 8,
      centerSpringEnabled: true,
      dragEnabled: true,
      uniformFieldEnabled: true,
      electricFieldEnabled: true,
      magneticFieldEnabled: true,
      centralGravityEnabled: true,
      pointChargeFieldEnabled: true,
      chargeEnabled: true,
      gravityEnabled: true,
      lennardJonesEnabled: true,
      pairSpringEnabled: true,
      nuclearEnabled: true,
      shellEnabled: true,
      fluidDragEnabled: true,
      buoyancyEnabled: true,
      collisionEnabled: true,
    },
    whatToNotice: "Useful stress test, not a clean lesson: many forces compete at once.",
  },
] as const satisfies readonly ForcePreset[];

export function createForceDefaultPatch(
  force: ForceDefinition,
  defaults: SimulationSettings
): Partial<SimulationSettings> {
  const patch: Partial<SimulationSettings> = {
    [force.enabledKey]: defaults[force.enabledKey],
  };

  for (const slider of force.sliders) {
    patch[slider.key] = defaults[slider.key];
  }

  return patch;
}

export function createAllForcesDefaultPatch(
  defaults: SimulationSettings
): Partial<SimulationSettings> {
  return FORCE_DEFINITIONS.reduce<Partial<SimulationSettings>>(
    (patch, force) => ({ ...patch, ...createForceDefaultPatch(force, defaults) }),
    {}
  );
}

export function createAllForcesDisabledPatch(): Partial<SimulationSettings> {
  return FORCE_DEFINITIONS.reduce<Partial<SimulationSettings>>(
    (patch, force) => ({ ...patch, [force.enabledKey]: false }),
    {}
  );
}
