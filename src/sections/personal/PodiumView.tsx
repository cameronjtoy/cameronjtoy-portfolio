import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, smooth } from '../../design/math'

// VCT Manager: a five-player team assembles one by one, in front of a podium
// with the third-place step picked out for the hackathon result.

const steps = [
  { x: -0.75, height: 0.75, color: 'steel' }, // 2nd
  { x: 0, height: 1.05, color: 'steel' }, // 1st
  { x: 0.75, height: 0.5, color: 'amber' }, // 3rd
] as const

const players = ['teal', 'blue', 'plum', 'green', 'orange'] as const
const FLOOR = -0.8

export function PodiumView({ progress }: { progress: () => number }) {
  const team = useRef<Group>(null)

  useFrame(() => {
    const joined = progress() * players.length
    team.current?.children.forEach((player, i) => {
      const size = smooth(clamp01(joined - i))
      player.visible = size > 0
      player.scale.setScalar(Math.max(size, 0.001))
    })
  })

  return (
    <group>
      {steps.map((step) => (
        <mesh key={step.x} position={[step.x, FLOOR + step.height / 2, -0.3]}>
          <boxGeometry args={[0.72, step.height, 0.6]} />
          <LowPolyMaterial color={step.color} />
        </mesh>
      ))}
      {/* Marker on the third-place step */}
      <mesh position={[0.75, FLOOR + 0.5 + 0.22, -0.3]}>
        <octahedronGeometry args={[0.2, 0]} />
        <LowPolyMaterial color="orange" />
      </mesh>

      <group ref={team} position={[0, FLOOR, 0.55]}>
        {players.map((color, i) => (
          <group key={color} position={[(i - 2) * 0.5, 0, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.16, 0.5, 6]} />
              <LowPolyMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
              <icosahedronGeometry args={[0.12, 0]} />
              <LowPolyMaterial color={color} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
