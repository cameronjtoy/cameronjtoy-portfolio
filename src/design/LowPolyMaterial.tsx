import { palette, type PaletteColor } from './palette'

/** The standard faceted, matte material every scene uses. */
export function LowPolyMaterial({ color }: { color: PaletteColor }) {
  return (
    <meshStandardMaterial
      color={palette[color]}
      flatShading
      roughness={0.85}
      metalness={0}
    />
  )
}
