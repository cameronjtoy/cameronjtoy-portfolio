import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../../design/LowPolyMaterial'
import { CAR_WIDTH, clamp01, DECK_Y } from '../dims'
import { Chassis, type CarProps } from '../parts'
import { CAR_LENGTH } from '../timeline'

// The reusable CRUD framework: a well car loaded with identical containers,
// which drop into place one after another.

const BOX = { length: 1.12, height: 0.44, depth: CAR_WIDTH - 0.08 }
const DROP = 1.4

const containers = [
  { x: -0.59, row: 0, color: 'teal' },
  { x: 0.59, row: 0, color: 'blue' },
  { x: -0.59, row: 1, color: 'plum' },
  { x: 0.59, row: 1, color: 'green' },
] as const

const restY = (row: number) => DECK_Y + BOX.height / 2 + row * BOX.height

export function WellCar({ motion, index }: CarProps) {
  const stack = useRef<Group>(null)

  useFrame(() => {
    const loaded = motion.current.reveal[index] * containers.length
    stack.current?.children.forEach((box, i) => {
      const part = clamp01(loaded - i)
      box.visible = part > 0
      // Ease out so each container decelerates as it lands.
      box.position.y = restY(containers[i].row) + (1 - part) ** 2 * DROP
    })
  })

  return (
    <group>
      <Chassis length={CAR_LENGTH} motion={motion} />
      {[-1, 1].map((end) => (
        <mesh
          key={end}
          position={[end * (CAR_LENGTH / 2 - 0.04), DECK_Y + 0.16, 0]}
        >
          <boxGeometry args={[0.08, 0.32, CAR_WIDTH]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}
      <group ref={stack}>
        {containers.map((box) => (
          <group key={`${box.x}:${box.row}`} position={[box.x, 0, 0]}>
            <mesh>
              <boxGeometry args={[BOX.length, BOX.height, BOX.depth]} />
              <LowPolyMaterial color={box.color} />
            </mesh>
            {/* Door bars, the same on every container */}
            {[-0.38, -0.3].map((x) => (
              <mesh key={x} position={[x, 0, BOX.depth / 2]}>
                <boxGeometry args={[0.025, BOX.height - 0.08, 0.02]} />
                <LowPolyMaterial color="white" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}
