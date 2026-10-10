import { Box3, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import {
  archOutline,
  capsule,
  extrude,
  rock,
  round,
  roundedBox,
} from './geometry'

const sizeOf = (geometry: Parameters<Box3['setFromBufferAttribute']>[0]) => {
  const size = new Vector3()
  new Box3().setFromBufferAttribute(geometry).getSize(size)
  return size.toArray().map((value) => Number(value.toFixed(3)))
}
const bounds = (geometry: ReturnType<typeof roundedBox>) =>
  sizeOf(geometry.getAttribute('position') as never)

describe('shape-kit geometry', () => {
  it('reuses a geometry for the same arguments', () => {
    expect(roundedBox(1, 2, 3, 0.1)).toBe(roundedBox(1, 2, 3, 0.1))
    expect(roundedBox(1, 2, 3, 0.1)).not.toBe(roundedBox(1, 2, 3, 0.2))
    expect(rock(1, 1, 7)).toBe(rock(1, 1, 7))
  })

  it('keeps a rounded box at its stated size, even when thin', () => {
    expect(bounds(roundedBox(2, 1, 0.5, 0.1))).toEqual([2, 1, 0.5])
    expect(bounds(roundedBox(2, 0.02, 0.5, 0.1))).toEqual([2, 0.02, 0.5])
  })

  it('lays round shapes along the requested axis', () => {
    expect(bounds(round(0.5, 0.5, 2))).toEqual([1, 2, 1])
    expect(bounds(round(0.5, 0.5, 2, 'x'))).toEqual([2, 1, 1])
    expect(bounds(round(0.5, 0.5, 2, 'z'))).toEqual([1, 1, 2])
    // A capsule's domes add a radius at each end.
    expect(bounds(capsule(0.5, 2, 'x'))).toEqual([3, 1, 1])
  })

  it('extrudes an outline to its own size and the stated depth', () => {
    const square = [
      [0, 0],
      [2, 0],
      [2, 1],
      [0, 1],
    ] as const
    expect(bounds(extrude(square, 0.6, 0.05))).toEqual([2, 1, 0.6])
    expect(bounds(extrude(square, 0.6, 0))).toEqual([2, 1, 0.6])
  })

  it('moves every copy of a rock corner the same way, leaving no gaps', () => {
    const position = rock(1, 1, 3).getAttribute('position')
    const corners = new Set<string>()
    for (let i = 0; i < position.count; i++) {
      corners.add(
        [position.getX(i), position.getY(i), position.getZ(i)]
          .map((value) => value.toFixed(4))
          .join(','),
      )
    }
    // An icosphere at detail 1 has 42 distinct corners across 80 faces.
    expect(position.count).toBe(240)
    expect(corners.size).toBe(42)
  })

  it('gives different rocks for different seeds', () => {
    const a = rock(1, 1, 1).getAttribute('position')
    const b = rock(1, 1, 2).getAttribute('position')
    expect(a.getX(0)).not.toBe(b.getX(0))
  })

  it('outlines an arch with a flat base and the stated size', () => {
    const outline = archOutline(2, 3)
    const xs = outline.map(([x]) => x)
    const ys = outline.map(([, y]) => y)
    expect(Math.min(...xs)).toBeCloseTo(-1)
    expect(Math.max(...xs)).toBeCloseTo(1)
    expect(Math.min(...ys)).toBe(0)
    expect(Math.max(...ys)).toBeCloseTo(3)
  })
})
