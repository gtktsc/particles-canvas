# 🌀 Particle Simulation App (Canvas, CPU-only)

A real-time 3D atomic particle simulation rendered with the HTML Canvas API and powered by a modular CPU-based physics engine. This educational demo visualizes subatomic interactions such as collisions, electrostatic forces, orbital shells, and nuclear attraction — all computed in JavaScript with adjustable parameters.

## 🌟 Features

- 🎨 Canvas-based 2D rendering of a simulated 3D particle system with perspective projection
- 🧠 Fully CPU-based physics simulation — no GPU/WebGPU acceleration
- ⚛️ Simulation of electrons, protons, and neutrons, each with realistic mass, charge, and radius
- 💥 Collision detection and elastic response using spatial grid partitioning
- ⚡ Electrostatic attraction/repulsion based on particle charges
- 🧲 Strong nuclear force between protons and neutrons within a configurable range
- 🌀 Electron shell constraint system to simulate atomic orbital stability
- 🖱 Interactive mouse dragging to apply external forces
- 🎛 UI controls for adjusting particle types, counts, world size, FOV, damping, and more
- 📈 FPS counter with dynamic performance feedback
- 🧩 Clean, modular codebase using React, TypeScript, and custom physics/vector classes

## 🧠 Physics Simulation Overview

The `Physics` engine applies several key interaction models:

### ✅ Collision Detection

- Spatial hashing partitions particles into 3D grid cells for efficient lookup
- Neighboring cells are checked for overlapping particles
- Collisions apply position correction and velocity reflection for elastic response

### ✅ Electrostatic Charge Forces

- Oppositely charged particles attract; like charges repel
- Force magnitude scales with inverse square of distance
- Only charged particles (electrons, protons) participate

### ✅ Electron Shell Constraints

- Electrons are pulled toward stable orbital radii from the center
- A spring-like force (`F = k * offset`) maintains approximate shell distance

### ✅ Strong Nuclear Force

- Applies short-range attraction between neutrons and protons
- Scales linearly with proximity inside a nuclear force radius

---

## 🧱 Tech Stack

- React 18 with Next.js App Router
- TypeScript
- HTML Canvas 2D API
- Modular custom classes (`Vector3`, `Particle`, `Physics`, `World`)
- Context-based global simulation settings

---

## 🛠 Getting Started

```bash
# Install dependencies
npm install
```

### Start development server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## 🎮 Controls

Use the right sidebar to modify:

Particle counts (electrons, protons, neutrons)

World dimensions and zoom

Center attraction, damping, nuclear and charge strength

FOV and camera position

Click and drag on the canvas to apply a directional force to nearby particles

Watch the FPS counter (top-right) for performance feedback

### 🧩 Architecture Notes

useCanvas() connects the render loop to the canvas and coordinates the physics engine

useSimulationSettings() manages all dynamic simulation values via React context

Physics logic resides in the Physics class (spatial indexing, force resolution)

Each Particle is rendered in 3D space and projected into 2D using a simple perspective transform

This project is intended for educational and experimental purposes. No external physics libraries or WebGL/WebGPU are used — everything is computed and rendered with native browser APIs.
