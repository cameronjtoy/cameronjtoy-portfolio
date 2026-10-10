import type { Experience } from '../../content/resume'
import { useSectionValue } from '../../engine/scroll'
import { StepEntry } from '../StepEntry'
import { activeBeat, metrics } from './timeline'

/**
 * The two earlier roles share one section. The beats run through the first
 * entry's highlights and then the second's; the entry that owns the current
 * beat is the one showing.
 */
export function EarlierSection({ entries }: { entries: Experience[] }) {
  const beat = useSectionValue('earlier', (section) =>
    activeBeat(section.progress),
  )

  // The beat each entry starts at.
  const starts: number[] = []
  let next = 0
  for (const entry of entries) {
    starts.push(next)
    next += entry.highlights.length
  }
  const current = Math.max(
    0,
    starts.findLastIndex((start) => beat >= start),
  )

  return (
    <div className="entry-stack">
      {entries.map((entry, index) => (
        <div key={entry.id} data-current={index === current || undefined}>
          <StepEntry
            entry={entry}
            active={index === current ? beat - starts[index] : -1}
            metrics={metrics[index]}
          />
        </div>
      ))}
    </div>
  )
}
