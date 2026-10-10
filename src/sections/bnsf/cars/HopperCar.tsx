import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../../design/LowPolyMaterial'
import { forecastSegments } from '../forecast'
import { CAR_WIDTH, clamp01, DECK_Y } from '../dims'
import { Chassis, type CarProps } from '../parts'
import { CAR_LENGTH } from '../timeline'

// Demand forecasting: a hopper whose side carries a chart. The history line
// draws first, then the projection continues it.

const BODY_HEIGHT = 0.8
const PANEL = { width: 1.7, height: 0.42 }
const LINE = 0.03

export function HopperCar({ motion, index }: CarProps) {
  const line = useRef<Group>(null)
  const segments = useMemo(
    () => forecastSegments(PANEL.width - 0.16, PANEL.height - 0.14),
    [],
  )

  useFrame(() => {
    const drawn = motion.current.reveal[index] * segments.length
    line.current?.children.forEach((segment, i) => {
      const part = clamp01(drawn - i)
      segment.visible = part > 0
      segment.scale.x = Math.max(part, 0.001)
    })
  })

  const side = CAR_WIDTH / 2

  return (
    <group>
      <Chassis length={CAR_LENGTH} motion={motion} />
      <mesh position={[0, DECK_Y + BODY_HEIGHT / 2, 0]}>
        <boxGeometry args={[CAR_LENGTH - 0.1, BODY_HEIGHT, CAR_WIDTH]} />
        <LowPolyMaterial color="steel" />
      </mesh>
      <mesh position={[0, DECK_Y + BODY_HEIGHT, 0]}>
        <boxGeometry args={[CAR_LENGTH - 0.04, 0.06, CAR_WIDTH + 0.06]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      {/* Side ribs either end of the chart panel */}
      {[-1.08, -0.96, 0.96, 1.08].map((x) => (
        <mesh key={x} position={[x, DECK_Y + BODY_HEIGHT / 2, side]}>
          <boxGeometry args={[0.04, BODY_HEIGHT, 0.04]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}
      {/* Load */}
      {[-0.75, -0.2, 0.35, 0.85].map((x, i) => (
        <mesh
          key={x}
          position={[x, DECK_Y + BODY_HEIGHT + 0.02, (i % 2) * 0.1 - 0.05]}
          scale={[1.5, 0.55, 1]}
        >
          <dodecahedronGeometry args={[0.3, 0]} />
          <LowPolyMaterial color="ink" />
        </mesh>
      ))}

      <group position={[0, DECK_Y + BODY_HEIGHT / 2, side + 0.012]}>
        <mesh>
          <boxGeometry args={[PANEL.width, PANEL.height, 0.02]} />
          <LowPolyMaterial color="ink" />
        </mesh>
        <group ref={line} position={[0, 0, 0.02]}>
          {segments.map((segment, i) => (
            <group
              key={i}
              position={[segment.x, segment.y, 0]}
              rotation={[0, 0, segment.angle]}
            >
              <mesh position={[segment.length / 2, 0, 0]}>
                <boxGeometry args={[segment.length + LINE / 2, LINE, 0.012]} />
                <LowPolyMaterial color={segment.forecast ? 'amber' : 'white'} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
