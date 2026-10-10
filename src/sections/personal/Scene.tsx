import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { fitSplit } from '../../engine/fit'
import type { SceneProps } from '../../engine/registry'
import { getSection } from '../../engine/scroll'
import { Vignette } from '../../engine/Vignette'
import { ChainView } from './ChainView'
import { ClusterView } from './ClusterView'
import { PodiumView } from './PodiumView'
import { activeBeat, beatProgress } from './timeline'

// Three scenes in one spot, one per beat: the live cluster, Prem's hash
// chain, and VCT Manager's team and podium. The first two are interactive
// and run on their own clock; scrolling only chooses which one is showing.

const FOOTPRINT = 4.4

/**
 * On narrow screens the scene sits under the content. The project briefs are
 * long, so their scenes drop further down the screen by this share of its
 * height, per beat.
 */
const NARROW_DROP = [0, 0.17, 0.1]

export default function PersonalScene({ id }: SceneProps) {
  const root = useRef<Group>(null)
  const shown = useRef(0)

  useFrame(({ viewport }) => {
    shown.current = Math.max(0, activeBeat(getSection(id).progress))
    if (!root.current) return
    const { scale, y } = fitSplit(viewport, FOOTPRINT)
    root.current.scale.setScalar(scale)
    root.current.position.y = y
    const narrow = viewport.aspect <= 1.2
    root.current.children.forEach((slot, beat) => {
      slot.position.y = narrow
        ? (-NARROW_DROP[beat] * viewport.height) / scale
        : 0
    })
  })

  return (
    <group ref={root}>
      <group>
        <Vignette isShown={() => shown.current === 0}>
          <ClusterView isShown={() => shown.current === 0} />
        </Vignette>
      </group>
      <group>
        <Vignette isShown={() => shown.current === 1} rotation={[0.2, -0.3, 0]}>
          <ChainView />
        </Vignette>
      </group>
      <group>
        <Vignette isShown={() => shown.current === 2} rotation={[0.2, -0.4, 0]}>
          <PodiumView
            progress={() => beatProgress(getSection(id).progress, 2)}
          />
        </Vignette>
      </group>
    </group>
  )
}
