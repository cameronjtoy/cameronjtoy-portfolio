import { palette, type PaletteColor } from './palette'

/**
 * The standard matte material, declared inline on a mesh. Faceted unless
 * `smooth` is set. New models should use the shape kit (shapes.tsx), which
 * shares materials between meshes.
 */
export function LowPolyMaterial({
  color,
  smooth = false,
}: {
  color: PaletteColor
  smooth?: boolean
}) {
  return (
    <meshStandardMaterial
      color={palette[color]}
      flatShading={!smooth}
      roughness={0.85}
      metalness={0}
    />
  )
}
