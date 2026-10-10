import { useScrollSnapshot } from './scroll'
import { sections } from './sections'

/** Dots at the screen edge showing, and linking to, each section. */
export function NavRail() {
  const { active } = useScrollSnapshot()

  return (
    <nav className="rail" aria-label="Sections">
      <ol>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === active ? 'true' : undefined}
            >
              <span className="rail__label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
