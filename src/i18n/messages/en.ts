export const enMessages = {
  app: {
    title: "Canvas Particles",
  },
  simulation: {
    canvas: {
      label: "Particle simulation canvas",
    },
    controls: {
      sections: {
        world: "World",
        center: "Center",
        camera: "Camera",
        particles: "Particles",
        physics: "Physics",
      },
      actions: {
        resetWorld: "Reset World",
        resetCenter: "Reset Center",
        resetCamera: "Reset Camera",
        resetParticles: "Reset Particles",
        resetPhysics: "Reset Physics",
      },
      fields: {
        width: "Width",
        height: "Height",
        depth: "Depth",
        fov: "FOV",
        zoom: "Zoom",
        attraction: "Attraction",
        x: "X",
        y: "Y",
        z: "Z",
        damping: "Damping",
        chargeStrength: "Charge Strength",
        gravityStrength: "Gravity Strength",
        gravityRange: "Gravity Range",
        lennardJonesStrength: "Lennard-Jones Strength",
        lennardJonesRadius: "Lennard-Jones Radius",
        electrons: "Electrons",
        protons: "Protons",
        neutrons: "Neutrons",
      },
    },
  },
} as const;
