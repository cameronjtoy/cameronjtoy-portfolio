import type { Experience } from '../../content/resume'
import { useSectionValue } from '../../engine/scroll'
import { StepEntry } from '../StepEntry'
import { activeBeat } from './timeline'

/** The Stony Brook entry: each highlight shows during its beat of the scene. */
export function StonyBrookSection({ entry }: { entry: Experience }) {
  const active = useSectionValue('stony-brook', (section) =>
    activeBeat(section.progress),
  )
  return <StepEntry entry={entry} active={active} />
}
