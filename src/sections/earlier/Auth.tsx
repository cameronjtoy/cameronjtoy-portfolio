import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { lerp } from '../../design/math'
import { Vignette, type VignetteProps } from './shared'

// Develop for Good, beat 1: passwordless sign-in. Emailed links fly to a
// gate, and a grid of verified users fills up. Each square is ten users.

const COLUMNS = 10
const ROWS = 5
const USERS = COLUMNS * ROWS // x10 = 500
const CELL = 0.17
const ENVELOPES = 3
const GATE_X = -0.35

export function Auth(props: VignetteProps) {
  const envelopes = useRef<Group>(null)
  const verified = useRef<Group>(null)

  useFrame(({ clock }) => {
    const beat = props.state.current.beats[props.index]
    const count = Math.round(beat * USERS)
    verified.current?.children.forEach((user, i) => {
      user.visible = i < count
    })

    // Links keep arriving until everyone is verified.
    const sending = beat > 0 && beat < 1
    envelopes.current?.children.forEach((envelope, i) => {
      const u = (clock.elapsedTime * 0.45 + i / ENVELOPES) % 1
      envelope.visible = sending
      envelope.position.set(
        lerp(-1.75, GATE_X - 0.2, u),
        0.15 + Math.sin(u * Math.PI) * 0.45,
        0,
      )
      envelope.scale.setScalar(Math.min(1, (1 - u) * 5, u * 5))
    })
  })

  return (
    <Vignette {...props} rotation={[0.2, -0.35, 0]}>
      <group ref={envelopes}>
        {Array.from({ length: ENVELOPES }, (_, i) => (
          <group key={i}>
            <mesh>
              <boxGeometry args={[0.46, 0.3, 0.04]} />
              <LowPolyMaterial color="white" />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.11, 0.05, 0.024]}
                rotation={[0, 0, side * -0.55]}
              >
                <boxGeometry args={[0.27, 0.022, 0.01]} />
                <LowPolyMaterial color="steel" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Gate */}
      <mesh position={[GATE_X, 0, 0]}>
        <boxGeometry args={[0.22, 1.5, 0.6]} />
        <LowPolyMaterial color="teal" />
      </mesh>
      <mesh position={[GATE_X, 0.2, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.02]} />
        <LowPolyMaterial color="green" />
      </mesh>

      {/* Verified users */}
      <group position={[0.15, -0.34, 0]}>
        {Array.from({ length: USERS }, (_, i) => (
          <mesh key={i} position={cell(i, -0.01)}>
            <boxGeometry args={[CELL * 0.5, CELL * 0.5, 0.02]} />
            <LowPolyMaterial color="steel" />
          </mesh>
        ))}
        <group ref={verified}>
          {Array.from({ length: USERS }, (_, i) => (
            <mesh key={i} position={cell(i, 0.01)}>
              <boxGeometry args={[CELL * 0.8, CELL * 0.8, 0.04]} />
              <LowPolyMaterial color="green" />
            </mesh>
          ))}
        </group>
      </group>
    </Vignette>
  )
}

/** Grid position, filling each row left to right from the bottom up. */
function cell(index: number, z: number): [number, number, number] {
  return [(index % COLUMNS) * CELL, Math.floor(index / COLUMNS) * CELL, z]
}
