import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, smooth } from '../../design/math'
import type { BeatsRef } from './layout'

// Beat 2, first part: the data-quality check. The board starts with pairs of
// duplicate record cards. Each pair slides together into one card, which
// gets a green mark.

const BOARD = { width: 1.7, height: 0.75 }
const PAIRS = 4
const APART = 0.1
/** The share of the beat the merging takes. The invoice prints after it. */
const MERGE_SHARE = 0.6

export function Board({
  beats,
  position,
}: {
  beats: BeatsRef
  position: [number, number, number]
}) {
  const pairs = useRef<Group>(null)

  useFrame(() => {
    const beat = clamp01(beats.current[2] / MERGE_SHARE)
    pairs.current?.children.forEach((pair, i) => {
      const t = smooth(clamp01(beat * PAIRS - i))
      const [kept, duplicate, mark] = pair.children
      kept.position.x = -APART * (1 - t)
      duplicate.position.x = APART * (1 - t)
      duplicate.rotation.z = 0.12 * (1 - t)
      duplicate.visible = t < 1
      mark.visible = t >= 1
    })
  })

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[BOARD.width, BOARD.height, 0.04]} />
        <LowPolyMaterial color="wood" />
      </mesh>
      <group ref={pairs} position={[0, 0, 0.03]}>
        {Array.from({ length: PAIRS }, (_, i) => (
          <group
            key={i}
            position={[((i + 0.5) / PAIRS - 0.5) * (BOARD.width - 0.1), 0, 0]}
          >
            <mesh>
              <boxGeometry args={[0.17, 0.24, 0.01]} />
              <LowPolyMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.008]}>
              <boxGeometry args={[0.17, 0.24, 0.01]} />
              <LowPolyMaterial color="paper" />
            </mesh>
            <mesh position={[0, 0.07, 0.012]}>
              <boxGeometry args={[0.11, 0.045, 0.01]} />
              <LowPolyMaterial color="green" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
