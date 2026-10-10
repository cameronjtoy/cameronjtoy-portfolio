import { MeshStandardMaterial } from 'three'
import { palette, type PaletteColor } from './palette'

// One material per colour and shading style, shared by every shape that uses
// it. They live for the life of the page and must not be mutated.

const cache = new Map<string, MeshStandardMaterial>()

/**
 * The matte material for a palette colour. Smooth shading suits bevelled,
 * manufactured shapes; flat shading keeps the facets on organic ones.
 */
export function matte(color: PaletteColor, flat = false) {
  const key = `${color}:${flat}`
  let material = cache.get(key)
  if (!material) {
    material = new MeshStandardMaterial({
      color: palette[color],
      flatShading: flat,
      roughness: 0.85,
      metalness: 0,
    })
    cache.set(key, material)
  }
  return material
}
