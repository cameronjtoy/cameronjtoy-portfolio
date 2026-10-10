import type { SkillGroup } from '../content/resume'

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="skills">
      {groups.map((group) => (
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
  )
}
