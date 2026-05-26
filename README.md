# Intro University Forces Lab

CPU Canvas 3D particle sandbox for teaching force laws by direct manipulation. It keeps the scene visual and interactive: enable one force, change constants, step time, and watch particles respond.

Not a real atomic, molecular, orbital, or SI-unit simulator. Units are toy units. Accuracy goal: stable, honest, teachable behavior.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Vitest
- ESLint flat config
- Canvas 2D API

## Run

```bash
npm install
npm run dev
npm run check
```

Open `http://localhost:3000`.

## Architecture

- `src/features/simulation/model`: settings, constants, force metadata, particles, physics, presets, stats.
- `src/features/simulation/renderer`: projection, world frame, grid, axes, particles, vectors, FPS.
- `src/features/simulation/components`: control panel, force cards, stats, sliders, canvas host.
- `src/features/simulation/hooks`: animation loop, refs, mouse events, initialization.

## Physics Model

Fixed-step semi-implicit Euler:

```text
dt = 1 / 60
a = sum(F) / m
v = clamp(v + a dt)
x = x + v dt
```

Per step:

1. Clear accelerations.
2. Index particles in a spatial grid.
3. Apply enabled field forces.
4. Apply enabled pair forces.
5. Apply constraints.
6. Clamp acceleration and speed.
7. Integrate particles.
8. Resolve boundaries.
9. Re-index.
10. Resolve enabled collisions.

Large frame gaps are capped so a paused tab does not explode the simulation.

## Force Equations

| Force | Equation | Lesson |
| --- | --- | --- |
| Uniform acceleration | `F = m a` | Same acceleration for every mass. |
| Electric field | `F = qE` | Positive and negative particles accelerate opposite ways. |
| Magnetic field | `F = q(v x B)` | Force is perpendicular to velocity. |
| Central inverse-square | `F = -k m r / (r^2 + e^2)^(3/2)` | Softened orbit-like attraction to the center. |
| Point charge field | `F = q k Q r / (r^2 + e^2)^(3/2)` | External center charge attracts or repels by sign. |
| Center spring | `F = -k x` | Restoring force grows with displacement. |
| Drag | `F = -c v` | Force opposes motion and removes energy. |
| Charge pair | `F = k q1 q2 / (r^2 + e^2)` | Likes repel, opposites attract. |
| Local gravity pair | `F = G m1 m2 / (r^2 + e^2)` | Masses attract inside a cutoff range. |
| Lennard-Jones | `F = 24e/r (2(s/r)^12 - (s/r)^6)` | Short-range repulsion, medium-range attraction. |
| Pair spring | `F = -k(r - L0) - c v_rel` | Nearby particles form damped Hooke springs. |
| Nuclear toy force | `F = k(1 - r/R)` | Short-range attraction between positive and neutral particles. |
| Shell constraint | `F = -k(r - R)` | Visual radial constraint, not quantum mechanics. |
| Fluid drag | `F = -c1(v-u) - c2|v-u|(v-u)` | Particles move toward medium velocity. |
| Buoyancy | `F = rho V g` | Toy upward force below a fluid surface. |
| Collision | `J = -(1 + e)vn / invMass` | Contact impulse with restitution. |

`e` means softening. It prevents infinite forces at zero distance.

## Controls Map

- Top controls: pause/resume, single-step, reset simulation, reset forces.
- View controls: Front, Top, Side, Iso, Reset View.
- Visualization toggles: axes, grid, field vectors, potential heatmap, velocity vectors, force vectors, labels, trails, depth shading.
- Measurement toggles: live graphs and probe mode.
- Initial layout: random, beam, orbit ring, two body, spring line, gas box, falling column.
- World controls: box width, height, depth, FOV, zoom.
- Force center controls: center point for spring and central gravity.
- Particle controls: negative, positive, neutral counts.
- Force cards: enable toggle, formula, classroom note, primary sliders, advanced constants, reset-one-force.

## Measurements

- Graphs show total energy, average speed, momentum, and angular momentum history.
- Probe mode lets the next canvas click place a probe point.
- Probe readout shows position, sampled acceleration, and potential estimate for the selected test particle type.
- Potential heatmap samples position-only forces: center spring, central inverse-square, and point charge field.
- Potential energy estimates include spring, central gravity, point charge field, Lennard-Jones, and pair spring terms.

Potential is an estimate for classroom comparison. It is not valid for velocity-dependent forces like drag or magnetic force, and total energy changes when damping, drag, collisions, clamps, or boundaries act.

## Visualization Legend

- Red particles: positive charge.
- Blue particles: negative charge.
- White particles: neutral.
- Red axis: X.
- Green axis: Y.
- Blue axis: Z.
- Cyan arrows: sampled position-field acceleration for a positive test particle.
- Yellow arrows: velocity vectors.
- Cyan particle arrows: last acceleration vectors.
- Orange heatmap: positive potential.
- Blue heatmap: negative potential.
- Yellow halo: recent collision.
- Trails: finite history buffer, not canvas smearing.

## Examples

- Free Motion: no forces. Notice constant velocity until wall or impulse.
- Constant Acceleration: uniform field. Notice all masses accelerate equally.
- Electric Field Deflection: electric field only. Notice charge sign controls direction.
- Magnetic Circular Motion: magnetic field only. Notice sideways force bends paths.
- Orbit Attempt: central inverse-square. Notice speed decides fall, loop, or escape.
- Point Charge Field: external center charge. Notice sign-dependent attraction and repulsion.
- Spring Chain: damped pair springs. Notice wave-like energy transfer.
- Orbit Ring: central force ring. Notice speed and softening effects.
- Two-Body Attempt: two particles in a central field. Notice this is not mutual gravity.
- Viscous Medium: drag toward still fluid. Notice speed decay.
- Wind Tunnel: drag toward moving medium. Notice particles approach wind velocity.
- Buoyant Rise: downward acceleration competes with buoyancy. Notice surface threshold.
- Energy Exchange: spring potential trades with kinetic energy. Notice graph behavior.
- Charge Dipole: equal positive and negative counts. Notice opposite signs pull together.
- Charge Attraction: opposite charges. Notice equal and opposite pair forces.
- Charge Repulsion: like charges. Notice spreading against walls or constraints.
- Lennard-Jones Gas: preferred spacing. Notice repulsion at close range, attraction farther out.
- Damped Spring: center spring plus drag. Notice oscillation decay.
- Collision Momentum: collisions only. Notice momentum exchange through impulses.
- Nuclear Core: short-range attraction plus charge repulsion. Notice competing ranges.
- Full Mix: stress test. Good for discussion, poor for isolating one concept.

## Numerical Stability

- Softening avoids singular inverse-square forces.
- Cutoff ranges keep pair forces fast on CPU.
- Acceleration and velocity clamps prevent invalid values.
- Restitution keeps wall and particle bounces bounded.
- Drag removes energy when a preset needs settling.
- Fixed timestep keeps motion more consistent across frame rates.
- History buffers are capped to keep graphs cheap.

Trade-off: these safeguards change exact energy and momentum. That is acceptable here because the lab is for force intuition, not measurement.

## Known Limits

- Toy units only.
- No SI calibration.
- No quantum orbitals, spin, radiation, decay, thermodynamics, or molecular chemistry.
- Canvas 2D projection, not a full 3D camera engine.
- Pair forces are spatial-grid accelerated and range-limited.
- Energy is not conserved when drag, clamps, softening, boundaries, or restitution act.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

Keep force changes covered by tests near `model`. Keep visual projection changes covered near `renderer`.
