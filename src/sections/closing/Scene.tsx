import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { smooth } from '../../design/math'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import { TankCar } from '../bnsf/cars/TankCar'
import { Locomotive } from '../bnsf/Locomotive'
import type { TrainMotion } from '../bnsf/parts'
import { Scenery } from '../bnsf/Scenery'
import { carCenter, CAR_LENGTH, LOCO_LENGTH } from '../bnsf/timeline'

// The sign-off: the BNSF locomotive from earlier, seen from behind at an
// angle, pulls one car away down the track and into a tunnel as the page
// reaches its end.

const STRIP = 18
const START_X = 3.5
/** Where the tunnel mouth is, and how far in the train runs. */
const PORTAL_X = -3.5
const END_X = -10
const RIDGE = { length: STRIP / 2 + PORTAL_X, radius: 2 }

/** The scene is designed for this much room and shrinks to fit less. */
const FOOTPRINT = 7.5

export default function ClosingScene({ id }: SceneProps) {
  const root = useRef<Group>(null)
  const train = useRef<Group>(null)
  const motion = useRef<TrainMotion>({ x: START_X, reveal: [1] })

  useFrame(({ viewport }) => {
    const x = START_X + (END_X - START_X) * smooth(getSection(id).progress)
    motion.current.x = x

    if (train.current) {
      train.current.position.x = x
      // Each vehicle disappears once it is wholly inside the tunnel.
      const [loco, car] = train.current.children
      loco.visible = x - LOCO_LENGTH / 2 > PORTAL_X - LOCO_LENGTH
      car.visible = x + carCenter(0) - CAR_LENGTH / 2 > PORTAL_X - CAR_LENGTH
    }

    if (root.current) {
      const wide = viewport.aspect > 1.2
      const available = wide ? viewport.width * 0.5 : viewport.width
      root.current.scale.setScalar(Math.min(1, available / FOOTPRINT))
    }
  })

  return (
    <group ref={root} position={[0.4, -0.9, -3]} rotation={[0.3, -1.05, 0]}>
      <Scenery id={id} length={STRIP} />

      {/* The ridge the tunnel runs under, with its portal */}
      <mesh
        position={[PORTAL_X - RIDGE.length / 2, 0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry
          args={[RIDGE.radius, RIDGE.radius, RIDGE.length, 7]}
        />
        <LowPolyMaterial color="pine" />
      </mesh>
      <mesh position={[PORTAL_X + 0.04, 0.95, 0]}>
        <boxGeometry args={[0.12, 1.9, 1.5]} />
        <LowPolyMaterial color="gravel" />
      </mesh>
      <mesh position={[PORTAL_X + 0.08, 0.85, 0]}>
        <boxGeometry args={[0.12, 1.7, 1.1]} />
        <LowPolyMaterial color="ink" />
      </mesh>

      <group ref={train}>
        <group>
          <Locomotive motion={motion} />
        </group>
        <group position={[carCenter(0), 0, 0]}>
          <TankCar motion={motion} index={0} />
        </group>
      </group>
    </group>
  )
}
