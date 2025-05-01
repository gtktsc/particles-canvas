export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

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

  normalize() {
    const len = this.length() || 1;
    return this.scale(1 / len);
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
