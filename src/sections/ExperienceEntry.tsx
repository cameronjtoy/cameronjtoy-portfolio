import type { Experience } from '../content/resume'

export function ExperienceEntry({ entry }: { entry: Experience }) {
  return (
    <article id={entry.id} className="entry">
      <div className="entry-head">
        <h3>{entry.company}</h3>
        <p className="meta">
          {entry.start} – {entry.end}
        </p>
      </div>
      <p className="role">
        {entry.role}, {entry.team} · {entry.location}
      </p>
      <ul>
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  )
}
