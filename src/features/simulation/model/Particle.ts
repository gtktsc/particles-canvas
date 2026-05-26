import {
  getInitialPosition,
  getInitialVelocity,
  getShellIndex,
} from "@/features/simulation/model/defaults";
import {
  BOUNDARY_RESTITUTION,
  MAX_ACCELERATION,
  MAX_SPEED,
} from "@/features/simulation/model/physicsConstants";
import { Vector3 } from "@/features/simulation/model/Vector3";
import { baseTheme } from "@/theme/theme";

let particleIdCounter = 0;
export type Charge = -1 | 0 | 1;
export type ParticleType = "proton" | "neutron" | "electron";

export class Particle {
  type: ParticleType;

  _id: number;
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
  lastAcceleration: Vector3;
  radius: number;
  charge: Charge;
  mass: number;
  shellRadius?: number;

  collided = false;

  constructor(
    worldWidth: number,
    worldHeight: number,
    worldZ: number,
    type: ParticleType,
    shellIndex: number | undefined = undefined
  ) {
    this.type = type;
    this._id = particleIdCounter++;

    switch (type) {
      case "electron":
        this.charge = -1;
        this.radius = 1;
        this.mass = 1;

        if (shellIndex === undefined) {
          shellIndex = getShellIndex(this._id);
        }

        this.shellRadius = 50 + shellIndex * 30;

        break;
      case "proton":
        this.charge = 1;
        this.radius = 3;
        this.mass = 1836;
        break;
      case "neutron":
        this.charge = 0;
        this.radius = 3;
        this.mass = 1839;
        break;
    }

    const { x, y, z } = getInitialPosition(worldWidth, worldHeight, worldZ);
    this.position = new Vector3(x, y, z);

    const { x: vx, y: vy, z: vz } = getInitialVelocity();
    this.velocity = new Vector3(vx, vy, vz);
    this.acceleration = new Vector3();
    this.lastAcceleration = new Vector3();
  }

  applyForce(force: Vector3) {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
    this.acceleration.z += force.z / this.mass;
  }

  applyImpulse(impulse: Vector3) {
    this.velocity.x += impulse.x / this.mass;
    this.velocity.y += impulse.y / this.mass;
    this.velocity.z += impulse.z / this.mass;
  }

  clearAcceleration() {
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.acceleration.z = 0;
  }

  integrate(
    dtSeconds: number,
    bounds: { width: number; height: number; depth: number },
  ) {
    this.acceleration.clampLength(MAX_ACCELERATION);
    this.lastAcceleration.copyFrom(this.acceleration);

    this.velocity.x += this.acceleration.x * dtSeconds;
    this.velocity.y += this.acceleration.y * dtSeconds;
    this.velocity.z += this.acceleration.z * dtSeconds;
    this.velocity.clampLength(MAX_SPEED);

    this.position.x += this.velocity.x * dtSeconds;
    this.position.y += this.velocity.y * dtSeconds;
    this.position.z += this.velocity.z * dtSeconds;

    const halfX = bounds.width / 2;
    const halfY = bounds.height / 2;
    const halfZ = bounds.depth / 2;

    if (this.position.x < -halfX || this.position.x > halfX) {
      this.position.x = Math.max(-halfX, Math.min(this.position.x, halfX));
      this.velocity.x *= -BOUNDARY_RESTITUTION;
    }

    if (this.position.y < -halfY || this.position.y > halfY) {
      this.position.y = Math.max(-halfY, Math.min(this.position.y, halfY));
      this.velocity.y *= -BOUNDARY_RESTITUTION;
    }

    if (this.position.z < -halfZ || this.position.z > halfZ) {
      this.position.z = Math.max(-halfZ, Math.min(this.position.z, halfZ));
      this.velocity.z *= -BOUNDARY_RESTITUTION;
    }

    this.clearAcceleration();
    this.collided = false;
  }

  projectToScreen(
    width: number,
    height: number,
    fov: number,
    camera: Vector3
  ): {
    px: number;
    py: number;
    scale: number;
    radius: number;
    color: string;
  } | null {
    const relative = Vector3.scratch1.copyFrom(this.position).sub(camera);
    if (relative.z <= -fov) return null;

    const scale = fov / (fov + relative.z);

    const px = width / 2 + relative.x * scale;
    const py = height / 2 + relative.y * scale;

    const radius = scale * this.radius;

    if (
      px + radius < 0 ||
      px - radius > width ||
      py + radius < 0 ||
      py - radius > height
    )
      return null;

    let chargeColor: string = baseTheme.color.particleNeutron;
    if (this.charge === -1) {
      chargeColor = baseTheme.color.particleElectron;
    } else if (this.charge === 1) {
      chargeColor = baseTheme.color.particleProton;
    }

    return { px, py, scale, radius, color: chargeColor };
  }
}
