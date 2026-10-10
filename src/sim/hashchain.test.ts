import { describe, expect, it } from 'vitest'
import { buildChain, firstBroken, tamper } from './hashchain'

const records = ['sample prep', 'run 1', 'run 2', 'analysis', 'sign-off']

describe('hash chain', () => {
  it('verifies an untouched chain', () => {
    expect(firstBroken(buildChain(records))).toBe(-1)
  })

  it('links each block to the one before it', () => {
    const chain = buildChain(records)
    expect(chain[0].prevHash).toBe(0)
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i].prevHash).toBe(chain[i - 1].hash)
    }
  })

  it.each([0, 1, 2, 3])(
    'breaks at the block after an edited record %i',
    (index) => {
      const chain = buildChain(records)
      const edited = tamper(chain, index, 'edited')
      expect(edited[index].hash).not.toBe(chain[index].hash)
      expect(firstBroken(edited)).toBe(index + 1)
    },
  )

  it('does not change the original chain when tampering', () => {
    const chain = buildChain(records)
    tamper(chain, 2, 'edited')
    expect(firstBroken(chain)).toBe(-1)
  })
})
