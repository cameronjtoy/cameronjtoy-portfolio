import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { MathUtils, Object3D, type Group, type InstancedMesh } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { palette } from '../../design/palette'
import { seededRandom } from '../../design/random'
import { CAMERA_FOV, CAMERA_Z } from '../../engine/camera'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'

// A prairie with a rail line running to the horizon. Scrolling carries the
// viewer along the track toward the BNSF section; a slow drift keeps the
// scene alive at rest.
//
// The scene is self-positioned (see engine/registry.ts). It leaves by
// pitching the world about the camera, which slides everything up the screen
// together. The ground's near edge starts exactly at the bottom of the
// viewport and then tracks the bottom edge of the DOM section.

const EYE_HEIGHT = 2
const NEAR = 4 // distance from the camera to the ground's near edge
const NEAR_Z = CAMERA_Z - NEAR
const FAR = -72 // scenery appears here, too small to notice
const SPAN = NEAR_Z - FAR // ...and wraps back at the ground's near edge
const BACK = FAR - 20 // far edge of the ground, behind the hills
const TRAVEL = 60 // distance covered by scrolling through the section
const DRIFT = 0.5 // units per second while idle
const POLES = 6
const POLE_GAP = SPAN / POLES

const HALF_FOV = MathUtils.degToRad(CAMERA_FOV / 2)
const NEAR_ANGLE = Math.atan(EYE_HEIGHT / NEAR)

interface Tree {
  x: number
  z: number
  scale: number
}

function makeTrees(count: number): Tree[] {
  const random = seededRandom(7)
  return Array.from({ length: count }, () => {
    // Keep a clear corridor around the track and the camera's line of sight.
    const x = random() < 0.5 ? -6 - random() * 28 : 4 + random() * 28
    return { x, z: random() * SPAN, scale: 0.7 + random() * 0.9 }
  })
}

const hills = [
  { x: -66, radius: 22, height: 11, color: 'haze' },
  { x: -38, radius: 18, height: 8, color: 'pine' },
  { x: -12, radius: 24, height: 13, color: 'haze' },
  { x: 14, radius: 16, height: 7, color: 'pine' },
  { x: 38, radius: 22, height: 11, color: 'haze' },
  { x: 66, radius: 20, height: 9, color: 'pine' },
] as const

const wrap = (z: number) => FAR + (((z % SPAN) + SPAN) % SPAN)

/** A strip lying along the track from the ground's near edge to its far edge. */
const alongTrack = {
  length: NEAR_Z - BACK,
  z: (NEAR_Z + BACK) / 2,
}

export default function HeroScene({ id }: SceneProps) {
  const pitch = useRef<Group>(null)
  const world = useRef<Group>(null)
  const track = useRef<Group>(null)
  const sleepers = useRef<InstancedMesh>(null)
  const trees = useRef<Group>(null)
  const poles = useRef<Group>(null)
  const treeData = useMemo(() => makeTrees(36), [])

  useLayoutEffect(() => {
    const mesh = sleepers.current
    if (!mesh) return
    const dummy = new Object3D()
    for (let index = 0; index < SPAN; index++) {
      dummy.position.set(0, 0.04, FAR + 1 + index)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  useFrame(({ clock, size, viewport }) => {
    const { progress, offset } = getSection(id)
    const travel = progress * TRAVEL + clock.elapsedTime * DRIFT

    // Where the ground's near edge should sit on screen: -1 is the bottom of
    // the viewport, +1 the top. It follows the section's bottom edge out.
    const edge = Math.max(-1, -1 - (2 * offset) / size.height)
    if (pitch.current) {
      pitch.current.rotation.x =
        Math.atan(edge * Math.tan(HALF_FOV)) + NEAR_ANGLE
    }
    // Wide screens have the panel on the left, so the track sits to the right.
    if (world.current) {
      world.current.position.x =
        viewport.aspect > 1.2 ? viewport.width * 0.2 : 0
    }

    // Sleepers are one unit apart, so sliding them back a unit is invisible.
    if (track.current) track.current.position.z = (travel % 1) - 1
    trees.current?.children.forEach((tree, index) => {
      tree.position.z = wrap(treeData[index].z + travel)
    })
    poles.current?.children.forEach((pole, index) => {
      pole.position.z = wrap(index * POLE_GAP + travel)
    })
  })

  return (
    <group ref={pitch} position={[0, 0, CAMERA_Z]}>
      <group ref={world} position={[0, -EYE_HEIGHT, -CAMERA_Z]}>
        <mesh position={[0, 120, BACK - 20]}>
          <planeGeometry args={[700, 260]} />
          <meshBasicMaterial color={palette.sky} toneMapped={false} />
        </mesh>
        <mesh position={[-9, 13, BACK - 10]}>
          <icosahedronGeometry args={[4, 0]} />
          <meshBasicMaterial color={palette.amber} toneMapped={false} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, alongTrack.z]}>
          <planeGeometry args={[400, alongTrack.length]} />
          <LowPolyMaterial color="grass" />
        </mesh>

        {hills.map((hill) => (
          <mesh
            key={hill.x}
            position={[hill.x, hill.height / 2 - 0.5, FAR - 14]}
          >
            <coneGeometry args={[hill.radius, hill.height, 6]} />
            <LowPolyMaterial color={hill.color} />
          </mesh>
        ))}

        {/* Ballast and rails are uniform along z, so only the sleepers move. */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, alongTrack.z]}
        >
          <planeGeometry args={[2.2, alongTrack.length]} />
          <LowPolyMaterial color="gravel" />
        </mesh>
        {[-0.5, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.13, alongTrack.z]}>
            <boxGeometry args={[0.07, 0.1, alongTrack.length]} />
            <LowPolyMaterial color="ink" />
          </mesh>
        ))}
        <group ref={track}>
          <instancedMesh ref={sleepers} args={[undefined, undefined, SPAN]}>
            <boxGeometry args={[1.6, 0.08, 0.26]} />
            <LowPolyMaterial color="wood" />
          </instancedMesh>
        </group>

        <group ref={poles}>
          {Array.from({ length: POLES }, (_, index) => (
            <group key={index} position={[2.4, 0, 0]}>
              <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <LowPolyMaterial color="wood" />
              </mesh>
              <mesh position={[0, 2.7, 0]}>
                <boxGeometry args={[0.9, 0.08, 0.08]} />
                <LowPolyMaterial color="wood" />
              </mesh>
            </group>
          ))}
        </group>

        <group ref={trees}>
          {treeData.map((tree, index) => (
            <group key={index} position={[tree.x, 0, 0]} scale={tree.scale}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.12, 0.16, 0.8, 5]} />
                <LowPolyMaterial color="wood" />
              </mesh>
              <mesh position={[0, 1.7, 0]}>
                <coneGeometry args={[0.8, 2.2, 6]} />
                <LowPolyMaterial color="pine" />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
