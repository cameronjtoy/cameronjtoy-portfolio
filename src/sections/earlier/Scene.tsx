import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { fitSplit } from '../../engine/fit'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import { Auth } from './Auth'
import { Deploy } from './Deploy'
import { Profiler } from './Profiler'
import { Rendering } from './Rendering'
import type { EarlierState } from './shared'
import { activeBeat, beatProgress, BEATS } from './timeline'

// The two earlier roles as four small vignettes, one per highlight, shown
// one at a time in the same spot (see timeline.ts for the order).

const FOOTPRINT = 4.2

export default function EarlierScene({ id }: SceneProps) {
  const root = useRef<Group>(null)
  const state = useRef<EarlierState>({
    shown: 0,
    beats: Array.from({ length: BEATS }, () => 0),
  })

  useFrame(({ viewport }) => {
    const { progress } = getSection(id)
    // During the intro the first vignette waits in its starting state.
    state.current.shown = Math.max(0, activeBeat(progress))
    for (let beat = 0; beat < BEATS; beat++) {
      state.current.beats[beat] = beatProgress(progress, beat)
    }

    if (!root.current) return
    const { scale, y } = fitSplit(viewport, FOOTPRINT)
    root.current.scale.setScalar(scale)
    root.current.position.y = y
  })

  return (
    <group ref={root}>
      <Deploy state={state} index={0} />
      <Auth state={state} index={1} />
      <Profiler state={state} index={2} />
      <Rendering state={state} index={3} />
    </group>
  )
}
