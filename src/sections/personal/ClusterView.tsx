import { useFrame } from '@react-three/fiber'
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  type SimNode,
} from 'd3-force-3d'
import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Object3D,
  type Group,
  type InstancedMesh,
} from 'three'
import { LowPolyMaterial } from '../../design/LowPolyMaterial'
import { palette } from '../../design/palette'
import { connected, LATENCY, type Message, type Role } from '../../sim/raft'
import { advanceCluster, cluster, CLUSTER_SIZE, clusterActions } from './store'

// The cluster, drawn live. Nodes are placed by a 3D force layout
// (d3-force-3d); splitting the network removes the links between the two
// sides and the layout pulls them apart. Messages travel as small blocks,
// and each node shows the tail of its log underneath.

const TICKS_PER_SECOND = 30
/** The force layout works in its own units; this converts to scene units. */
const LAYOUT_SCALE = 1 / 34
const LINK_DISTANCE = 62
const SPLIT_PULL = 46

const LOG_SLOTS = 8
const MAX_MESSAGES = 96

const roleColors = {
  leader: 'amber',
  candidate: 'plum',
  follower: 'blue',
} as const satisfies Record<Role, string>
const roles = Object.keys(roleColors) as Role[]

const messageColors: Record<Message['type'], Color> = {
  requestVote: new Color(palette.plum),
  vote: new Color(palette.plum),
  append: new Color(palette.teal),
  appendAck: new Color(palette.steel),
}

interface LayoutNode extends SimNode {
  id: number
}

const pairs: [number, number][] = []
for (let a = 0; a < CLUSTER_SIZE; a++) {
  for (let b = a + 1; b < CLUSTER_SIZE; b++) pairs.push([a, b])
}

function makeLayout() {
  const nodes: LayoutNode[] = Array.from({ length: CLUSTER_SIZE }, (_, id) => ({
    id,
  }))
  const links = forceLink<LayoutNode>().distance(LINK_DISTANCE)
  const pull = forceX<LayoutNode>().strength(0)
  const simulation = forceSimulation(nodes, 3)
    .force('charge', forceManyBody().strength(-40))
    .force('center', forceCenter())
    .force('link', links)
    .force('pull', pull)
    .stop()

  let groupsKey = ''
  /** Rebuilds the links and the sideways pull when the split changes. */
  function sync() {
    const key = cluster.groups?.join('') ?? ''
    if (key === groupsKey && simulation.alpha() < 1) return
    groupsKey = key
    links.links(
      pairs
        .filter(([a, b]) => connected(cluster, a, b))
        .map(([source, target]) => ({ source, target })),
    )
    pull
      .x((node) => (cluster.groups?.[node.id] ? SPLIT_PULL : -SPLIT_PULL))
      .strength(cluster.groups ? 0.12 : 0)
    simulation.alpha(0.9)
  }

  sync()
  simulation.tick(200)
  return { nodes, simulation, sync }
}

