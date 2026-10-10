import { describe, expect, it } from 'vitest'
import { measure } from './measure'

const viewport = 1000

describe('measure', () => {
  it('scrolls a tall section in from below before it pins', () => {
    expect(measure(400, 3000, viewport)).toEqual({
      progress: 0,
      offset: 400,
      visible: true,
    })
  })

  it('pins the scene and advances progress while the section covers the viewport', () => {
    expect(measure(0, 3000, viewport)).toEqual({
      progress: 0,
      offset: 0,
      visible: true,
    })
    expect(measure(-1000, 3000, viewport)).toEqual({
      progress: 0.5,
      offset: 0,
      visible: true,
    })
    expect(measure(-2000, 3000, viewport)).toEqual({
      progress: 1,
      offset: 0,
      visible: true,
    })
  })

  it('scrolls the scene out upward after the section ends', () => {
    expect(measure(-2300, 3000, viewport)).toEqual({
      progress: 1,
      offset: -300,
      visible: true,
    })
  })

  it('centres a short section and runs progress from entering to leaving', () => {
    const entering = measure(1000, 500, viewport)
    expect(entering.progress).toBe(0)
    expect(entering.offset).toBe(750)

    const centred = measure(250, 500, viewport)
    expect(centred.progress).toBe(0.5)
    expect(centred.offset).toBe(0)

    expect(measure(-500, 500, viewport).progress).toBe(1)
  })

  it('reports sections beyond the margin as not visible', () => {
    expect(measure(1400, 3000, viewport).visible).toBe(true)
    expect(measure(1600, 3000, viewport).visible).toBe(false)
    expect(measure(-3400, 3000, viewport).visible).toBe(true)
    expect(measure(-3600, 3000, viewport).visible).toBe(false)
  })
})
