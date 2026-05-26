import type { SimulationSettings } from "@/features/simulation/model/SimulationSettingsContext";
import type { ForceId, ForcePresetId } from "@/features/simulation/model/forceTypes";

export type ForcePreset = {
  activeForces: readonly ForceId[];
  id: ForcePresetId;
  settings: Partial<SimulationSettings>;
};

export const FORCE_PRESETS = [
  {
    activeForces: [],
    id: "none",
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
      collisionEnabled: false
    }
  },
  {
    activeForces: [
      "uniformField"
    ],
    id: "constantAcceleration",
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
      showVelocityVectors: true
    }
  },
  {
    activeForces: [
      "centerSpring",
      "drag"
    ],
    id: "spring",
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
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "electricField"
    ],
    id: "electricFieldDeflection",
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
      trailLength: 60
    }
  },
  {
    activeForces: [
      "magneticField"
    ],
    id: "magneticCircularMotion",
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
      trailLength: 90
    }
  },
  {
    activeForces: [
      "centralGravity"
    ],
    id: "orbitAttempt",
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
      centralGravityStrength: 36000,
      centralGravitySoftening: 45,
      chargeEnabled: false,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: false,
      showTrails: true,
      trailLength: 120
    }
  },
  {
    activeForces: [
      "pointChargeField"
    ],
    id: "pointChargeField",
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
      pointChargeStrength: 180000,
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
      trailLength: 90
    }
  },
  {
    activeForces: [
      "pairSpring"
    ],
    id: "springChain",
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
      trailLength: 120
    }
  },
  {
    activeForces: [
      "centralGravity"
    ],
    id: "orbitRing",
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
      centralGravityStrength: 50000,
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
      trailLength: 140
    }
  },
  {
    activeForces: [
      "centralGravity"
    ],
    id: "twoBodyAttempt",
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
      centralGravityStrength: 46000,
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
      trailLength: 160
    }
  },
  {
    activeForces: [
      "fluidDrag"
    ],
    id: "viscousMedium",
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
      showVelocityVectors: true
    }
  },
  {
    activeForces: [
      "fluidDrag"
    ],
    id: "windTunnel",
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
      trailLength: 100
    }
  },
  {
    activeForces: [
      "uniformField",
      "buoyancy",
      "fluidDrag"
    ],
    id: "buoyantRise",
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
      trailLength: 100
    }
  },
  {
    activeForces: [
      "pairSpring"
    ],
    id: "energyExchange",
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
      trailLength: 140
    }
  },
  {
    activeForces: [
      "charge"
    ],
    id: "chargeDipole",
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
      chargeStrength: 9000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true,
      showParticleLabels: true,
      showVelocityVectors: true
    }
  },
  {
    activeForces: [
      "charge"
    ],
    id: "chargeAttraction",
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
      chargeStrength: 10000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "charge"
    ],
    id: "chargeRepulsion",
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
      chargeStrength: 9000,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "gravity"
    ],
    id: "gravityCluster",
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
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "lennardJones"
    ],
    id: "lennardJonesGas",
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
      lennardJonesStrength: 3000,
      lennardJonesRadius: 18,
      lennardJonesRange: 64,
      nuclearEnabled: false,
      shellEnabled: false,
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "charge",
      "nuclear"
    ],
    id: "nuclearCore",
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
      chargeStrength: 6000,
      nuclearEnabled: true,
      nuclearStrength: 55,
      nuclearRange: 20,
      gravityEnabled: false,
      lennardJonesEnabled: false,
      shellEnabled: false,
      collisionEnabled: true
    }
  },
  {
    activeForces: [
      "collision"
    ],
    id: "collisionMomentum",
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
      showVelocityVectors: true
    }
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
      "collision"
    ],
    id: "fullMix",
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
      collisionEnabled: true
    }
  }
] as const satisfies readonly ForcePreset[];
