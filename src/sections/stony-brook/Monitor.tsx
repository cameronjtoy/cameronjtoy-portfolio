import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01 } from '../../design/math'
import type { PaletteColor } from '../../design/palette'
import type { BeatsRef } from './layout'

// Beat 0: the EMR dashboard comes up on the monitor. A header and role badge
// appear, the records table fills row by row, then the audit log.
// Everything on screen is abstract bars: no text and no patient data.

const SCREEN = { width: 1.0, height: 0.62 }

interface Bar {
  x: number // left edge, from the screen centre
  y: number
  width: number
  height: number
  color: PaletteColor
  /** When in the beat (0..1) the bar starts to grow. */
  at: number
}

const ROWS = 5
const bars: Bar[] = [
  { x: -0.44, y: 0.21, width: 0.66, height: 0.07, color: 'teal', at: 0 },
  // Role badge
  { x: 0.31, y: 0.21, width: 0.13, height: 0.07, color: 'amber', at: 0.12 },
  // Records table
  ...Array.from({ length: ROWS }, (_, row): Bar => ({
    x: -0.44,
    y: 0.1 - row * 0.085,
    width: 0.5 + ((row * 7) % 3) * 0.05,
    height: 0.045,
    color: 'white',
    at: 0.22 + row * 0.1,
  })),
  // Audit log
  ...Array.from({ length: 4 }, (_, line): Bar => ({
    x: 0.25,
    y: 0.1 - line * 0.085,
    width: 0.19,
    height: 0.03,
    color: 'green',
    at: 0.72 + line * 0.05,
  })),
]

const GROW = 0.12 // share of the beat each bar takes to appear

export function Monitor({
  beats,
  position,
}: {
  beats: BeatsRef
  position: [number, number, number]
}) {
  const display = useRef<Group>(null)

  useFrame(() => {
    const beat = beats.current[0]
    display.current?.children.forEach((bar, i) => {
      const grown = clamp01((beat - bars[i].at) / GROW)
      bar.visible = grown > 0
      bar.scale.x = Math.max(grown, 0.001)
    })
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.34, 0.04, 0.22]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.07, 0.24, 0.05]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <group position={[0, 0.24 + SCREEN.height / 2, 0]}>
        <mesh>
          <boxGeometry args={[SCREEN.width, SCREEN.height, 0.05]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry
            args={[SCREEN.width - 0.06, SCREEN.height - 0.06, 0.01]}
          />
          <LowPolyMaterial color="ink" />
        </mesh>
        <group ref={display} position={[0, 0, 0.034]}>
          {bars.map((bar, i) => (
            // Each bar grows from its left edge.
            <group key={i} position={[bar.x, bar.y, 0]}>
              <mesh position={[bar.width / 2, 0, 0]}>
                <boxGeometry args={[bar.width, bar.height, 0.006]} />
                <LowPolyMaterial color={bar.color} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
