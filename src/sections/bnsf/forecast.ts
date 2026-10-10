import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { seededRandom } from '../../design/random'

export interface Segment {
  x: number
  y: number
  length: number
  angle: number
  /** True for the projected part of the line. */
  forecast: boolean
}

const HISTORY = 15
const FORECAST = 6

/**
 * An illustrative demand series (not real data): noisy history with a trend,
 * then a smooth projection. Returned as line segments laid out to fit a
 * `width` x `height` panel centred on the origin.
 */
export function forecastSegments(width: number, height: number): Segment[] {
  const random = seededRandom(404)
  const values: number[] = []
  for (let i = 0; i < HISTORY; i++) {
    values.push(40 + i * 1.3 + Math.sin(i * 0.9) * 8 + (random() - 0.5) * 7)
  }
  const last = values[HISTORY - 1]
  for (let k = 1; k <= FORECAST; k++) {
    values.push(last + k * 2.4 + Math.sin(k * 0.8) * 2)
  }

  const x = scaleLinear([0, values.length - 1], [-width / 2, width / 2])
  const [min = 0, max = 1] = extent(values)
  const y = scaleLinear([min, max], [-height / 2, height / 2])

  return values.slice(1).map((value, index) => {
    const x0 = x(index)
    const y0 = y(values[index])
    const dx = x(index + 1) - x0
    const dy = y(value) - y0
    return {
      x: x0,
      y: y0,
      length: Math.hypot(dx, dy),
      angle: Math.atan2(dy, dx),
      forecast: index + 1 >= HISTORY,
    }
  })
}
