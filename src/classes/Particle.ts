import {
  getInitialParticleSize,
  getInitialPosition,
  getInitialVelocity,
} from "@/lib/defaults";
import { Vector3 } from "@/classes/Vector3";

let particleIdCounter = 0;
export type Charge = -1 | 0 | 1; // negative, neutral, positive

export class Particle {
  _id: number;
  position: Vector3;
  velocity: Vector3;
  radius: number;
  charge: Charge;

  collided = false;

  constructor(worldWidth: number, worldHeight: number, worldZ: number) {
    this._id = particleIdCounter++;

    this.radius = getInitialParticleSize();

    const { x, y, z } = getInitialPosition(worldWidth, worldHeight, worldZ);
    this.position = new Vector3(x, y, z);

    const { x: vx, y: vy, z: vz } = getInitialVelocity();
    this.velocity = new Vector3(vx, vy, vz);

    const rand = Math.random();
    this.charge = rand < 0.33 ? -1 : rand < 0.66 ? 0 : 1;
  }

  applyForce(force: Vector3) {
    this.velocity.add(force);
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
    this.velocity.add(toCenter.scale((1 / dist) * centerAttraction));
    this.collided = false;
  }

  projectToScreen(
    width: number,
    height: number,
    fov: number,
    camera: Vector3,
    overrideColor?: string
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
    const alpha = Math.max(0, Math.min(1, scale));

    if (
      px + radius < 0 ||
      px - radius > width ||
      py + radius < 0 ||
      py - radius > height
    )
      return null;

    const speed = this.velocity.length();
    const minSpeed = 0;
    const maxSpeed = 5;
    const t = Math.min(1, (speed - minSpeed) / (maxSpeed - minSpeed));

    const r = Math.round(255 * (1 - t));
    const g = Math.round(255 * Math.min(1, t * 2));
    const b = Math.round(255 * t);

    const baseColor = `rgba(${r}, ${g}, ${b}, 1)`;
    const color = overrideColor
      ? overrideColor
      : baseColor.replace(/1\)$/, `${alpha})`);

    const chargeColor =
      this.charge === -1
        ? `rgba(0, 0, 255, ${alpha})`
        : this.charge === 1
        ? `rgba(255, 0, 0, ${alpha})`
        : baseColor.replace(/1\)$/, `${alpha})`);

    return { px, py, scale, radius, color: chargeColor };
  }
}
