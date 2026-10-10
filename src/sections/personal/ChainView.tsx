import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import type { PaletteColor } from '../../design/palette'
import { chainActions, useChain } from './store'

// Prem's audit trail as a chain of record blocks. Each block shows its hash
// as four coloured squares. Editing a record changes its hash, so the next
// block no longer points at it: that link breaks and everything after it
// stops verifying.

const SPACING = 0.82
const BLOCK = 0.56
const hashColors: PaletteColor[] = [
  'teal',
  'blue',
  'plum',
  'green',
  'orange',
  'amber',
  'steel',
  'white',
]

/** Four palette colours picked from a hash, three bits each. */
const fingerprint = (hash: number) =>
  [0, 3, 6, 9].map((shift) => hashColors[(hash >>> shift) & 7])

export function ChainView() {
  const { chain, edited, broken } = useChain()
  const offset = ((chain.length - 1) * SPACING) / 2

  return (
    <group>
      {chain.map((block, index) => {
        const unverified = broken >= 0 && index >= broken
        return (
          <group key={index} position={[index * SPACING - offset, 0, 0]}>
            <mesh
              onClick={(event) => {
                event.stopPropagation()
                chainActions.edit(index)
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = '')}
            >
              <boxGeometry args={[BLOCK, BLOCK, 0.3]} />
              <LowPolyMaterial color={unverified ? 'rust' : 'paper'} />
            </mesh>
            {fingerprint(block.hash).map((color, i) => (
              <mesh
                key={i}
                position={[(i % 2) * 0.16 - 0.08, 0.08 - (i >> 1) * 0.16, 0.16]}
              >
                <boxGeometry args={[0.13, 0.13, 0.02]} />
                <LowPolyMaterial color={color} />
              </mesh>
            ))}
            {index === edited && (
              <mesh position={[0, BLOCK / 2 + 0.1, 0]}>
                <octahedronGeometry args={[0.08, 0]} />
                <LowPolyMaterial color="amber" />
              </mesh>
            )}
            {/* The link back to the previous block */}
            {index > 0 &&
              (index === broken ? (
                [-1, 1].map((half) => (
                  <mesh
                    key={half}
                    position={[-SPACING / 2 + half * 0.07, half * 0.07, 0]}
                    rotation={[0, 0, 0.5]}
                  >
                    <boxGeometry args={[0.1, 0.07, 0.07]} />
                    <LowPolyMaterial color="rust" />
                  </mesh>
                ))
              ) : (
                <mesh position={[-SPACING / 2, 0, 0]}>
                  <boxGeometry args={[SPACING - BLOCK, 0.07, 0.07]} />
                  <LowPolyMaterial color={unverified ? 'rust' : 'steel'} />
                </mesh>
              ))}
          </group>
        )
      })}
    </group>
  )
}
