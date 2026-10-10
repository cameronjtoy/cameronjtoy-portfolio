import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { palette } from '../../design/palette'
import { CAR_WIDTH, DECK_Y } from './dims'
import { Chassis, type MotionRef } from './parts'
import { LOCO_LENGTH } from './timeline'

// A road diesel in an orange, black and yellow livery, facing left (-x).
// The colours nod to BNSF; no logo or lettering is reproduced.

const HOOD_WIDTH = 0.6

export function Locomotive({ motion }: { motion: MotionRef }) {
  return (
    <group>
      <Chassis length={LOCO_LENGTH} motion={motion} />
      {/* Fuel tank between the trucks */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[1.1, 0.24, 0.5]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      {/* Pilot */}
      <mesh
        position={[-LOCO_LENGTH / 2 - 0.02, 0.2, 0]}
        rotation={[0, 0, 0.35]}
      >
        <boxGeometry args={[0.1, 0.34, CAR_WIDTH]} />
        <LowPolyMaterial color="ink" />
      </mesh>

      {/* Long hood */}
      <mesh position={[0.55, DECK_Y + 0.4, 0]}>
        <boxGeometry args={[2.4, 0.8, HOOD_WIDTH]} />
        <LowPolyMaterial color="orange" />
      </mesh>
      <mesh position={[0.55, DECK_Y + 0.08, 0]}>
        <boxGeometry args={[2.42, 0.16, HOOD_WIDTH + 0.02]} />
        <LowPolyMaterial color="ink" />
      </mesh>
      <mesh position={[0.55, DECK_Y + 0.2, 0]}>
        <boxGeometry args={[2.42, 0.07, HOOD_WIDTH + 0.02]} />
        <LowPolyMaterial color="yellow" />
      </mesh>
      {/* Exhaust and radiator fans */}
      <mesh position={[0.1, DECK_Y + 0.86, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.3]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      {[0.95, 1.35].map((x) => (
        <mesh key={x} position={[x, DECK_Y + 0.83, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 8]} />
          <LowPolyMaterial color="graphite" />
        </mesh>
      ))}

      {/* Cab */}
      <mesh position={[-1.0, DECK_Y + 0.5, 0]}>
        <boxGeometry args={[0.7, 1, CAR_WIDTH]} />
        <LowPolyMaterial color="orange" />
      </mesh>
      <mesh position={[-1.0, DECK_Y + 1.03, 0]}>
        <boxGeometry args={[0.8, 0.06, CAR_WIDTH + 0.06]} />
        <LowPolyMaterial color="ink" />
      </mesh>
      <mesh position={[-1.0, DECK_Y + 0.74, 0]}>
        <boxGeometry args={[0.44, 0.26, CAR_WIDTH + 0.02]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <mesh position={[-1.0, DECK_Y + 0.2, 0]}>
        <boxGeometry args={[0.72, 0.07, CAR_WIDTH + 0.02]} />
        <LowPolyMaterial color="yellow" />
      </mesh>

      {/* Short nose, windscreen and headlight */}
      <mesh position={[-1.56, DECK_Y + 0.3, 0]}>
        <boxGeometry args={[0.44, 0.6, HOOD_WIDTH]} />
        <LowPolyMaterial color="orange" />
      </mesh>
      <mesh position={[-1.56, DECK_Y + 0.2, 0]}>
        <boxGeometry args={[0.46, 0.07, HOOD_WIDTH + 0.02]} />
        <LowPolyMaterial color="yellow" />
      </mesh>
      <mesh position={[-1.36, DECK_Y + 0.76, 0]}>
        <boxGeometry args={[0.04, 0.24, CAR_WIDTH - 0.12]} />
        <LowPolyMaterial color="graphite" />
      </mesh>
      <mesh position={[-1.79, DECK_Y + 0.48, 0]}>
        <boxGeometry args={[0.03, 0.1, 0.2]} />
        <meshBasicMaterial color={palette.yellow} toneMapped={false} />
      </mesh>
    </group>
  )
}
