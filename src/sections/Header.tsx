import type { Resume } from '../content/resume'

export function Header({ resume }: { resume: Resume }) {
  return (
    <header className="site-header">
      <p className="eyebrow">
        {resume.title} · {resume.location}
      </p>
      <h1>{resume.name}</h1>
      <p className="summary">{resume.summary}</p>
      <nav aria-label="Contact">
        <ul className="links">
          {resume.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