export function ClusterView({ isShown }: { isShown: () => boolean }) {
  const layout = useMemo(() => makeLayout(), [])
  const spin = useRef<Group>(null)
  const nodes = useRef<Group>(null)
  const messages = useRef<InstancedMesh>(null)
  const pending = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const links = useMemo(() => {
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(pairs.length * 6), 3),
    )
    return geometry
  }, [])

  useLayoutEffect(() => () => links.dispose(), [links])

  useFrame((_, delta) => {
    if (!isShown()) return

    // Advance the simulation in whole ticks; the remainder carries over and
    // positions messages between ticks.
    pending.current += Math.min(delta, 0.1) * TICKS_PER_SECOND
    const ticks = Math.floor(pending.current)
    pending.current -= ticks
    if (ticks > 0) advanceCluster(ticks)

    layout.sync()
    if (layout.simulation.alpha() > 0.02) layout.simulation.tick()
    const at = (id: number, axis: 'x' | 'y' | 'z') =>
      (layout.nodes[id][axis] ?? 0) * LAYOUT_SCALE

    if (spin.current) spin.current.rotation.y += delta * 0.12

    const longest = Math.max(...cluster.nodes.map((node) => node.log.length))
    nodes.current?.children.forEach((group, id) => {
      const node = cluster.nodes[id]
      group.position.set(at(id, 'x'), at(id, 'y'), at(id, 'z'))
      const [body, log] = group.children
      body.scale.setScalar(node.alive ? 1 : 0.7)
      // body children: one mesh per role, a stopped one, and the leader ring
      roles.forEach((role, i) => {
        body.children[i].visible = node.alive && node.role === role
      })
      body.children[roles.length].visible = !node.alive
      body.children[roles.length + 1].visible =
        node.alive && node.role === 'leader'

      // The log tail: the newest entries anywhere in the cluster, so a node
      // that has fallen behind shows a gap on the right.
      log.children.forEach((slot, j) => {
        const index = longest - LOG_SLOTS + j
        const [committed, uncommitted] = slot.children
        const held = index >= 0 && index < node.log.length
        committed.visible = held && index < node.commitCount
        uncommitted.visible = held && index >= node.commitCount
      })
    })

    const position = links.getAttribute('position')
    pairs.forEach(([a, b], i) => {
      const up =
        cluster.nodes[a].alive &&
        cluster.nodes[b].alive &&
        connected(cluster, a, b)
      // A cut link collapses to a point.
      const end = up ? b : a
      position.setXYZ(i * 2, at(a, 'x'), at(a, 'y'), at(a, 'z'))
      position.setXYZ(i * 2 + 1, at(end, 'x'), at(end, 'y'), at(end, 'z'))
    })
    position.needsUpdate = true

    const mesh = messages.current
    if (mesh) {
      const now = cluster.tick + pending.current
      const count = Math.min(cluster.messages.length, MAX_MESSAGES)
      for (let i = 0; i < count; i++) {
        const message = cluster.messages[i]
        const t = Math.min(1, (now - message.sentAt) / LATENCY)
        const { from, to } = message
        dummy.position.set(
          at(from, 'x') + (at(to, 'x') - at(from, 'x')) * t,
          at(from, 'y') + (at(to, 'y') - at(from, 'y')) * t,
          at(from, 'z') + (at(to, 'z') - at(from, 'z')) * t,
        )
        // An append carrying entries is larger than a bare heartbeat.
        const carrying = message.type === 'append' && message.entries.length > 0
        dummy.scale.setScalar(carrying ? 1.6 : 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(i, messageColors[message.type])
      }
      mesh.count = count
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  })

  return (
    <group ref={spin}>
      <lineSegments geometry={links}>
        <lineBasicMaterial color={palette.steel} />
      </lineSegments>

      <group ref={nodes}>
        {cluster.nodes.map((node) => (
          <group key={node.id}>
            <group
              onClick={(event) => {
                event.stopPropagation()
                clusterActions.toggleNode(node.id)
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = '')}
            >
              {roles.map((role) => (
                <mesh key={role}>
                  <icosahedronGeometry args={[0.3, 0]} />
                  <LowPolyMaterial color={roleColors[role]} />
                </mesh>
              ))}
              <mesh>
                <icosahedronGeometry args={[0.3, 0]} />
                <LowPolyMaterial color="graphite" />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.44, 0.035, 5, 16]} />
                <LowPolyMaterial color="amber" />
              </mesh>
            </group>
            <group position={[-((LOG_SLOTS - 1) * 0.09) / 2, -0.52, 0]}>
              {Array.from({ length: LOG_SLOTS }, (_, j) => (
                <group key={j} position={[j * 0.09, 0, 0]}>
                  <mesh>
                    <boxGeometry args={[0.07, 0.07, 0.07]} />
                    <LowPolyMaterial color="green" />
                  </mesh>
                  <mesh>
                    <boxGeometry args={[0.07, 0.07, 0.07]} />
                    <LowPolyMaterial color="white" />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        ))}
      </group>

      <instancedMesh
        ref={messages}
        args={[undefined, undefined, MAX_MESSAGES]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.07, 0.07, 0.07]} />
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
    </group>
  )
}
