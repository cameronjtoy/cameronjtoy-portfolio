import type { Project } from '../content/resume'

export function ProjectEntry({ project }: { project: Project }) {
  return (
    <article id={project.id} className="entry">
      <h3>{project.name}</h3>
      <ul className="tags" aria-label="Tech stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <ul>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  )
}
