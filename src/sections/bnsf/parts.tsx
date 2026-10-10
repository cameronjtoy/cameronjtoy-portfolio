import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { CAR_WIDTH, DECK_Y } from './dims'

/** Per-frame train state, written by the scene and read by its parts. */
export interface TrainMotion {
  /** The locomotive's x position. */
  x: number
  /** 0..1 per car: how far its showpiece animation has played. */
  reveal: number[]
}

export type MotionRef = RefObject<TrainMotion>

export interface CarProps {
  motion: MotionRef
  index: number
}

const WHEEL_RADIUS = 0.17
const RAIL_GAUGE = 0.6

function Truck({ x, motion }: { x: number; motion: MotionRef }) {
  const wheels = useRef<Group>(null)

  useFrame(() => {
    const spin = -motion.current.x / WHEEL_RADIUS
    wheels.current?.children.forEach((wheel) => {
      wheel.rotation.z = spin
    })
  })

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.72, 0.1, RAIL_GAUGE + 0.12]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <group ref={wheels}>
        {[-0.22, 0.22].flatMap((axle) =>
          [-RAIL_GAUGE / 2, RAIL_GAUGE / 2].map((z) => (
            <group key={`${axle}:${z}`} position={[axle, WHEEL_RADIUS, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry
                  args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.07, 8]}
                />
                <LowPolyMaterial color="ink" />
              </mesh>
            </group>
          )),
        )}
      </group>
    </group>
  )
}

/** Underframe, two trucks and couplers: everything below a car's body. */
export function Chassis({
  length,
  motion,
}: {
  length: number
  motion: MotionRef
}) {
  const truckX = length / 2 - 0.5
  return (
    <>
      <mesh position={[0, DECK_Y - 0.06, 0]}>
        <boxGeometry args={[length, 0.12, CAR_WIDTH - 0.06]} />
        <LowPolyMaterial color="ink" />
      </mesh>
      <Truck x={-truckX} motion={motion} />
      <Truck x={truckX} motion={motion} />
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (length / 2 + 0.1), 0.36, 0]}>
          <boxGeometry args={[0.24, 0.08, 0.1]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}
    </>
  )
}
