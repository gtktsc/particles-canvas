import {
  getInitialPosition,
  getInitialVelocity,
  getShellIndex,
} from "@/lib/defaults";
import { Vector3 } from "@/classes/Vector3";

let particleIdCounter = 0;
export type Charge = -1 | 0 | 1;
export type ParticleType = "proton" | "neutron" | "electron";

export class Particle {
  type: ParticleType;

  _id: number;
  position: Vector3;
  velocity: Vector3;
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
  }

  applyForce(force: Vector3) {
    this.velocity.add(Vector3.scratch1.copyFrom(force).scale(1 / this.mass));
  }

  update(
    center: Vector3,
    bounds: { width: number; height: number; depth: number },
    damping: number,
    centerAttraction: number
  ) {
    this.position.add(this.velocity);
    this.velocity.scale(damping);

    const halfX = bounds.width / 2;
    const halfY = bounds.height / 2;
    const halfZ = bounds.depth / 2;

    if (this.position.x < -halfX || this.position.x > halfX) {
      this.position.x = Math.max(-halfX, Math.min(this.position.x, halfX));
      this.velocity.x *= -1;
    }

    if (this.position.y < -halfY || this.position.y > halfY) {
      this.position.y = Math.max(-halfY, Math.min(this.position.y, halfY));
      this.velocity.y *= -1;
    }

    if (this.position.z < -halfZ || this.position.z > halfZ) {
      this.position.z = Math.max(-halfZ, Math.min(this.position.z, halfZ));
      this.velocity.z *= -1;
    }

    const toCenter = new Vector3(
      center.x - this.position.x,
      center.y - this.position.y,
      0 - this.position.z
    );
    const dist = this.position.distanceTo(center) + 0.01;

    const attractionForce = toCenter
      .clone()
      .normalize()
      .scale((1 / dist) * centerAttraction);
    this.velocity.add(attractionForce);

    if (this.type === "electron") {
      // Pick an arbitrary axis to generate perpendicular vector (stable in 3D)
      const tangent = toCenter.clone().cross(new Vector3(0, 0, 1)).normalize();

      const orbitalSpeed = Math.sqrt(centerAttraction / dist);
      this.velocity.add(tangent.scale(orbitalSpeed));
    }

    this.velocity.add(toCenter.scale((1 / dist) * centerAttraction));

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
    const scale = fov / (fov + relative.z);

    if (relative.z < -fov) return null;

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

    let chargeColor = "rgba(255, 255, 255, 1)";
    if (this.charge === -1) {
      chargeColor = "rgba(0, 0, 255, 1)";
    } else if (this.charge === 1) {
      chargeColor = "rgba(255, 0, 0, 1)";
    }

    return { px, py, scale, radius, color: chargeColor };
  }
}
