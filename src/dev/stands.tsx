import { useRef, type ReactNode } from 'react'
import { archOutline } from '../design/geometry'
import {
  Block,
  Capsule,
  Lathe,
  Pine,
  Profile,
  Rock,
  Round,
} from '../design/shapes'
import type { CarProps, TrainMotion } from '../sections/bnsf/parts'
import { Board } from '../sections/stony-brook/Board'
import { Cabinet } from '../sections/stony-brook/Cabinet'
import { CABINET, ROOM } from '../sections/stony-brook/layout'
import { Monitor } from '../sections/stony-brook/Monitor'
import { Papers } from '../sections/stony-brook/Papers'
import { Printer } from '../sections/stony-brook/Printer'
import { DESK_TOP, Room } from '../sections/stony-brook/Room'

// The gallery's display stands: wrappers that pose models for review.

/** A rail vehicle standing still, with its showpiece animation finished. */
export function Parked({
  vehicle: Vehicle,
}: {
  vehicle: (props: CarProps) => ReactNode
}) {
  const motion = useRef<TrainMotion>({ x: 0, reveal: [1] })
  return <Vehicle motion={motion} index={0} />
}

export function Office() {
  // Dashboard up, records filed, nothing merged yet.
  const beats = useRef([1, 0, 0])
  return (
    <group position={[0, -ROOM.height / 2, 0]}>
      <Room />
      <Monitor beats={beats} position={[-1.85, DESK_TOP, -1.3]} />
      <Printer beats={beats} position={[-0.95, DESK_TOP, -1.15]} />
      <Cabinet x={CABINET.x - CABINET.width - 0.06} />
      <Cabinet x={CABINET.x} beats={beats} />
      <Board beats={beats} position={[0.3, 2.1, -ROOM.depth / 2 + 0.02]} />
      <Papers beats={beats} />
    </group>
  )
}

/** Every shape in the kit, side by side. */
export function Kit() {
  return (
    <group>
      <Block
        size={[0.9, 0.6, 0.6]}
        radius={0.06}
        color="orange"
        position={[-2.4, 0, 0]}
      />
      <Round radius={0.35} length={0.7} color="teal" position={[-1.3, 0, 0]} />
      <Round
        radius={[0.38, 0.22]}
        length={0.7}
        color="amber"
        position={[-0.35, 0, 0]}
      />
      <Capsule
        radius={0.28}
        length={0.6}
        axis="x"
        color="graphite"
        position={[0.75, 0, 0]}
      />
      <Profile
        points={archOutline(0.7, 0.9)}
        depth={0.3}
        bevel={0.03}
        color="gravel"
        position={[1.85, -0.45, 0]}
      />
      <Lathe
        points={[
          [0, 0],
          [0.3, 0],
          [0.34, 0.08],
          [0.16, 0.2],
          [0.12, 0.55],
          [0.2, 0.7],
          [0, 0.74],
        ]}
        color="plum"
        position={[2.75, -0.37, 0]}
      />
      <Rock radius={0.42} seed={4} color="steel" position={[-2.2, -1.5, 0]} />
      <Rock
        radius={0.5}
        seed={9}
        detail={2}
        roughness={0.12}
        color="pine"
        position={[-0.9, -1.5, 0]}
      />
      <Pine height={1.4} seed={2} position={[0.5, -2.2, 0]} />
      <Pine height={1.9} seed={5} position={[1.9, -2.2, 0]} />
    </group>
  )
}
