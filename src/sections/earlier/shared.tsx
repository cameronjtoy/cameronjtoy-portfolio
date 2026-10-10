import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode, type RefObject } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import type { PaletteColor } from '../../design/palette'

/** Per-frame section state, written by the scene and read by its vignettes. */
export interface EarlierState {
  /** The vignette to show. */
  shown: number
  /** 0..1 per beat. */
  beats: number[]
}

export type StateRef = RefObject<EarlierState>

export interface VignetteProps {
  state: StateRef
  index: number
}

/**
 * One beat's mini-scene. All vignettes share the same spot; each grows in
 * when its beat is showing and shrinks away otherwise.
 */
export function Vignette({
  state,
  index,
  rotation,
  children,
}: VignetteProps & {
  rotation: [number, number, number]
  children: ReactNode
}) {
  const group = useRef<Group>(null)
  const size = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    const target = state.current.shown === index ? 1 : 0
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

const PANEL = { width: 3.4, height: 2.3 }

/** The dark card the two charts are drawn on. */
export function ChartPanel({ children }: { children: ReactNode }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[PANEL.width, PANEL.height, 0.06]} />
        <LowPolyMaterial color="ink" />
      </mesh>
      <group position={[0, 0, 0.04]}>{children}</group>
    </group>
  )
}

const COMPARE_WIDTH = 2.8

/**
 * A before/after pair of bars under a chart. The lower bar shrinks by
 * `saving` (0.2 for 20%) as the beat plays.
 */
export function BeforeAfter({
  state,
  index,
  saving,
  color,
}: VignetteProps & { saving: number; color: PaletteColor }) {
  const after = useRef<Group>(null)

  useFrame(() => {
    if (after.current) {
      after.current.scale.x = 1 - saving * state.current.beats[index]
    }
  })

  return (
    <group position={[-COMPARE_WIDTH / 2, -0.72, 0]}>
      <mesh position={[COMPARE_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[COMPARE_WIDTH, 0.09, 0.012]} />
        <LowPolyMaterial color="steel" />
      </mesh>
      {/* Scales from its left edge. */}
      <group ref={after} position={[0, -0.16, 0]}>
        <mesh position={[COMPARE_WIDTH / 2, 0, 0]}>
          <boxGeometry args={[COMPARE_WIDTH, 0.09, 0.012]} />
          <LowPolyMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}
