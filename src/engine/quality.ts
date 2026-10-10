export interface Quality {
  /** Upper bound on the device pixel ratio the canvas renders at. */
  maxDpr: number
  antialias: boolean
}

// Phones and tablets get a cheaper tier: they have small GPUs and
// high-density screens, so full-resolution antialiased rendering costs the
// most there.
const lowPower =
  window.matchMedia('(pointer: coarse)').matches ||
  (navigator.hardwareConcurrency ?? 8) <= 4

export const quality: Quality = lowPower
  ? { maxDpr: 1.5, antialias: false }
  : { maxDpr: 2, antialias: true }
