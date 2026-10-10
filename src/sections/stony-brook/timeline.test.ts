import { describe, expect, it } from 'vitest'
import { activeBeat, beatProgress, BEATS } from './timeline'

describe('stony brook timeline', () => {
  it('shows no beat at the very start and holds the last one to the end', () => {
    expect(activeBeat(0)).toBe(-1)
    expect(activeBeat(1)).toBe(BEATS - 1)
  })

  it('steps through the beats in order', () => {
    const seen: number[] = []
    for (let step = 0; step <= 1000; step++) {
      const beat = activeBeat(step / 1000)
      if (beat !== seen.at(-1)) seen.push(beat)
    }
    expect(seen).toEqual([-1, 0, 1, 2])
  })

  it('finishes each beat before the next one starts', () => {
    for (let step = 0; step <= 1000; step++) {
      const progress = step / 1000
      const beat = activeBeat(progress)
      for (let earlier = 0; earlier < beat; earlier++) {
        expect(beatProgress(progress, earlier)).toBe(1)
      }
      for (let later = beat + 1; later < BEATS; later++) {
        expect(beatProgress(progress, later)).toBe(0)
      }
    }
  })
})
