import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../../design/LowPolyMaterial'
import { DECK_Y } from '../dims'
import { Chassis, type CarProps } from '../parts'
import { CAR_LENGTH } from '../timeline'

// EDI 404 waybill testing: a tank car with a pipeline along its side.
// Messages flow through one queue (amber, IBM MQ) into the next (teal, Kafka).

const RADIUS = 0.4
const TANK_LENGTH = CAR_LENGTH - 0.3
const PIPE_LENGTH = 1.8
const HALF = PIPE_LENGTH / 2
const PACKETS = 4 // per half
const SPEED = 0.35 // units per second at full reveal

export function TankCar({ motion, index }: CarProps) {
  const packets = useRef<Group>(null)
  const travelled = useRef(0)

  useFrame((_, delta) => {
    const reveal = motion.current.reveal[index]
    travelled.current += delta * SPEED * reveal
    // Each packet loops within its own half, so the stream reads as one flow
    // that changes colour at the junction.
    packets.current?.children.forEach((packet, i) => {
      const lane = i < PACKETS ? 0 : 1
      const along =
        (travelled.current + (i % PACKETS) * (HALF / PACKETS)) % HALF
      packet.position.x = -HALF + lane * HALF + along
      packet.visible = reveal > 0
    })
  })

  const centerY = DECK_Y + 0.06 + RADIUS
  const pipeZ = RADIUS + 0.03

  return (
    <group>
      <Chassis length={CAR_LENGTH} motion={motion} />
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, DECK_Y + 0.08, 0]}>
          <boxGeometry args={[0.2, 0.16, 0.6]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}
      <mesh position={[0, centerY, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[RADIUS, RADIUS, TANK_LENGTH, 10]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <mesh position={[0, centerY + RADIUS, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.14, 8]} />
        <LowPolyMaterial color="ink" />
      </mesh>

      <group position={[0, centerY, pipeZ]}>
        <mesh position={[-HALF / 2, 0, 0]}>
          <boxGeometry args={[HALF, 0.05, 0.03]} />
          <LowPolyMaterial color="amber" />
        </mesh>
        <mesh position={[HALF / 2, 0, 0]}>
          <boxGeometry args={[HALF, 0.05, 0.03]} />
          <LowPolyMaterial color="teal" />
        </mesh>
        {/* Junction and end valves */}
        {[-HALF, 0, HALF].map((x) => (
          <mesh key={x} position={[x, 0, 0.01]}>
            <boxGeometry args={[0.1, 0.16, 0.06]} />
            <LowPolyMaterial color="white" />
          </mesh>
        ))}
        <group ref={packets} position={[0, 0, 0.04]}>
          {Array.from({ length: PACKETS * 2 }, (_, i) => (
            <mesh key={i}>
              <boxGeometry args={[0.09, 0.09, 0.04]} />
              <LowPolyMaterial color="white" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
