export const simulationForceLabMessages = {
  title: "Forces Lab",
  subtitle: "Toy units. Real force patterns.",
  actions: {
    pause: "Pause",
    resume: "Resume",
    step: "Step",
    resetSimulation: "Reset Simulation",
    resetForces: "Reset Forces",
    resetView: "Reset View"
  },
  aria: {
    viewControls: "View controls",
    currentExample: "Current example",
    examples: "Examples",
    forces: "Forces"
  },
  viewModes: {
    front: "Front",
    top: "Top",
    side: "Side",
    iso: "Iso"
  },
  overlays: {
    showAxes: "Axes",
    showGrid: "Grid",
    showFieldVectors: "Field",
    showPotentialHeatmap: "Potential",
    showVelocityVectors: "Velocity",
    showForceVectors: "Force",
    showParticleLabels: "Labels",
    showTrails: "Trails",
    showDepthShading: "Depth",
    showGraphs: "Graphs",
    probeEnabled: "Probe"
  },
  selects: {
    initialLayout: "Initial layout",
    probeType: "Probe type"
  },
  initialLayouts: {
    random: "Random",
    beam: "Beam",
    ringOrbit: "Orbit Ring",
    twoBody: "Two Body",
    springLine: "Spring Line",
    gasBox: "Gas Box",
    fallingColumn: "Falling Column"
  },
  probeTypes: {
    proton: "Positive",
    electron: "Negative",
    neutron: "Neutral"
  },
  fields: {
    trailLength: "Trail length"
  },
  stats: {
    particles: "Particles",
    forces: "Forces",
    fps: "FPS",
    averageSpeed: "Avg speed",
    kinetic: "Kinetic",
    totalEnergy: "Total E",
    momentum: "Momentum"
  },
  measurements: {
    ariaLabel: "Measurements",
    title: "Measurements",
    graphLabel: "Live measurement graphs",
    potential: "Potential",
    totalEnergy: "Total E",
    momentum: "Momentum",
    angularMomentum: "Angular L",
    probePoint: "Probe xyz",
    probeAcceleration: "Probe a",
    probePotential: "Probe U",
    series: {
      totalEnergy: "E",
      averageSpeed: "v",
      momentum: "p",
      angularMomentum: "L"
    }
  },
  currentExample: {
    active: "Active",
    try: "Try",
    none: "None",
    fallbackSliders: "Initial velocity, particle count"
  },
  forceGroups: {
    fields: "Fields",
    pairForces: "Pair Forces",
    constraints: "Constraints",
    contacts: "Contacts"
  },
  forceCard: {
    reset: "Reset",
    advanced: "Advanced"
  },
  forces: {
    centerSpring: {
      title: "Center Spring",
      formula: "F = -k x",
      description: "Pulls particles back toward the selected center point."
    },
    uniformField: {
      title: "Uniform Acceleration",
      formula: "F = m a",
      description: "Applies the same acceleration to every particle."
    },
    electricField: {
      title: "Electric Field",
      formula: "F = qE",
      description: "Positive and negative particles accelerate in opposite directions."
    },
    magneticField: {
      title: "Magnetic Field",
      formula: "F = q(v x B)",
      description: "A velocity-dependent sideways force that bends charged paths."
    },
    centralGravity: {
      title: "Central Inverse-Square",
      formula: "F = -k m r / (r^2 + e^2)^(3/2)",
      description: "Attracts particles toward the center like a softened orbital force."
    },
    pointChargeField: {
      title: "Point Charge Field",
      formula: "F = q k Q r / (r^2 + e^2)^(3/2)",
      description: "External point charge at the force center."
    },
    drag: {
      title: "Drag",
      formula: "F = -c v",
      description: "Removes energy by pushing opposite to velocity."
    },
    charge: {
      title: "Charge",
      formula: "F = k q1 q2 / (r^2 + e^2)",
      description: "Like charges repel. Opposite charges attract."
    },
    gravity: {
      title: "Gravity",
      formula: "F = G m1 m2 / (r^2 + e^2)",
      description: "Masses attract each other inside a local range."
    },
    lennardJones: {
      title: "Lennard-Jones",
      formula: "F = 24e/r (2(s/r)^12 - (s/r)^6)",
      description: "Short-range repulsion and medium-range attraction."
    },
    pairSpring: {
      title: "Pair Spring",
      formula: "F = -k(r - L0) - c v_rel",
      description: "Connects nearby particles with damped Hooke springs."
    },
    nuclear: {
      title: "Nuclear",
      formula: "F = k(1 - r/R)",
      description: "Toy short-range attraction between positive and neutral particles."
    },
    shell: {
      title: "Shell Constraint",
      formula: "F = -k(r - R)",
      description: "Visual-only shell radius for negative particles."
    },
    fluidDrag: {
      title: "Fluid Drag",
      formula: "F = -c1(v-u) - c2|v-u|(v-u)",
      description: "Moving medium with linear and quadratic drag."
    },
    buoyancy: {
      title: "Buoyancy",
      formula: "F = rho V g",
      description: "Toy upward force below the fluid surface."
    },
    collision: {
      title: "Collisions",
      formula: "J = -(1 + e)vn / invMass",
      description: "Mass-weighted contact response with restitution."
    }
  },
  sliderLabels: {
    centerSpringStrength: "Spring k",
    uniformFieldX: "ax",
    uniformFieldY: "ay",
    uniformFieldZ: "az",
    electricFieldX: "Ex",
    electricFieldY: "Ey",
    electricFieldZ: "Ez",
    magneticFieldZ: "Bz",
    centralGravityStrength: "k",
    centralGravitySoftening: "Softening",
    pointChargeStrength: "k",
    pointChargeAmount: "Q",
    pointChargeSoftening: "Softening",
    dragStrength: "Drag c",
    chargeStrength: "Strength",
    chargeSoftening: "Softening",
    chargeRange: "Range",
    gravityStrength: "G",
    gravitySoftening: "Softening",
    gravityRange: "Range",
    lennardJonesStrength: "Epsilon",
    lennardJonesRadius: "Sigma",
    lennardJonesRange: "Range",
    pairSpringStrength: "Spring k",
    pairSpringRestLength: "Rest length",
    pairSpringDamping: "Damping c",
    pairSpringRange: "Range",
    nuclearStrength: "Strength",
    nuclearRange: "Range",
    shellConstraintK: "Shell k",
    defaultElectronRadius: "Default radius",
    fluidDragLinear: "Linear c1",
    fluidDragQuadratic: "Quadratic c2",
    mediumVelocityX: "Wind X",
    mediumVelocityY: "Wind Y",
    mediumVelocityZ: "Wind Z",
    buoyancyDensity: "Density",
    buoyancyStrength: "g",
    fluidSurfaceY: "Surface Y"
  },
  examples: {
    none: {
      title: "Free Motion",
      description: "Free particles. Useful baseline.",
      formula: "v = constant",
      whatToNotice: "Particles keep moving in straight lines until a wall or impulse changes them."
    },
    constantAcceleration: {
      title: "Constant Acceleration",
      description: "Uniform acceleration bends all paths the same way.",
      formula: "F = m a",
      whatToNotice: "Mass cancels because F = ma, so every particle gets the same acceleration."
    },
    spring: {
      title: "Damped Spring",
      description: "Center spring plus drag.",
      formula: "F = -k x - c v",
      whatToNotice: "The spring pulls toward equilibrium. Drag shrinks the oscillation over time."
    },
    electricFieldDeflection: {
      title: "Electric Field Deflection",
      description: "Positive and negative particles curve in opposite directions.",
      formula: "F = qE",
      whatToNotice: "The sign of q changes force direction; neutral particles would ignore the field."
    },
    magneticCircularMotion: {
      title: "Magnetic Circular Motion",
      description: "Charged particles bend sideways in a magnetic field.",
      formula: "F = q(v x B)",
      whatToNotice: "Magnetic force stays perpendicular to velocity, bending direction more than speed."
    },
    orbitAttempt: {
      title: "Orbit Attempt",
      description: "Softened inverse-square attraction around the center.",
      formula: "F = -k m r / (r^2 + e^2)^(3/2)",
      whatToNotice: "Initial velocity decides whether particles fall inward, loop, or escape."
    },
    pointChargeField: {
      title: "Point Charge Field",
      description: "External center charge bends charged particles.",
      formula: "F = q k Q r / (r^2 + e^2)^(3/2)",
      whatToNotice: "Changing Q flips which sign is attracted and which sign is repelled."
    },
    springChain: {
      title: "Spring Chain",
      description: "Nearby particles linked by damped springs.",
      formula: "F = -k(r - L0) - c v_rel",
      whatToNotice: "Energy trades between motion and spring stretch while damping removes it."
    },
    orbitRing: {
      title: "Orbit Ring",
      description: "Particles start in a ring with tangential velocity.",
      formula: "F = -k m r / (r^2 + e^2)^(3/2)",
      whatToNotice: "Small speed changes decide between falling inward and escaping outward."
    },
    twoBodyAttempt: {
      title: "Two-Body Attempt",
      description: "Two particles orbit the same softened center.",
      formula: "F = -k m r / (r^2 + e^2)^(3/2)",
      whatToNotice: "This is a central-force model, not full mutual orbital gravity."
    },
    viscousMedium: {
      title: "Viscous Medium",
      description: "Particles slow toward the surrounding medium velocity.",
      formula: "F = -c1(v-u) - c2|v-u|(v-u)",
      whatToNotice: "Linear drag dominates slow motion; quadratic drag grows quickly at high speed."
    },
    windTunnel: {
      title: "Wind Tunnel",
      description: "Moving medium pushes a beam of particles sideways.",
      formula: "F = -c1(v-u) - c2|v-u|(v-u)",
      whatToNotice: "Particles tend toward the medium velocity instead of simply stopping."
    },
    buoyantRise: {
      title: "Buoyant Rise",
      description: "Gravity-like acceleration competes with buoyancy and drag.",
      formula: "F = m a + rho V g - drag",
      whatToNotice: "Below the surface, buoyancy can overcome downward acceleration."
    },
    energyExchange: {
      title: "Energy Exchange",
      description: "Spring potential and kinetic energy trade back and forth.",
      formula: "E = K + U_spring",
      whatToNotice: "With damping off, total energy stays more stable than either part alone."
    },
    chargeDipole: {
      title: "Charge Dipole",
      description: "Equal positive and negative counts under charge force.",
      formula: "F = k q1 q2 / (r^2 + e^2)",
      whatToNotice: "Opposite signs pull together while like signs push apart."
    },
    chargeAttraction: {
      title: "Charge Attraction",
      description: "Opposite charges pull together.",
      formula: "F = k q1 q2 / (r^2 + e^2)",
      whatToNotice: "Equal and opposite pair forces conserve total momentum."
    },
    chargeRepulsion: {
      title: "Charge Repulsion",
      description: "Like charges spread apart.",
      formula: "F = k q1 q2 / (r^2 + e^2)",
      whatToNotice: "Like charges move apart until other constraints or walls redirect them."
    },
    gravityCluster: {
      title: "Gravity Cluster",
      description: "Masses gather into a cluster.",
      formula: "F = G m1 m2 / (r^2 + e^2)",
      whatToNotice: "Pair gravity is always attractive; drag helps the cluster settle."
    },
    lennardJonesGas: {
      title: "Lennard-Jones Gas",
      description: "Particles settle around preferred spacing.",
      formula: "F = 24e/r (2(s/r)^12 - (s/r)^6)",
      whatToNotice: "Repulsion prevents overlap; attraction creates a preferred spacing."
    },
    nuclearCore: {
      title: "Nuclear Core",
      description: "Short-range attraction competes with charge repulsion.",
      formula: "F_nuclear = k(1 - r/R)",
      whatToNotice: "Nuclear attraction acts only at short range, while charge repulsion reaches farther."
    },
    collisionMomentum: {
      title: "Collision Momentum",
      description: "Contact impulses exchange momentum.",
      formula: "J = -(1 + e)vn / invMass",
      whatToNotice: "The lighter-looking motion changes more, but total momentum is approximately conserved."
    },
    fullMix: {
      title: "Full Mix",
      description: "All visible forces enabled.",
      formula: "Combined toy model",
      whatToNotice: "Useful stress test, not a clean lesson: many forces compete at once."
    }
  }
} as const;
