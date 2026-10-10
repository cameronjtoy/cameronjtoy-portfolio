import type { Education as EducationEntry } from '../content/resume'

export function Education({ entries }: { entries: EducationEntry[] }) {
  return (
    <>
      {entries.map((entry) => (
        <article key={entry.school} className="entry">
          <div className="entry-head">
            <h3>{entry.school}</h3>
            <p className="meta">Graduated {entry.graduated}</p>
          </div>
          <p className="role">
            {entry.degree} · {entry.location}
          </p>
        </article>
      ))}
    </>
  )
}
