import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'

/**
 * One of several mini-scenes that share the same spot. It grows in while
 * `isShown()` is true and shrinks away otherwise.
 */
export function Vignette({
  isShown,
  rotation,
  children,
}: {
  /** Called every frame. */
  isShown: () => boolean
  rotation?: [number, number, number]
  children: ReactNode
}) {
  const group = useRef<Group>(null)
  const size = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    const target = isShown() ? 1 : 0
    size.current += (target - size.current) * Math.min(1, delta * 9)
    group.current.visible = size.current > 0.01
    group.current.scale.setScalar(Math.max(size.current, 0.001))
  })

  return (
    <group ref={group} rotation={rotation} visible={false}>
      {children}
    </group>
  )
}
