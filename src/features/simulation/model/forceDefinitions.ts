import type { ForceDefinition } from "@/features/simulation/model/forceTypes";

export type {
  ForceCategory,
  ForceDefinition,
  ForceEnabledKey,
  ForceId,
  ForcePresetId,
  ForceScalarSettingKey,
  ForceSlider,
} from "@/features/simulation/model/forceTypes";

export const FORCE_DEFINITIONS = [
  {
    category: "constraints",
    id: "centerSpring",
    enabledKey: "centerSpringEnabled",
    sliders: [
      {
        key: "centerSpringStrength",
        min: 0,
        max: 4,
        step: 0.01
      }
    ]
  },
  {
    category: "fields",
    id: "uniformField",
    enabledKey: "uniformFieldEnabled",
    sliders: [
      {
        key: "uniformFieldX",
        min: -80,
        max: 80,
        step: 1
      },
      {
        key: "uniformFieldY",
        min: -80,
        max: 80,
        step: 1
      },
      {
        key: "uniformFieldZ",
        min: -80,
        max: 80,
        step: 1
      }
    ]
  },
  {
    category: "fields",
    id: "electricField",
    enabledKey: "electricFieldEnabled",
    sliders: [
      {
        key: "electricFieldX",
        min: -500,
        max: 500,
        step: 10
      },
      {
        key: "electricFieldY",
        min: -500,
        max: 500,
        step: 10
      },
      {
        key: "electricFieldZ",
        min: -500,
        max: 500,
        step: 10
      }
    ]
  },
  {
    category: "fields",
    id: "magneticField",
    enabledKey: "magneticFieldEnabled",
    sliders: [
      {
        key: "magneticFieldZ",
        min: -80,
        max: 80,
        step: 1
      }
    ]
  },
  {
    category: "fields",
    id: "centralGravity",
    enabledKey: "centralGravityEnabled",
    sliders: [
      {
        key: "centralGravityStrength",
        min: 0,
        max: 80000,
        step: 500
      },
      {
        key: "centralGravitySoftening",
        min: 1,
        max: 120,
        step: 1
      }
    ]
  },
  {
    category: "fields",
    id: "pointChargeField",
    enabledKey: "pointChargeFieldEnabled",
    sliders: [
      {
        key: "pointChargeStrength",
        min: 0,
        max: 500000,
        step: 5000
      },
      {
        key: "pointChargeAmount",
        min: -5,
        max: 5,
        step: 0.1
      },
      {
        key: "pointChargeSoftening",
        min: 1,
        max: 140,
        step: 1,
        advanced: true
      }
    ]
  },
  {
    category: "constraints",
    id: "drag",
    enabledKey: "dragEnabled",
    sliders: [
      {
        key: "dragStrength",
        min: 0,
        max: 8,
        step: 0.01
      }
    ]
  },
  {
    category: "pairForces",
    id: "charge",
    enabledKey: "chargeEnabled",
    sliders: [
      {
        key: "chargeStrength",
        min: 0,
        max: 20000,
        step: 100
      },
      {
        key: "chargeSoftening",
        min: 1,
        max: 80,
        step: 1
      },
      {
        key: "chargeRange",
        min: 20,
        max: 600,
        step: 5
      }
    ]
  },
  {
    category: "pairForces",
    id: "gravity",
    enabledKey: "gravityEnabled",
    sliders: [
      {
        key: "gravityStrength",
        min: 0,
        max: 20,
        step: 0.1
      },
      {
        key: "gravitySoftening",
        min: 1,
        max: 100,
        step: 1
      },
      {
        key: "gravityRange",
        min: 20,
        max: 600,
        step: 5
      }
    ]
  },
  {
    category: "pairForces",
    id: "lennardJones",
    enabledKey: "lennardJonesEnabled",
    sliders: [
      {
        key: "lennardJonesStrength",
        min: 0,
        max: 6000,
        step: 50
      },
      {
        key: "lennardJonesRadius",
        min: 2,
        max: 80,
        step: 1
      },
      {
        key: "lennardJonesRange",
        min: 10,
        max: 240,
        step: 2
      }
    ]
  },
  {
    category: "pairForces",
    id: "pairSpring",
    enabledKey: "pairSpringEnabled",
    sliders: [
      {
        key: "pairSpringStrength",
        min: 0,
        max: 160,
        step: 1
      },
      {
        key: "pairSpringRestLength",
        min: 4,
        max: 140,
        step: 1
      },
      {
        key: "pairSpringDamping",
        min: 0,
        max: 30,
        step: 0.5,
        advanced: true
      },
      {
        key: "pairSpringRange",
        min: 8,
        max: 200,
        step: 2,
        advanced: true
      }
    ]
  },
  {
    category: "pairForces",
    id: "nuclear",
    enabledKey: "nuclearEnabled",
    sliders: [
      {
        key: "nuclearStrength",
        min: 0,
        max: 200,
        step: 1
      },
      {
        key: "nuclearRange",
        min: 2,
        max: 80,
        step: 1
      }
    ]
  },
  {
    category: "constraints",
    id: "shell",
    enabledKey: "shellEnabled",
    sliders: [
      {
        key: "shellConstraintK",
        min: 0,
        max: 30,
        step: 0.1
      },
      {
        key: "defaultElectronRadius",
        min: 10,
        max: 240,
        step: 5
      }
    ]
  },
  {
    category: "constraints",
    id: "fluidDrag",
    enabledKey: "fluidDragEnabled",
    sliders: [
      {
        key: "fluidDragLinear",
        min: 0,
        max: 8,
        step: 0.1
      },
      {
        key: "fluidDragQuadratic",
        min: 0,
        max: 0.2,
        step: 0.005
      },
      {
        key: "mediumVelocityX",
        min: -180,
        max: 180,
        step: 5
      },
      {
        key: "mediumVelocityY",
        min: -180,
        max: 180,
        step: 5,
        advanced: true
      },
      {
        key: "mediumVelocityZ",
        min: -180,
        max: 180,
        step: 5,
        advanced: true
      }
    ]
  },
  {
    category: "constraints",
    id: "buoyancy",
    enabledKey: "buoyancyEnabled",
    sliders: [
      {
        key: "buoyancyDensity",
        min: 0,
        max: 4,
        step: 0.05
      },
      {
        key: "buoyancyStrength",
        min: 0,
        max: 60,
        step: 1
      },
      {
        key: "fluidSurfaceY",
        min: -300,
        max: 300,
        step: 5,
        advanced: true
      }
    ]
  },
  {
    category: "contacts",
    id: "collision",
    enabledKey: "collisionEnabled",
    sliders: []
  }
] as const satisfies readonly ForceDefinition[];
