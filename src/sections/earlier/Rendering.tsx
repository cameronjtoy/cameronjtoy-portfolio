import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01 } from '../../design/math'
import { scatterPoints } from './data'
import { BeforeAfter, ChartPanel, Vignette, type VignetteProps } from './shared'

// University at Buffalo, beat 3: visualisation. A chart's points plot, then
// the line joining them draws, and the rendering-time bar drops by 25%.

const CHART = { width: 2.8, height: 1.05, y: 0.22 }
/** Share of the beat spent plotting points; the line takes the rest. */
const POINTS_SHARE = 0.5

export function Rendering(props: VignetteProps) {
  const dots = useRef<Group>(null)
  const line = useRef<Group>(null)
  const points = useMemo(() => scatterPoints(CHART.width, CHART.height), [])

  useFrame(() => {
    const beat = props.state.current.beats[props.index]
    const plotted = clamp01(beat / POINTS_SHARE) * points.length
    dots.current?.children.forEach((dot, i) => {
      const size = clamp01(plotted - i)
      dot.visible = size > 0
      dot.scale.setScalar(Math.max(size, 0.001))
    })
    const drawn =
      clamp01((beat - POINTS_SHARE) / (1 - POINTS_SHARE)) * (points.length - 1)
    line.current?.children.forEach((segment, i) => {
      const part = clamp01(drawn - i)
      segment.visible = part > 0
      segment.scale.x = Math.max(part, 0.001)
    })
  })

  return (
    <Vignette {...props} rotation={[0.08, -0.3, 0]}>
      <ChartPanel>
        <group position={[0, CHART.y, 0]}>
          <group ref={line}>
            {points.slice(1).map((point, i) => {
              const from = points[i]
              const dx = point.x - from.x
              const dy = point.y - from.y
              const length = Math.hypot(dx, dy)
              return (
                // Each segment draws out from its starting point.
                <group
                  key={i}
                  position={[from.x, from.y, 0]}
                  rotation={[0, 0, Math.atan2(dy, dx)]}
                >
                  <mesh position={[length / 2, 0, 0]}>
                    <boxGeometry args={[length, 0.025, 0.012]} />
                    <LowPolyMaterial color="white" />
                  </mesh>
                </group>
              )
            })}
          </group>
          <group ref={dots}>
            {points.map((point) => (
              <mesh key={point.x} position={[point.x, point.y, 0.02]}>
                <boxGeometry args={[0.08, 0.08, 0.03]} />
                <LowPolyMaterial color="blue" />
              </mesh>
            ))}
          </group>
        </group>
        <BeforeAfter {...props} saving={0.25} color="amber" />
      </ChartPanel>
    </Vignette>
  )
}
