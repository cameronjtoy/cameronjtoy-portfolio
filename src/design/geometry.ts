import {
  CapsuleGeometry,
  ConeGeometry,
  ExtrudeGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  Shape,
  Vector2,
  type BufferGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// Geometry builders for the shape kit (shapes.tsx). Each result is cached by
// its arguments, so the hundredth wheel reuses the first one's buffers.
// Cached geometries live for the life of the page and must not be mutated.

export type Axis = 'x' | 'y' | 'z'
export type Point = readonly [number, number]

const cache = new Map<string, BufferGeometry>()

function cached(key: string, make: () => BufferGeometry) {
  let geometry = cache.get(key)
  if (!geometry) {
    geometry = make()
    cache.set(key, geometry)
  }
  return geometry
}

/** Turns a geometry built along y to lie along another axis. */
function along(geometry: BufferGeometry, axis: Axis) {
  if (axis === 'x') geometry.rotateZ(-Math.PI / 2)
  if (axis === 'z') geometry.rotateX(Math.PI / 2)
  return geometry
}

/** A box with rounded edges. The radius is capped so thin boxes stay valid. */
export function roundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
) {
  const capped = Math.min(radius, Math.min(width, height, depth) * 0.45)
  return cached(
    `box:${width}:${height}:${depth}:${capped}`,
    () => new RoundedBoxGeometry(width, height, depth, 2, capped),
  )
}

/** A profile of [radius, height] points spun around the y axis. */
export function lathe(
  points: readonly Point[],
  segments = 20,
  axis: Axis = 'y',
) {
  return cached(`lathe:${JSON.stringify(points)}:${segments}:${axis}`, () =>
    along(
      new LatheGeometry(
        points.map(([radius, y]) => new Vector2(radius, y)),
        segments,
      ),
      axis,
    ),
  )
}

/**
 * A cylinder or tapered cylinder with bevelled rims, centred on the origin.
 * Use it wherever something is meant to read as round.
 */
export function round(
  radiusBottom: number,
  radiusTop: number,
  length: number,
  axis: Axis = 'y',
  segments = 20,
  bevel = 0.02,
) {
  const half = length / 2
  const b = Math.min(bevel, half, radiusBottom, radiusTop)
  return lathe(
    [
      [0, -half],
      [radiusBottom - b, -half],
      [radiusBottom, -half + b],
      [radiusTop, half - b],
      [radiusTop - b, half],
      [0, half],
    ],
    segments,
    axis,
  )
}

/** A cylinder with domed ends. `length` is the straight part. */
export function capsule(
  radius: number,
  length: number,
  axis: Axis = 'y',
  segments = 20,
) {
  return cached(`capsule:${radius}:${length}:${axis}:${segments}`, () =>
    along(new CapsuleGeometry(radius, length, 5, segments), axis),
  )
}

/**
 * A 2D outline of [x, y] points given thickness along z, with bevelled
 * edges. For anything recognised by its silhouette. Centred on z.
 */
export function extrude(points: readonly Point[], depth: number, bevel = 0.02) {
  return cached(`extrude:${JSON.stringify(points)}:${depth}:${bevel}`, () => {
    const shape = new Shape(points.map(([x, y]) => new Vector2(x, y)))
    const inner = Math.max(depth - bevel * 2, 0.001)
    const geometry = new ExtrudeGeometry(shape, {
      depth: inner,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 2,
      // Inset the outline by the bevel so the result matches the points.
      bevelOffset: -bevel,
    })
    geometry.translate(0, 0, -inner / 2)
    return geometry
  })
}

export function cone(radius: number, height: number, segments: number) {
  return cached(
    `cone:${radius}:${height}:${segments}`,
    () => new ConeGeometry(radius, height, segments),
  )
}

/** Deterministic 0..1 value for a point in space. */
function noise(x: number, y: number, z: number, seed: number) {
  const value =
    Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 4.1414) * 43758.5453
  return value - Math.floor(value)
}

/**
 * An irregular faceted lump: an icosphere with each vertex pushed in or out.
 * For hills, boulders and loose loads. `roughness` is the share of the radius
 * a vertex can move.
 */
export function rock(
  radius: number,
  detail: number,
  seed: number,
  roughness = 0.22,
) {
  return cached(`rock:${radius}:${detail}:${seed}:${roughness}`, () => {
    const geometry = new IcosahedronGeometry(radius, detail)
    const position = geometry.getAttribute('position')
    // Faces do not share vertices, so the push is derived from the rounded
    // position: every copy of a corner moves the same way and no gaps open.
    const snap = (value: number) => Math.round((value / radius) * 1000)
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const push =
        1 + (noise(snap(x), snap(y), snap(z), seed) - 0.5) * 2 * roughness
      position.setXYZ(i, x * push, y * push, z * push)
    }
    geometry.computeVertexNormals()
    return geometry
  })
}

/** Outline of a doorway: a rectangle with a semicircular top, base at y = 0. */
export function archOutline(width: number, height: number, steps = 8): Point[] {
  const radius = width / 2
  const points: Point[] = [
    [-radius, 0],
    [radius, 0],
  ]
  for (let step = 0; step <= steps; step++) {
    const angle = (step / steps) * Math.PI
    points.push([
      Math.cos(angle) * radius,
      height - radius + Math.sin(angle) * radius,
    ])
  }
  return points
}
