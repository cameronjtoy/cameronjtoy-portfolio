import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Object3D, type InstancedMesh, type MeshBasicMaterial } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { seededRandom } from '../../design/random'
import { getSection } from '../../engine/scroll'
import type { SectionId } from '../../engine/sections'

// The static world the train passes through: a strip of ground, the track,
// and a little lineside scenery. It is kept shallow in depth so the whole
// thing slides on and off screen with the section.

const LENGTH = 70
const SLEEPER_GAP = 0.5
const SLEEPERS = LENGTH / SLEEPER_GAP

const LAMP_ON = '#ff3b30'
const LAMP_OFF = '#4d1a17'

export function Scenery({ id }: { id: SectionId }) {
  const sleepers = useRef<InstancedMesh>(null)
  const lamps = [
    useRef<MeshBasicMaterial>(null),
    useRef<MeshBasicMaterial>(null),
  ]

  const trees = useMemo(() => {
    const random = seededRandom(25)
    return Array.from({ length: 16 }, () => ({
      x: (random() - 0.5) * 40,
      z: -1.5 - random() * 1.2,
      scale: 0.6 + random() * 0.6,
    }))
  }, [])

  useLayoutEffect(() => {
    const mesh = sleepers.current
    if (!mesh) return
    const dummy = new Object3D()
    for (let i = 0; i < SLEEPERS; i++) {
      dummy.position.set(-LENGTH / 2 + i * SLEEPER_GAP, -0.05, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  useFrame(({ clock }) => {
    // The crossing lamps alternate while the train is going by.
    const { progress } = getSection(id)
    const passing = progress > 0 && progress < 1
    const phase = Math.floor(clock.elapsedTime * 2) % 2
    lamps.forEach((lamp, i) => {
      lamp.current?.color.set(passing && phase === i ? LAMP_ON : LAMP_OFF)
    })
  })

  return (
    <group>
      <mesh position={[0, -0.32, -0.6]}>
        <boxGeometry args={[LENGTH, 0.4, 5]} />
        <LowPolyMaterial color="grass" />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[LENGTH, 0.08, 1.2]} />
        <LowPolyMaterial color="gravel" />
      </mesh>
      <instancedMesh ref={sleepers} args={[undefined, undefined, SLEEPERS]}>
        <boxGeometry args={[0.14, 0.04, 0.9]} />
        <LowPolyMaterial color="wood" />
      </instancedMesh>
      {[-0.3, 0.3].map((z) => (
        <mesh key={z} position={[0, -0.02, z]}>
          <boxGeometry args={[LENGTH, 0.04, 0.05]} />
          <LowPolyMaterial color="ink" />
        </mesh>
      ))}

      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, -0.12, tree.z]} scale={tree.scale}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.09, 0.12, 0.6, 5]} />
            <LowPolyMaterial color="wood" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.6, 1.7, 6]} />
            <LowPolyMaterial color="pine" />
          </mesh>
        </group>
      ))}

      {/* Crossing signal, behind the track so it never hides a car */}
      <group position={[3.6, -0.12, -1]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
        {[-0.6, 0.6].map((tilt) => (
          <mesh key={tilt} position={[0, 2.1, 0.05]} rotation={[0, 0, tilt]}>
            <boxGeometry args={[0.9, 0.12, 0.03]} />
            <LowPolyMaterial color="white" />
          </mesh>
        ))}
        {[-0.2, 0.2].map((x, i) => (
          <mesh key={x} position={[x, 1.55, 0.06]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshBasicMaterial
              ref={lamps[i]}
              color={LAMP_OFF}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
