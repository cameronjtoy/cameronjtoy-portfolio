export interface Measurement {
  /** 0..1 through the section's scroll range. */
  progress: number
  /** Pixels the scene sits below (+) or above (-) the viewport centre. */
  offset: number
  /** Whether the section is on screen or within `margin` viewports of it. */
  visible: boolean
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Turns a section's position into scene state. A section taller than the
 * viewport behaves like a sticky element: its scene scrolls in, stays pinned
 * while `progress` runs 0..1, then scrolls out. A shorter section's scene just
 * follows the section's centre.
 */
export function measure(
  top: number,
  height: number,
  viewport: number,
  margin = 0.5,
): Measurement {
  const bottom = top + height
  const range = height - viewport
  const visible = bottom > -viewport * margin && top < viewport * (1 + margin)

  if (range <= 0) {
    return {
      progress: clamp01((viewport - top) / (viewport + height)),
      offset: top + height / 2 - viewport / 2,
      visible,
    }
  }

  let offset = 0
  if (top > 0) offset = top
  else if (bottom < viewport) offset = bottom - viewport

  return { progress: clamp01(-top / range), offset, visible }
}
