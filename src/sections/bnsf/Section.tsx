import type { Experience } from '../../content/resume'
import { useSectionValue } from '../../engine/scroll'
import { cars } from './cars'
import { activeCar } from './timeline'

/**
 * The BNSF experience entry. On the plain page it reads as a normal list of
 * highlights. In the 3D experience each highlight is a card, shown while its
 * rail car is passing.
 */
export function BnsfSection({ entry }: { entry: Experience }) {
  const active = useSectionValue('bnsf', (section) =>
    activeCar(section.progress),
  )

  return (
    <article className="entry bnsf">
      <div className="entry-head">
        <h3>{entry.company}</h3>
        <p className="meta">
          {entry.start} – {entry.end}
        </p>
      </div>
      <p className="role">
        {entry.role}, {entry.team} · {entry.location}
      </p>
      <ul className="bnsf__cars">
        {entry.highlights.map((highlight, index) => (
          <li key={highlight} data-active={index === active || undefined}>
            <p className="bnsf__metric">
              <strong>{cars[index].metric}</strong> {cars[index].label}
            </p>
            <p>{highlight}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}
