import { bin, max } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { seededRandom } from '../../design/random'

// Illustrative data for the two University at Buffalo charts. None of it is
// real; it only gives the charts a plausible shape.

export interface Bar {
  x: number // centre
  width: number
  height: number
}

/** A bell-shaped column profile, binned with D3, to fit `width` x `height`. */
export function histogramBars(width: number, height: number): Bar[] {
  const random = seededRandom(20)
  const samples = Array.from(
    { length: 400 },
    () => (random() + random() + random()) / 3,
  )
  const bins = bin().domain([0, 1]).thresholds(12)(samples)

  const x = scaleLinear([0, 1], [-width / 2, width / 2])
  const y = scaleLinear([0, max(bins, (b) => b.length) ?? 1], [0, height])

  return bins.map((b) => {
    const x0 = x(b.x0 ?? 0)
    const x1 = x(b.x1 ?? 1)
    return { x: (x0 + x1) / 2, width: (x1 - x0) * 0.82, height: y(b.length) }
  })
}

export interface Point {
  x: number
  y: number
}

/** A rising, noisy scatter to fit `width` x `height`, centred on the origin. */
export function scatterPoints(width: number, height: number): Point[] {
  const random = seededRandom(25)
  const count = 22
  const x = scaleLinear([0, count - 1], [-width / 2, width / 2])
  const y = scaleLinear([0, 1], [-height / 2, height / 2])
  return Array.from({ length: count }, (_, i) => {
    const trend = 0.15 + (i / (count - 1)) * 0.6
    return { x: x(i), y: y(trend + (random() - 0.5) * 0.3) }
  })
}
