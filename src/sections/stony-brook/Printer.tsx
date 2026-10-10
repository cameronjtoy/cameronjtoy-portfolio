import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, smooth } from '../../design/math'
import type { BeatsRef } from './layout'

// Beat 2, second part: the invoicing service. An invoice feeds out of the
// printer on the desk.

const PRINT_FROM = 0.55 // share of the beat at which printing starts
const SHEET_HEIGHT = 0.36

export function Printer({
  beats,
  position,
}: {
  beats: BeatsRef
  position: [number, number, number]
}) {
  const invoice = useRef<Group>(null)

  useFrame(() => {
    if (!invoice.current) return
    const fed = smooth(
      clamp01((beats.current[2] - PRINT_FROM) / (1 - PRINT_FROM)),
    )
    invoice.current.visible = fed > 0
    invoice.current.position.y = 0.2 - SHEET_HEIGHT / 2 + fed * SHEET_HEIGHT
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.44, 0.22, 0.36]} />
        <LowPolyMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.225, -0.08]}>
        <boxGeometry args={[0.34, 0.012, 0.05]} />
        <LowPolyMaterial color="ink" />
      </mesh>
      <mesh position={[0.15, 0.13, 0.182]}>
        <boxGeometry args={[0.05, 0.03, 0.01]} />
        <LowPolyMaterial color="green" />
      </mesh>
      {/* The sheet rises out of the slot, leaning back a little. */}
      <group position={[0, 0, -0.08]} rotation={[-0.12, 0, 0]}>
        <group ref={invoice}>
          <mesh>
            <boxGeometry args={[0.28, SHEET_HEIGHT, 0.008]} />
            <LowPolyMaterial color="white" />
          </mesh>
          <mesh position={[0, 0.12, 0.006]}>
            <boxGeometry args={[0.22, 0.04, 0.006]} />
            <LowPolyMaterial color="green" />
          </mesh>
          {[0.03, -0.03, -0.09].map((y) => (
            <mesh key={y} position={[-0.03, y, 0.006]}>
              <boxGeometry args={[0.16, 0.018, 0.006]} />
              <LowPolyMaterial color="steel" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
