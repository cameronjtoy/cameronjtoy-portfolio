import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, smooth } from '../../design/math'
import {
  CABINET,
  CATEGORY_COLORS,
  DRAWER_OPEN,
  DRAWER_Y,
  type BeatsRef,
} from './layout'

// A three-drawer filing cabinet, one drawer per record category. Given
// `beats`, its drawers slide open while records are being filed (beat 1) and
// shut when the last one is in.

const HEIGHT = 1.65
const DRAWER = { width: CABINET.width - 0.1, height: 0.45 }

export function Cabinet({ x, beats }: { x: number; beats?: BeatsRef }) {
  const drawers = useRef<Group>(null)

  useFrame(() => {
    if (!beats || !drawers.current) return
    const beat = beats.current[1]
    const open = smooth(
      clamp01((beat - 0.15) / 0.12) * clamp01((1 - beat) / 0.05),
    )
    for (const drawer of drawers.current.children) {
      drawer.position.z = open * DRAWER_OPEN
    }
  })

  return (
    <group position={[x, 0, CABINET.z]}>
      <mesh position={[0, HEIGHT / 2, 0]}>
        <boxGeometry args={[CABINET.width, HEIGHT, CABINET.depth]} />
        <LowPolyMaterial color="steel" />
      </mesh>
      <group ref={drawers}>
        {DRAWER_Y.map((y, i) => (
          <group key={y}>
            {/* Tray, seen from above once the drawer is open */}
            <mesh position={[0, y - 0.06, CABINET.depth / 2 - 0.2]}>
              <boxGeometry args={[DRAWER.width - 0.06, 0.3, 0.44]} />
              <LowPolyMaterial color="graphite" />
            </mesh>
            <mesh position={[0, y, CABINET.depth / 2 + 0.02]}>
              <boxGeometry args={[DRAWER.width, DRAWER.height, 0.04]} />
              <LowPolyMaterial color="white" />
            </mesh>
            <mesh position={[0, y + 0.1, CABINET.depth / 2 + 0.045]}>
              <boxGeometry args={[0.3, 0.1, 0.012]} />
              <LowPolyMaterial color={CATEGORY_COLORS[i]} />
            </mesh>
            <mesh position={[0, y - 0.07, CABINET.depth / 2 + 0.06]}>
              <boxGeometry args={[0.22, 0.035, 0.04]} />
              <LowPolyMaterial color="graphite" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
