import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, lerp, smooth } from '../../design/math'
import { seededRandom } from '../../design/random'
import {
  CABINET,
  CATEGORY_COLORS,
  DRAWER_OPEN,
  DRAWER_Y,
  MACHINE,
  SLOT_Y,
  type BeatsRef,
} from './layout'

// Beat 1: the legacy charts. They start as a messy pile on the floor. One by
// one they fly into the transform unit, come out as uniform records tagged by
// category, and drop into that category's drawer.

const COUNT = 15
const SHEET = { width: 0.3, depth: 0.4 }
/** Share of the beat over which sheets set off; the rest is the last flight. */
const STAGGER = 0.7

const INLET = { x: MACHINE.x - MACHINE.width / 2 - 0.1, z: MACHINE.z }
const OUTLET = { x: MACHINE.x + MACHINE.width / 2 + 0.1, z: MACHINE.z }
const DROP_Z = CABINET.z + CABINET.depth / 2 + DRAWER_OPEN - 0.22

// A sheet's flight, as shares of its own 0..1 timeline.
const INTO_MACHINE = 0.4
const OUT_OF_MACHINE = 0.6

interface Sheet {
  x: number
  y: number
  z: number
  yaw: number
  category: number
}

function makePile(): Sheet[] {
  const random = seededRandom(11)
  return Array.from({ length: COUNT }, (_, i) => ({
    x: -0.95 + (random() - 0.5) * 1.1,
    y: 0.01 + i * 0.013,
    z: 0.95 + (random() - 0.5) * 0.8,
    yaw: (random() - 0.5) * 2.6,
    category: i % CATEGORY_COLORS.length,
  }))
}

export function Papers({ beats }: { beats: BeatsRef }) {
  const sheets = useRef<Group>(null)
  const pile = useMemo(() => makePile(), [])

  useFrame(() => {
    const beat = beats.current[1]
    sheets.current?.children.forEach((sheet, i) => {
      const from = pile[i]
      // The top of the pile goes first.
      const order = (COUNT - 1 - i) / COUNT
      const t = clamp01((beat - order * STAGGER) / (1 - STAGGER))
      const [legacy, record] = sheet.children

      if (t < INTO_MACHINE) {
        const u = smooth(t / INTO_MACHINE)
        sheet.visible = true
        sheet.scale.setScalar(1)
        sheet.position.set(
          lerp(from.x, INLET.x, u),
          lerp(from.y, SLOT_Y, u) + Math.sin(u * Math.PI) * 0.5,
          lerp(from.z, INLET.z, u),
        )
        sheet.rotation.y = from.yaw * (1 - u)
        legacy.visible = true
        record.visible = false
      } else if (t < OUT_OF_MACHINE) {
        sheet.visible = false
      } else {
        const u = smooth((t - OUT_OF_MACHINE) / (1 - OUT_OF_MACHINE))
        // Shrink over the last stretch, as the record drops into the drawer.
        const size = clamp01((1 - u) / 0.15)
        sheet.visible = size > 0
        sheet.scale.setScalar(Math.max(size, 0.001))
        sheet.position.set(
          lerp(OUTLET.x, CABINET.x, u),
          lerp(SLOT_Y, DRAWER_Y[from.category] + 0.2, u) +
            Math.sin(u * Math.PI) * 0.45,
          lerp(OUTLET.z, DROP_Z, u),
        )
        sheet.rotation.y = 0
        legacy.visible = false
        record.visible = true
      }
    })
  })

  return (
    <group ref={sheets}>
      {pile.map((sheet, i) => (
        <group key={i}>
          <mesh>
            <boxGeometry args={[SHEET.width, 0.012, SHEET.depth]} />
            <LowPolyMaterial color="manila" />
          </mesh>
          <group>
            <mesh>
              <boxGeometry args={[SHEET.width, 0.012, SHEET.depth]} />
              <LowPolyMaterial color="white" />
            </mesh>
            <mesh position={[0, 0.002, -SHEET.depth / 2 + 0.04]}>
              <boxGeometry args={[SHEET.width, 0.014, 0.08]} />
              <LowPolyMaterial color={CATEGORY_COLORS[sheet.category]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
