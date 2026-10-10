import type { Resume } from '../../content/resume'
import { useScrollSnapshot } from '../../engine/scroll'
import { SkillTree } from './SkillTree'

/** The last section: skills, education and how to get in touch. */
export function ClosingSection({ resume }: { resume: Resume }) {
  const { active } = useScrollSnapshot()

  return (
    <>
      <h2>Skills</h2>
      <SkillTree groups={resume.skills} drawn={active === 'closing'} />
      <dl className="skills">
        {resume.skills.map((group) => (
          <div key={group.label}>
            <dt>{group.label}</dt>
            <dd>
              <ul className="tags">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <h2>Education</h2>
      {resume.education.map((entry) => (
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

      <footer>
        <h2>Contact</h2>
        <ul className="links">
          {resume.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <p className="contact-note">
          Built with React Three Fiber and D3.{' '}
          <a href={resume.source.href}>{resume.source.label}</a>
        </p>
      </footer>
    </>
  )
}
