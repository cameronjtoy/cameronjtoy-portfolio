// Minimal types for the parts of d3-force-3d this project uses. The package
// ships none of its own.
declare module 'd3-force-3d' {
  export interface SimNode {
    x?: number
    y?: number
    z?: number
  }

  export interface SimLink<N extends SimNode> {
    source: number | N
    target: number | N
  }

  interface Force {
    strength(strength: number | ((node: never) => number)): this
  }

  interface LinkForce<N extends SimNode> extends Force {
    links(links: SimLink<N>[]): this
    distance(distance: number): this
  }

  interface PositionForce<N extends SimNode> extends Force {
    x(x: number | ((node: N) => number)): this
  }

  export interface Simulation<N extends SimNode> {
    force(name: string, force: unknown): this
    alpha(): number
    alpha(alpha: number): this
    stop(): this
    tick(iterations?: number): this
    nodes(): N[]
  }

  export function forceSimulation<N extends SimNode>(
    nodes: N[],
    dimensions?: 1 | 2 | 3,
  ): Simulation<N>
  export function forceManyBody(): Force
  export function forceCenter(): Force
  export function forceLink<N extends SimNode>(
    links?: SimLink<N>[],
  ): LinkForce<N>
  export function forceX<N extends SimNode>(x?: number): PositionForce<N>
}
