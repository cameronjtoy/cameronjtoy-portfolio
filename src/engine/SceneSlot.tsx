import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { Group } from 'three'
import { scenes } from './registry'
import { getSection } from './scroll'
import type { SectionId } from './sections'

// Viewports wider than this aspect ratio put the DOM panel on the left, so the
// scene shifts right to sit beside it rather than behind it.
const WIDE_ASPECT = 1.2

/** Mounts a section's scene and moves it with the section as the page scrolls. */
export function SceneSlot({ id }: { id: SectionId }) {
  const group = useRef<Group>(null)
  const { component: Scene, selfPositioned } = scenes[id]

  useFrame(({ size, viewport }) => {
    if (!group.current || selfPositioned) return
    const { offset } = getSection(id)
    group.current.position.y = -(offset / size.height) * viewport.height
    group.current.position.x =
      viewport.aspect > WIDE_ASPECT ? viewport.width * 0.2 : 0
  })

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <Scene id={id} />
      </Suspense>
    </group>
  )
}
