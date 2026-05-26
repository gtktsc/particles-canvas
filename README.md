# Particle Simulation App

CPU-only 3D particle simulation rendered with the HTML Canvas API.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Vitest
- ESLint flat config
- Native Canvas 2D API

## Scripts

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run check
```

Open `http://localhost:3000`.

## Architecture

- `src/app` owns routes, metadata, global CSS, and provider composition.
- `src/features/simulation` owns the simulation feature.
- `components` contains feature UI only: control panel and canvas host.
- `screens` contains the feature screen composed by the route.
- `hooks` owns browser lifecycle, event listeners, refs, and animation loop wiring.
- `model` owns settings, particles, vectors, physics, world, mouse interaction, and frame-step logic.
- `renderer` owns canvas draw helpers, FPS rendering, particle sorting, and draw grouping.
- `src/theme` owns typed tokens, theme creation, provider, and CSS variable generation.
- `src/i18n` owns typed English messages and message utility tests.
- `src/lib` owns app metadata and site constants.

## Physics Model

This is a CPU Canvas 3D toy simulation, not a real atomic simulator. It uses screen/world units, relative masses, and tuned constants. It does not model quantum orbitals, real SI units, radiation, spin, decay, or exact energy conservation.

Physics runs on a fixed 60 Hz step. Each step clears acceleration, applies forces, integrates velocity/position, resolves boundaries, re-indexes the spatial grid, then resolves collisions.

Force model:

- Center attraction: mass-scaled pull toward the configured center, proportional to `strength / distance`.
- Charge: softened Coulomb-like attraction/repulsion, `strength * q1 * q2 / (distance^2 + 1)`, with a short cutoff for CPU cost and stability.
- Electron shell: spring constraint toward each electron shell radius. This is a visual shell, not a quantum orbital.
- Strong nuclear: short-range nucleon attraction. Hard-core separation comes from collision resolution.
- Local gravity: softened Newton-like attraction within `gravityRange`, scaled for proton/neutron masses.
- Lennard-Jones: local 12-6 repulsion/attraction using `lennardJonesRadius` as the zero-crossing distance.
- Collisions: mass-weighted positional correction plus impulse response with restitution. Lighter particles move more than heavy particles.
- Boundaries: clamped box collision with restitution, so wall hits lose some energy.

## Controls

The control panel adjusts world size, camera, center attraction, particle counts, and physics settings. Physics controls include damping, charge strength, gravity strength/range, and Lennard-Jones strength/radius. Mouse drag applies impulse to nearby particles. Arrow keys move the selection volume on the z-axis. `W` and `S` resize the selection volume.

## Quality Gates

`npm run check` runs lint, tests, and production build. Keep behavior changes covered by focused tests near the code they protect.
