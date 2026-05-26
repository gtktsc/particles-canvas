export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vector3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  scale(factor: number) {
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;
    return this;
  }

  cross(v: Vector3) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  distanceTo(v: Vector3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  sub(v: Vector3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  normalize() {
    const len = this.length() || 1;
    return this.scale(1 / len);
  }

  clampLength(max: number) {
    const lenSq = this.lengthSq();
    if (lenSq <= max * max) return this;

    return this.scale(max / Math.sqrt(lenSq));
  }

  toString() {
    return `${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(2)}`;
  }

  copyFrom(v: Vector3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  static scratch1 = new Vector3();
  static scratch2 = new Vector3();
  static scratch3 = new Vector3();
}
