import type { Experience } from '../../content/resume'
import { useSectionValue } from '../../engine/scroll'
import { StepEntry } from '../StepEntry'
import { cars } from './cars'
import { activeCar } from './timeline'

/** The BNSF entry: each highlight shows while its rail car is passing. */
export function BnsfSection({ entry }: { entry: Experience }) {
  const active = useSectionValue('bnsf', (section) =>
    activeCar(section.progress),
  )
  return <StepEntry entry={entry} active={active} metrics={cars} />
}
