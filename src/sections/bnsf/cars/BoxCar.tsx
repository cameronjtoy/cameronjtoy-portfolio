import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../../design/LowPolyMaterial'
import { CAR_WIDTH, DECK_Y } from '../dims'
import { Chassis, type CarProps } from '../parts'
import { CAR_LENGTH } from '../timeline'

// Attrition record accuracy: a boxcar with a gauge on its door that fills
// to 98%, one tick per 2%.

const BODY_HEIGHT = 1
const TICKS = 50
const LIT = 49 // 98%
const RADIUS = 0.3

export function BoxCar({ motion, index }: CarProps) {
  const ticks = useRef<Group>(null)

  useFrame(() => {
    const lit = Math.round(motion.current.reveal[index] * LIT)
    ticks.current?.children.forEach((tick, i) => {
      tick.visible = i < lit
    })
  })

  const side = CAR_WIDTH / 2

  return (
    <group>
      <Chassis length={CAR_LENGTH} motion={motion} />
      <mesh position={[0, DECK_Y + BODY_HEIGHT / 2, 0]}>
        <boxGeometry args={[CAR_LENGTH - 0.1, BODY_HEIGHT, CAR_WIDTH]} />
        <LowPolyMaterial color="rust" />
      </mesh>
      <mesh position={[0, DECK_Y + BODY_HEIGHT + 0.03, 0]}>
        <boxGeometry args={[CAR_LENGTH - 0.04, 0.06, CAR_WIDTH + 0.06]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      {/* Sliding door */}
      <mesh position={[0, DECK_Y + BODY_HEIGHT / 2, side + 0.01]}>
        <boxGeometry args={[0.9, BODY_HEIGHT - 0.1, 0.02]} />
        <LowPolyMaterial color="paper" />
      </mesh>

      <group position={[0, DECK_Y + BODY_HEIGHT / 2, side + 0.03]}>
        {/* Unlit track: every tick, dim */}
        {Array.from({ length: TICKS }, (_, i) => (
          <Tick key={i} index={i} color="steel" z={0} size={0.6} />
        ))}
        <group ref={ticks}>
          {Array.from({ length: TICKS }, (_, i) => (
            <Tick key={i} index={i} color="green" z={0.006} size={1} />
          ))}
        </group>
      </group>
    </group>
  )
}

function Tick({
  index,
  color,
  z,
  size,
}: {
  index: number
  color: 'steel' | 'green'
  z: number
  size: number
}) {
  // Clockwise from twelve o'clock.
  const angle = Math.PI / 2 - (index / TICKS) * Math.PI * 2
  return (
    <mesh
      position={[Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, z]}
      rotation={[0, 0, angle]}
    >
      <boxGeometry args={[0.1 * size, 0.024, 0.012]} />
      <LowPolyMaterial color={color} />
    </mesh>
  )
}
