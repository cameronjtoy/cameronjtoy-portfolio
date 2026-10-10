import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../../design/LowPolyMaterial'
import { seededRandom } from '../../../design/random'
import { clamp01 } from '../../../design/math'
import { CAR_WIDTH, DECK_Y } from '../dims'
import { Chassis, type CarProps } from '../parts'
import { CAR_LENGTH } from '../timeline'

// Demand metrics across stations: a flat car carrying a network map whose
// station pins light up along the line.

const BOARD = { width: 2, height: 0.9 }
const STATIONS = 16

interface Station {
  x: number
  y: number
}

/** Stations strung left to right across the board, wandering up and down. */
function makeStations(): Station[] {
  const random = seededRandom(100)
  return Array.from({ length: STATIONS }, (_, i) => ({
    x: ((i + 0.5) / STATIONS - 0.5) * (BOARD.width - 0.2),
    y: (random() - 0.5) * (BOARD.height - 0.3),
  }))
}

export function FlatCar({ motion, index }: CarProps) {
  const pins = useRef<Group>(null)
  const stations = useMemo(() => makeStations(), [])

  useFrame(() => {
    const lit = motion.current.reveal[index] * STATIONS
    pins.current?.children.forEach((pin, i) => {
      const part = clamp01(lit - i)
      pin.visible = part > 0
      // Overshoot slightly so each pin pops as it lights.
      pin.scale.setScalar(part < 1 ? part * 1.4 : 1)
    })
  })

  const boardY = DECK_Y + 0.12 + BOARD.height / 2

  return (
    <group>
      <Chassis length={CAR_LENGTH} motion={motion} />
      <mesh position={[0, DECK_Y + 0.03, 0]}>
        <boxGeometry args={[CAR_LENGTH - 0.06, 0.06, CAR_WIDTH]} />
        <LowPolyMaterial color="wood" />
      </mesh>
      {[-0.8, 0.8].map((x) => (
        <mesh
          key={x}
          position={[x, DECK_Y + 0.4, -0.12]}
          rotation={[0.3, 0, 0]}
        >
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}

      <group position={[0, boardY, 0.08]}>
        <mesh>
          <boxGeometry args={[BOARD.width, BOARD.height, 0.05]} />
          <LowPolyMaterial color="paper" />
        </mesh>
        <group position={[0, 0, 0.03]}>
          {stations.slice(1).map((station, i) => {
            const from = stations[i]
            const dx = station.x - from.x
            const dy = station.y - from.y
            return (
              <mesh
                key={i}
                position={[from.x + dx / 2, from.y + dy / 2, 0]}
                rotation={[0, 0, Math.atan2(dy, dx)]}
              >
                <boxGeometry args={[Math.hypot(dx, dy), 0.018, 0.006]} />
                <LowPolyMaterial color="steel" />
              </mesh>
            )
          })}
          {stations.map((station, i) => (
            <mesh key={i} position={[station.x, station.y, 0.004]}>
              <boxGeometry args={[0.045, 0.045, 0.01]} />
              <LowPolyMaterial color="steel" />
            </mesh>
          ))}
          <group ref={pins}>
            {stations.map((station, i) => (
              <mesh
                key={i}
                position={[station.x, station.y, 0.03]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <coneGeometry args={[0.05, 0.08, 5]} />
                <LowPolyMaterial color="orange" />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}
