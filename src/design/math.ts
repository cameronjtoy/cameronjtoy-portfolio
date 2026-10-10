export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const lerp = (from: number, to: number, t: number) =>
  from + (to - from) * t

/** Eases 0..1 so motion starts and ends gently. */
export const smooth = (t: number) => t * t * (3 - 2 * t)
