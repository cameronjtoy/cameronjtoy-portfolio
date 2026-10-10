import type { Experience } from '../content/resume'

export interface StepMetric {
  metric: string
  label: string
}

/**
 * An experience entry whose highlights are steps of a scene. On the plain
 * page it reads as a normal list. In the 3D experience each highlight is a
 * card and only the `active` one shows, so the text on screen matches what
 * the scene is doing.
 */
export function StepEntry({
  entry,
  active,
  metrics,
}: {
  entry: Experience
  /** Index of the highlight to show, or -1 for none. */
  active: number
  /** Optional headline number per highlight, in the same order. */
  metrics?: readonly StepMetric[]
}) {
  return (
    <article className="entry">
      <div className="entry-head">
        <h3>{entry.company}</h3>
        <p className="meta">
          {entry.start} – {entry.end}
        </p>
      </div>
      <p className="role">
        {entry.role}, {entry.team} · {entry.location}
      </p>
      <ul className="steps">
        {entry.highlights.map((highlight, index) => (
          <li key={highlight} data-active={index === active || undefined}>
            {metrics && (
              <p className="steps__metric">
                <strong>{metrics[index].metric}</strong> {metrics[index].label}
              </p>
            )}
            <p>{highlight}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}
