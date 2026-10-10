import type { ReactNode } from 'react'
import type { Project } from '../content/resume'

/** A project as a short product brief: who it is for, what, how, outcome. */
export function ProjectEntry({
  project,
  children,
}: {
  project: Project
  children?: ReactNode
}) {
  return (
    <article id={project.id} className="entry">
      <h3>{project.name}</h3>
      <ul className="tags" aria-label="Tech stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <dl className="brief">
        {project.brief.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.text}</dd>
          </div>
        ))}
      </dl>
      {children}
    </article>
  )
}
