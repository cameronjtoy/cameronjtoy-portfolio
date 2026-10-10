import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { clamp01, smooth } from '../../design/math'
import { histogramBars } from './data'
import { BeforeAfter, ChartPanel, Vignette, type VignetteProps } from './shared'

// University at Buffalo, beat 2: the data profiler. A column's histogram
// rises bar by bar, and the processing-time bar underneath drops by 20%.

const CHART = { width: 2.8, height: 1.15, base: -0.4 }

export function Profiler(props: VignetteProps) {
  const columns = useRef<Group>(null)
  const bars = useMemo(() => histogramBars(CHART.width, CHART.height), [])

  useFrame(() => {
    const beat = props.state.current.beats[props.index]
    columns.current?.children.forEach((column, i) => {
      // Bars start in turn and overlap, so the shape sweeps in.
      const grown = smooth(clamp01(beat * (bars.length + 3) * 0.25 - i * 0.25))
      column.scale.y = Math.max(grown, 0.001)
    })
  })

  return (
    <Vignette {...props} rotation={[0.08, -0.3, 0]}>
      <ChartPanel>
        <mesh position={[0, CHART.base - 0.012, 0]}>
          <boxGeometry args={[CHART.width + 0.1, 0.024, 0.012]} />
          <LowPolyMaterial color="steel" />
        </mesh>
        <group ref={columns} position={[0, CHART.base, 0]}>
          {bars.map((bar) => (
            // Each bar grows up from the axis.
            <group key={bar.x} position={[bar.x, 0, 0]}>
              <mesh position={[0, bar.height / 2, 0.02]}>
                <boxGeometry args={[bar.width, bar.height, 0.05]} />
                <LowPolyMaterial color="teal" />
              </mesh>
            </group>
          ))}
        </group>
        <BeforeAfter {...props} saving={0.2} color="amber" />
      </ChartPanel>
    </Vignette>
  )
}
