import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import type { PaletteColor } from '../../design/palette'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import type { SectionId } from '../../engine/sections'

// Stand-in scenes that prove the scroll wiring. Each section's own PR replaces
// its entry in engine/registry.ts with a real scene.

const looks: Record<SectionId, { color: PaletteColor; geometry: ReactNode }> = {
  hero: { color: 'orange', geometry: <icosahedronGeometry args={[1.3, 0]} /> },
  bnsf: { color: 'amber', geometry: <boxGeometry args={[2.6, 1.2, 1.2]} /> },
  'stony-brook': {
    color: 'teal',
    geometry: <octahedronGeometry args={[1.4, 0]} />,
  },
  earlier: { color: 'green', geometry: <coneGeometry args={[1.2, 2, 5]} /> },
  personal: {
    color: 'blue',
    geometry: <dodecahedronGeometry args={[1.3, 0]} />,
  },
  closing: { color: 'plum', geometry: <torusGeometry args={[1, 0.4, 6, 8]} /> },
}

const STEPS = 9

export default function PlaceholderScene({ id }: SceneProps) {
  const shape = useRef<Group>(null)
  const steps = useRef<Group>(null)
  const { color, geometry } = looks[id]

  useFrame(() => {
    const { progress } = getSection(id)
    if (shape.current) {
      shape.current.rotation.y = progress * Math.PI * 2
      shape.current.rotation.x = 0.35 + progress * 0.6
    }
    // The row of cubes fills left to right as a visible progress readout.
    steps.current?.children.forEach((step, index) => {
      const filled = Math.min(1, Math.max(0, progress * STEPS - index))
      step.scale.setScalar(0.35 + filled * 0.65)
    })
  })

  return (
    <>
      <group ref={shape}>
        <mesh>
          {geometry}
          <LowPolyMaterial color={color} />
        </mesh>
      </group>
      <group ref={steps} position={[0, -2.3, 0]}>
        {Array.from({ length: STEPS }, (_, index) => (
          <mesh key={index} position={[(index - (STEPS - 1) / 2) * 0.45, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <LowPolyMaterial color="steel" />
          </mesh>
        ))}
      </group>
    </>
  )
}
