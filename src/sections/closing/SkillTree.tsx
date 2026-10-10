import { useMemo, type CSSProperties } from 'react'
import type { SkillGroup } from '../../content/resume'
import { skillTree } from './treeLayout'

/**
 * The skills as a tree, drawn with D3 layouts. Decorative: the same skills
 * are in the list next to it, which is what screen readers get. The branches
 * draw in once `drawn` is set.
 */
export function SkillTree({
  groups,
  drawn,
}: {
  groups: SkillGroup[]
  drawn: boolean
}) {
  const tree = useMemo(() => skillTree(groups), [groups])

  return (
    <svg
      className="skill-tree"
      viewBox={`0 0 ${tree.width} ${tree.height}`}
      data-drawn={drawn || undefined}
      aria-hidden="true"
    >
      {tree.links.map((link, order) => (
        <path
          key={link.id}
          d={link.path}
          pathLength={1}
          style={{ '--order': order } as CSSProperties}
        />
      ))}
      {tree.nodes.map((node, order) => (
        <g
          key={node.id}
          transform={`translate(${node.x},${node.y})`}
          style={{ '--order': order } as CSSProperties}
        >
          <circle r={node.depth === 2 ? 2 : 3.5} />
          {node.depth === 1 && (
            <text
              className="skill-tree__group"
              x={-8}
              dy="-0.5em"
              textAnchor="end"
            >
              {node.label}
            </text>
          )}
          {node.depth === 2 && (
            <text x={8} dy="0.32em">
              {node.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
