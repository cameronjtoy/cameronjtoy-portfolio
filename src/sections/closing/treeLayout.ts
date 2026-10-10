import { cluster, hierarchy } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import type { SkillGroup } from '../../content/resume'

// Lays the skills out as a left-to-right tree: a root, one branch per group,
// one leaf per skill. Pure layout; SkillTree.tsx draws it.

export interface TreeNode {
  id: string
  label: string
  /** 0 root, 1 group, 2 skill */
  depth: number
  x: number
  y: number
}

export interface TreeLink {
  id: string
  path: string
}

export interface TreeLayout {
  width: number
  height: number
  nodes: TreeNode[]
  links: TreeLink[]
}

interface Datum {
  name: string
  children?: Datum[]
}

const WIDTH = 420
const ROW = 16
const PADDING = 10
/** Horizontal position of each level. Labels sit left of groups, right of skills. */
const LEVEL_X = [8, 168, 250]

export function skillTree(groups: SkillGroup[]): TreeLayout {
  const root = hierarchy<Datum>({
    name: 'Skills',
    children: groups.map((group) => ({
      name: group.label,
      children: group.items.map((name) => ({ name })),
    })),
  })

  // nodeSize spaces leaves one row apart, with a wider gap between groups.
  const laid = cluster<Datum>().nodeSize([ROW, 0])(root)
  const rows = laid.descendants().map((node) => node.x)
  const top = Math.min(...rows)
  const place = (node: { x: number; depth: number }) => ({
    x: LEVEL_X[node.depth],
    y: node.x - top + PADDING,
  })

  const link = linkHorizontal<unknown, { x: number; y: number }>()
    .x((point) => point.x)
    .y((point) => point.y)

  const idOf = (node: (typeof laid)['parent']) =>
    node
      ? node
          .ancestors()
          .map((ancestor) => ancestor.data.name)
          .reverse()
          .join('/')
      : ''

  return {
    width: WIDTH,
    height: Math.max(...rows) - top + PADDING * 2,
    nodes: laid.descendants().map((node) => ({
      id: idOf(node),
      label: node.data.name,
      depth: node.depth,
      ...place(node),
    })),
    links: laid.links().map(({ source, target }) => ({
      id: idOf(target),
      path: link({ source: place(source), target: place(target) }) ?? '',
    })),
  }
}
