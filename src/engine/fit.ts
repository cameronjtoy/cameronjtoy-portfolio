interface View {
  width: number
  height: number
  aspect: number
}

/**
 * Sizes and places a scene that shares the screen with content in the
 * `split` layout: beside the content on wide screens, in the lower part of
 * the screen on narrow ones. `footprint` is the scene's width at scale 1.
 */
export function fitSplit(view: View, footprint: number, maxScale = 1) {
  const wide = view.aspect > 1.2
  const available = wide ? view.width * 0.5 : view.width * 0.96
  return {
    scale: Math.min(maxScale, available / footprint),
    /** Where the scene's vertical centre should sit. */
    y: wide ? 0 : -view.height * 0.2,
  }
}
