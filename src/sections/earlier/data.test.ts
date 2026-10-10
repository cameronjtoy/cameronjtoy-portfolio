import { describe, expect, it } from 'vitest'
import { histogramBars, scatterPoints } from './data'

describe('earlier-section chart data', () => {
  it('lays the histogram out inside its box with the tallest bar full height', () => {
    const bars = histogramBars(3, 1.2)
    expect(bars.length).toBeGreaterThan(6)
    for (const bar of bars) {
      expect(Math.abs(bar.x) + bar.width / 2).toBeLessThanOrEqual(1.5)
      expect(bar.height).toBeGreaterThanOrEqual(0)
      expect(bar.height).toBeLessThanOrEqual(1.2)
    }
    expect(Math.max(...bars.map((bar) => bar.height))).toBeCloseTo(1.2)
  })

  it('keeps scatter points inside their box, left to right', () => {
    const points = scatterPoints(3, 1.2)
    for (const [i, point] of points.entries()) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(1.5)
      expect(Math.abs(point.y)).toBeLessThanOrEqual(0.6)
      if (i > 0) expect(point.x).toBeGreaterThan(points[i - 1].x)
    }
  })
})
