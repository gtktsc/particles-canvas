import { describe, expect, it } from "vitest";
import { Vector3 } from "@/features/simulation/model/Vector3";

describe("Vector3", () => {
  it("mutates and chains basic vector operations", () => {
    const vector = new Vector3(1, 2, 3);

    vector.add(new Vector3(2, 3, 4)).sub(new Vector3(1, 1, 1)).scale(2);

    expect(vector).toMatchObject({ x: 4, y: 8, z: 12 });
  });

  it("computes length, dot product, and normalized vectors", () => {
    const vector = new Vector3(3, 4, 0);

    expect(vector.length()).toBe(5);
    expect(vector.dot(new Vector3(2, 0, 1))).toBe(6);
    vector.normalize();
    expect(vector.x).toBeCloseTo(0.6);
    expect(vector.y).toBeCloseTo(0.8);
    expect(vector.z).toBe(0);
  });

  it("keeps zero vectors stable when normalized", () => {
    const vector = new Vector3();

    expect(vector.normalize()).toMatchObject({ x: 0, y: 0, z: 0 });
  });
});
