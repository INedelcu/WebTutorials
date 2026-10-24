// A 2D point or vector. A type alias names a shape: any object with these fields fits it.
export type Vec2 = { x: number; y: number };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}