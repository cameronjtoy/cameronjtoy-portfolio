import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { MACHINE, ROOM, SLOT_Y } from './layout'

// The fixed parts of the records office: floor, two walls, the desk, the
// transform unit, a storage box and a plant.

const DESK = { x: -1.5, z: -1.15, width: 1.7, depth: 0.8, height: 0.78 }
export const DESK_TOP = DESK.height

export function Room() {
  return (
    <group>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[ROOM.width, 0.16, ROOM.depth]} />
        <LowPolyMaterial color="floor" />
      </mesh>
      <mesh position={[0, ROOM.height / 2, -ROOM.depth / 2 - 0.06]}>
        <boxGeometry args={[ROOM.width + 0.24, ROOM.height, 0.12]} />
        <LowPolyMaterial color="wall" />
      </mesh>
      <mesh position={[-ROOM.width / 2 - 0.06, ROOM.height / 2, 0]}>
        <boxGeometry args={[0.12, ROOM.height, ROOM.depth]} />
        <LowPolyMaterial color="wall" />
      </mesh>

      {/* Desk */}
      <mesh position={[DESK.x, DESK.height - 0.035, DESK.z]}>
        <boxGeometry args={[DESK.width, 0.07, DESK.depth]} />
        <LowPolyMaterial color="wood" />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}:${sz}`}
            position={[
              DESK.x + sx * (DESK.width / 2 - 0.06),
              (DESK.height - 0.07) / 2,
              DESK.z + sz * (DESK.depth / 2 - 0.06),
            ]}
          >
            <boxGeometry args={[0.06, DESK.height - 0.07, 0.06]} />
            <LowPolyMaterial color="graphite" />
          </mesh>
        )),
      )}

      {/* Transform unit, with an inlet on the left and an outlet on the right */}
      <group position={[MACHINE.x, 0, MACHINE.z]}>
        <mesh position={[0, MACHINE.height / 2, 0]}>
          <boxGeometry args={[MACHINE.width, MACHINE.height, MACHINE.depth]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
        <mesh position={[0, MACHINE.height + 0.02, 0]}>
          <boxGeometry
            args={[MACHINE.width + 0.04, 0.04, MACHINE.depth + 0.04]}
          />
          <LowPolyMaterial color="teal" />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (MACHINE.width / 2 + 0.07), SLOT_Y - 0.03, 0]}
          >
            <boxGeometry args={[0.14, 0.03, 0.46]} />
            <LowPolyMaterial color="steel" />
          </mesh>
        ))}
        <mesh position={[0, SLOT_Y, MACHINE.depth / 2 + 0.005]}>
          <boxGeometry args={[0.5, 0.05, 0.01]} />
          <LowPolyMaterial color="ink" />
        </mesh>
      </group>

      {/* Storage box the legacy charts came out of */}
      <mesh position={[-2.0, 0.18, 0.75]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.36, 0.45]} />
        <LowPolyMaterial color="manila" />
      </mesh>

      {/* Plant */}
      <group position={[2.2, 0, 1.2]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.16, 0.12, 0.3, 6]} />
          <LowPolyMaterial color="rust" />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <coneGeometry args={[0.28, 0.8, 5]} />
          <LowPolyMaterial color="pine" />
        </mesh>
      </group>
    </group>
  )
}
