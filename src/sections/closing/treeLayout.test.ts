import { describe, expect, it } from 'vitest'
import { resume } from '../../content/resume'
import { skillTree } from './treeLayout'

describe('skill tree layout', () => {
  const tree = skillTree(resume.skills)
  const skills = resume.skills.flatMap((group) => group.items)

  it('has a root, a node per group and a leaf per skill', () => {
    expect(tree.nodes.filter((node) => node.depth === 0)).toHaveLength(1)
    expect(tree.nodes.filter((node) => node.depth === 1)).toHaveLength(
      resume.skills.length,
    )
    expect(
      tree.nodes.filter((node) => node.depth === 2).map((node) => node.label),
    ).toEqual(skills)
  })

  it('links every node except the root to its parent', () => {
    expect(tree.links).toHaveLength(tree.nodes.length - 1)
    for (const link of tree.links) expect(link.path).toMatch(/^M/)
  })

  it('gives every node a unique id and keeps it inside the drawing', () => {
    expect(new Set(tree.nodes.map((node) => node.id)).size).toBe(
      tree.nodes.length,
    )
    for (const node of tree.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(tree.width)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(tree.height)
    }
  })

  it('puts each skill on its own row', () => {
    const rows = tree.nodes
      .filter((node) => node.depth === 2)
      .map((node) => node.y)
    expect(new Set(rows).size).toBe(skills.length)
  })
})
