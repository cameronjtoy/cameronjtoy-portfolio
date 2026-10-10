import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, lerp, smooth } from '../../design/math'
import { Vignette, type VignetteProps } from './shared'

// Develop for Good, beat 0: the MVP runs on a server (EC2) and its images
// arc across into a storage bucket (S3), one after another.

const SERVER = { x: -1.05, top: 0.45 }
const BUCKET = { x: 0.95, floor: -0.95 }
const tiles = ['teal', 'amber', 'plum', 'blue', 'green', 'orange'] as const

export function Deploy(props: VignetteProps) {
  const uploads = useRef<Group>(null)

  useFrame(() => {
    const sent = props.state.current.beats[props.index] * tiles.length
    uploads.current?.children.forEach((tile, i) => {
      const t = smooth(clamp01(sent - i))
      tile.visible = t > 0
      tile.position.set(
        lerp(SERVER.x, BUCKET.x, t),
        lerp(SERVER.top + 0.2, BUCKET.floor + 0.1 + i * 0.05, t) +
          Math.sin(t * Math.PI) * 0.9,
        0,
      )
      tile.rotation.z = (1 - t) * 0.6 - 0.25
    })
  })

  return (
    <Vignette {...props} rotation={[0.25, -0.45, 0]}>
      {/* Server */}
      <mesh position={[SERVER.x, -0.3, 0]}>
        <boxGeometry args={[0.9, 1.5, 0.7]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      {[0.2, -0.15, -0.5].map((y) => (
        <group key={y} position={[SERVER.x, y, 0.36]}>
          <mesh>
            <boxGeometry args={[0.74, 0.22, 0.02]} />
            <LowPolyMaterial color="ink" />
          </mesh>
          <mesh position={[-0.27, 0, 0.015]}>
            <boxGeometry args={[0.06, 0.06, 0.01]} />
            <LowPolyMaterial color="green" />
          </mesh>
          <mesh position={[0.08, 0, 0.015]}>
            <boxGeometry args={[0.4, 0.03, 0.01]} />
            <LowPolyMaterial color="steel" />
          </mesh>
        </group>
      ))}

      {/* Bucket: four walls and a floor, open at the top */}
      <group position={[BUCKET.x, BUCKET.floor, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.0, 0.04, 0.7]} />
          <LowPolyMaterial color="rust" />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={`x${side}`} position={[side * 0.5, 0.33, 0]}>
            <boxGeometry args={[0.05, 0.66, 0.7]} />
            <LowPolyMaterial color="orange" />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <mesh key={`z${side}`} position={[0, 0.33, side * 0.35]}>
            <boxGeometry args={[1.05, 0.66, 0.05]} />
            <LowPolyMaterial color="orange" />
          </mesh>
        ))}
      </group>

      <group ref={uploads}>
        {tiles.map((color) => (
          <group key={color}>
            <mesh>
              <boxGeometry args={[0.46, 0.34, 0.03]} />
              <LowPolyMaterial color={color} />
            </mesh>
            {/* A sun in the corner, so the tile reads as a picture */}
            <mesh position={[0.12, 0.07, 0.02]}>
              <boxGeometry args={[0.09, 0.09, 0.01]} />
              <LowPolyMaterial color="white" />
            </mesh>
          </group>
        ))}
      </group>
    </Vignette>
  )
}
