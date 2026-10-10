import type { ThreeElements } from '@react-three/fiber'
import { useMemo } from 'react'
import {
  capsule,
  cone,
  extrude,
  lathe,
  rock,
  round,
  roundedBox,
  type Axis,
  type Point,
} from './geometry'
import { matte } from './materials'
import type { PaletteColor } from './palette'
import { seededRandom } from './random'

// The shape kit: the building blocks every scene's models are made from.
// They replace raw boxes and cones with shapes that have bevelled edges,
// real roundness and proper silhouettes. Geometry and materials are shared
// (see geometry.ts and materials.ts), so a shape costs little to repeat.

type MeshProps = Omit<
  ThreeElements['mesh'],
  'geometry' | 'material' | 'children'
>

interface Look {
  color: PaletteColor
  /** Faceted shading. Off by default so bevels read as soft edges. */
  flat?: boolean
}

/** A box with softened edges. The default for any manufactured body. */
export function Block({
  size,
  radius = 0.03,
  color,
  flat,
  ...mesh
}: MeshProps &
  Look & { size: readonly [number, number, number]; radius?: number }) {
  return (
    <mesh
      geometry={roundedBox(size[0], size[1], size[2], radius)}
      material={matte(color, flat)}
      {...mesh}
    />
  )
}

/** A cylinder with bevelled rims; give two radii for a taper. */
export function Round({
  radius,
  length,
  axis = 'y',
  segments = 20,
  bevel = 0.02,
  color,
  flat,
  ...mesh
}: MeshProps &
  Look & {
    /** One radius, or [bottom, top] along the axis. */
    radius: number | readonly [number, number]
    length: number
    axis?: Axis
    segments?: number
    bevel?: number
  }) {
  const [bottom, top] = typeof radius === 'number' ? [radius, radius] : radius
  return (
    <mesh
      geometry={round(bottom, top, length, axis, segments, bevel)}
      material={matte(color, flat)}
      {...mesh}
    />
  )
}

/** A cylinder with domed ends. `length` is the straight part. */
export function Capsule({
  radius,
  length,
  axis = 'y',
  color,
  flat,
  ...mesh
}: MeshProps & Look & { radius: number; length: number; axis?: Axis }) {
  return (
    <mesh
      geometry={capsule(radius, length, axis)}
      material={matte(color, flat)}
      {...mesh}
    />
  )
}

/**
 * A 2D outline of [x, y] points given `depth` along z. Use it for anything
 * recognised by its silhouette. Its faces are always faceted.
 */
export function Profile({
  points,
  depth,
  bevel = 0.02,
  color,
  ...mesh
}: MeshProps &
  Pick<Look, 'color'> & {
    points: readonly Point[]
    depth: number
    bevel?: number
  }) {
  return (
    <mesh
      geometry={extrude(points, depth, bevel)}
      material={matte(color, true)}
      {...mesh}
    />
  )
}

/** A profile of [radius, height] points spun around an axis. */
export function Lathe({
  points,
  axis = 'y',
  segments = 20,
  color,
  flat,
  ...mesh
}: MeshProps &
  Look & { points: readonly Point[]; axis?: Axis; segments?: number }) {
  return (
    <mesh
      geometry={lathe(points, segments, axis)}
      material={matte(color, flat)}
      {...mesh}
    />
  )
}

/** An irregular faceted lump for hills, boulders and loose loads. */
export function Rock({
  radius,
  seed,
  detail = 1,
  roughness,
  color,
  ...mesh
}: MeshProps &
  Pick<Look, 'color'> & {
    radius: number
    seed: number
    detail?: number
    roughness?: number
  }) {
  return (
    <mesh
      geometry={rock(radius, detail, seed, roughness)}
      material={matte(color, true)}
      {...mesh}
    />
  )
}

const TIERS = 3

/**
 * A conifer: a trunk and three overlapping tiers, each turned a little so no
 * two trees line up. Its base sits at the origin.
 */
export function Pine({
  height = 2,
  seed = 1,
  ...group
}: Omit<ThreeElements['group'], 'children'> & {
  height?: number
  seed?: number
}) {
  const turns = useMemo(() => {
    const random = seededRandom(seed)
    return Array.from({ length: TIERS }, () => random() * Math.PI)
  }, [seed])

  const trunk = height * 0.22
  const crown = height - trunk
  const tier = (crown / TIERS) * 1.45 // tiers overlap

  return (
    <group {...group}>
      <Round
        radius={[height * 0.055, height * 0.04]}
        length={trunk + 0.1}
        segments={7}
        bevel={0}
        color="wood"
        flat
        position={[0, trunk / 2, 0]}
      />
      {turns.map((turn, i) => {
        const base = trunk + (i * crown) / TIERS
        const radius = height * (0.3 - i * 0.07)
        return (
          <mesh
            key={i}
            geometry={cone(radius, tier, 7)}
            material={matte(i === TIERS - 1 ? 'fir' : 'pine', true)}
            position={[0, base + tier / 2 - 0.02, 0]}
            rotation={[0, turn, 0]}
          />
        )
      })}
    </group>
  )
}
