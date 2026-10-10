import { useSyncExternalStore } from 'react'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function subscribe(listener: () => void) {
  reducedMotion.addEventListener('change', listener)
  return () => reducedMotion.removeEventListener('change', listener)
}

let webgl: boolean | undefined

function hasWebGL() {
  if (webgl === undefined) {
    try {
      webgl = !!document.createElement('canvas').getContext('webgl2')
    } catch {
      webgl = false
    }
  }
  return webgl
}

/**
 * Whether to show the 3D experience. Visitors who prefer reduced motion or
 * have no WebGL get the plain page instead.
 */
export function useEnhanced() {
  const reduced = useSyncExternalStore(subscribe, () => reducedMotion.matches)
  return !reduced && hasWebGL()
}
