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
        center: "Force Center",
        camera: "Camera",
        particles: "Particles",
        physics: "Forces",
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
        x: "X",
        y: "Y",
        z: "Z",
        attraction: "Attraction",
        electrons: "Negative",
        protons: "Positive",
        neutrons: "Neutral",
      },
    },
  },
} as const;
