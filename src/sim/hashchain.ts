// A tamper-evident record chain, the idea behind Prem's audit trail: each
// record stores a hash of its own content plus the previous record's hash,
// so changing any record breaks every link after it.
//
// The hash is 32-bit FNV-1a. It is fine for showing the mechanism and is not
// cryptographic.

export interface Block {
  data: string
  /** The previous block's hash, as recorded when this block was written. */
  prevHash: number
  hash: number
}

export function fnv1a(text: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

const hashOf = (data: string, prevHash: number) => fnv1a(`${prevHash}:${data}`)

export function buildChain(records: string[]): Block[] {
  const chain: Block[] = []
  for (const data of records) {
    const prevHash = chain.at(-1)?.hash ?? 0
    chain.push({ data, prevHash, hash: hashOf(data, prevHash) })
  }
  return chain
}

/**
 * Rewrites one record and recomputes its own hash, as someone covering their
 * tracks would. Later blocks still hold the old hash, which is what gives the
 * edit away. Returns a new chain.
 */
export function tamper(chain: Block[], index: number, data: string): Block[] {
  return chain.map((block, i) =>
    i === index
      ? { ...block, data, hash: hashOf(data, block.prevHash) }
      : block,
  )
}

/**
 * Index of the first block that fails verification, or -1 if the chain is
 * intact. A block fails if its hash does not match its content, or if it does
 * not point at the hash of the block before it.
 */
export function firstBroken(chain: Block[]): number {
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i]
    const expectedPrev = i === 0 ? 0 : chain[i - 1].hash
    if (block.prevHash !== expectedPrev) return i
    if (block.hash !== hashOf(block.data, block.prevHash)) return i
  }
  return -1
}
