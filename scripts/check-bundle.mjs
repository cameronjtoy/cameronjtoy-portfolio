// Fails if a built JavaScript chunk is over its gzipped size budget.
// Run after `npm run build`.
import { readdirSync, readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const KB = 1024
// First matching pattern wins. Sizes are gzipped.
const budgets = [
  // Everything the plain page needs: React, the content and the DOM sections.
  { name: 'entry', pattern: /^index-/, limit: 95 * KB },
  // three.js and React Three Fiber, loaded only for the 3D experience.
  { name: '3D engine', pattern: /^Stage-/, limit: 260 * KB },
  // Any one scene or shared piece.
  { name: 'scene or shared chunk', pattern: /./, limit: 20 * KB },
]

const dir = 'dist/assets'
let failed = false

for (const file of readdirSync(dir).filter((name) => name.endsWith('.js'))) {
  const size = gzipSync(readFileSync(`${dir}/${file}`)).length
  const budget = budgets.find(({ pattern }) => pattern.test(file))
  const over = size > budget.limit
  failed ||= over
  console.log(
    `${over ? 'OVER' : 'ok  '} ${(size / KB).toFixed(1).padStart(7)} kB / ${(budget.limit / KB).toFixed(0).padStart(3)} kB  ${file}  (${budget.name})`,
  )
}

if (failed) {
  console.error('\nA chunk is over its size budget.')
  process.exit(1)
}
