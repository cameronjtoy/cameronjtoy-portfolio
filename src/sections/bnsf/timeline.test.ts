import { describe, expect, it } from 'vitest'
import {
  activeCar,
  CAR_COUNT,
  carCenter,
  carProgress,
  trainX,
} from './timeline'

describe('bnsf timeline', () => {
  it('shows no car at the start or the end', () => {
    expect(activeCar(0)).toBe(-1)
    expect(activeCar(1)).toBe(-1)
  })

  it('centres each car at its progress and makes it the active one', () => {
    for (let index = 0; index < CAR_COUNT; index++) {
      const progress = carProgress(index)
      expect(progress).toBeGreaterThan(0)
      expect(progress).toBeLessThan(1)
      expect(trainX(progress) + carCenter(index)).toBeCloseTo(0)
      expect(activeCar(progress)).toBe(index)
    }
  })

  it('steps through the cars in order without gaps between them', () => {
    const seen: number[] = []
    for (let step = 0; step <= 1000; step++) {
      const car = activeCar(step / 1000)
      if (car !== seen.at(-1)) seen.push(car)
    }
    expect(seen).toEqual([-1, 0, 1, 2, 3, 4, -1])
  })
})
