import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import { Board } from './Board'
import { Cabinet } from './Cabinet'
import { CABINET, ROOM } from './layout'
import { Monitor } from './Monitor'
import { Papers } from './Papers'
import { Printer } from './Printer'
import { DESK_TOP, Room } from './Room'
import { BEATS, beatProgress } from './timeline'

// A medical records office, seen as a corner diorama. Scrolling plays the
// Legacy EMR story in three beats (see timeline.ts): the dashboard comes up,
// the paper charts are transformed and filed, then duplicates are merged and
// an invoice prints.

/** Roughly how wide the tilted room appears, used to fit it to the view. */
const FOOTPRINT = 6.6
const MAX_SCALE = 0.85

export default function StonyBrookScene({ id }: SceneProps) {
  const root = useRef<Group>(null)
  const beats = useRef<number[]>(Array.from({ length: BEATS }, () => 0))

  useFrame(({ viewport }) => {
    const { progress } = getSection(id)
    for (let beat = 0; beat < BEATS; beat++) {
      beats.current[beat] = beatProgress(progress, beat)
    }

    if (!root.current) return
    // Wide screens give the scene the half beside the content; narrow ones
    // give it the full width, in the lower part of the screen.
    const wide = viewport.aspect > 1.2
    const available = wide ? viewport.width * 0.5 : viewport.width * 0.96
    const scale = Math.min(MAX_SCALE, available / FOOTPRINT)
    root.current.scale.setScalar(scale)
    root.current.position.y =
      (wide ? 0 : -viewport.height * 0.2) - (ROOM.height / 2) * scale
  })

  return (
    <group ref={root} rotation={[0.3, -0.55, 0]}>
      {/* Fill light from the open side, so the back wall is not in shadow. */}
      <directionalLight position={[-3, 3, 6]} intensity={1.1} />
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
