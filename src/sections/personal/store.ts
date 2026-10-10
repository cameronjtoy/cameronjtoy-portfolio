import { useSyncExternalStore } from 'react'
import { seededRandom } from '../../design/random'
import {
  buildChain,
  firstBroken,
  tamper,
  type Block,
} from '../../sim/hashchain'
import {
  createCluster,
  currentLeader,
  heal,
  kill,
  partition,
  revive,
  step,
} from '../../sim/raft'

// State for the two interactive demos. It lives outside React so the 3D
// scene can advance and draw it every frame while the DOM shows a summary
// and offers the controls.

// --- Cluster ---------------------------------------------------------------

export const CLUSTER_SIZE = 5
export const cluster = createCluster(CLUSTER_SIZE, seededRandom(3))

export interface ClusterStatus {
  term: number
  /** Node id, or -1 while there is no leader. */
  leader: number
  committed: number
  alive: number
  split: boolean
}

function readStatus(): ClusterStatus {
  const leader = currentLeader(cluster)
  return {
    term: Math.max(...cluster.nodes.map((node) => node.term)),
    leader: leader?.id ?? -1,
    committed: Math.max(...cluster.nodes.map((node) => node.commitCount)),
    alive: cluster.nodes.filter((node) => node.alive).length,
    split: cluster.groups !== null,
  }
}

let status = readStatus()
const statusListeners = new Set<() => void>()

/** Publishes a new status object only when something in it changed. */
function refreshStatus() {
  const next = readStatus()
  const keys = Object.keys(next) as (keyof ClusterStatus)[]
  if (keys.every((key) => next[key] === status[key])) return
  status = next
  for (const listener of statusListeners) listener()
}

export function advanceCluster(ticks: number) {
  for (let i = 0; i < ticks; i++) step(cluster)
  refreshStatus()
}

export const clusterActions = {
  stopLeader() {
    const leader = currentLeader(cluster)
    if (leader) kill(cluster, leader.id)
    refreshStatus()
  },
  toggleNode(id: number) {
    if (cluster.nodes[id].alive) kill(cluster, id)
    else revive(cluster, id)
    refreshStatus()
  },
  /** Cuts the leader off with one follower, leaving a majority of three. */
  split() {
    const leader = currentLeader(cluster)?.id ?? 0
    partition(cluster, [leader, (leader + 1) % CLUSTER_SIZE])
    refreshStatus()
  },
  restore() {
    heal(cluster)
    for (const node of cluster.nodes) revive(cluster, node.id)
    refreshStatus()
  },
}

export function useClusterStatus() {
  return useSyncExternalStore(
    (listener) => {
      statusListeners.add(listener)
      return () => statusListeners.delete(listener)
    },
    () => status,
  )
}

// --- Hash chain ------------------------------------------------------------

const RECORDS = ['sample prep', 'run 1', 'run 2', 'analysis', 'sign-off']
const intact = buildChain(RECORDS)

export interface ChainState {
  chain: Block[]
  /** The record that was edited, or -1. */
  edited: number
  /** The first record that fails verification, or -1. */
  broken: number
}

let chainState: ChainState = { chain: intact, edited: -1, broken: -1 }
const chainListeners = new Set<() => void>()

function setChain(next: ChainState) {
  chainState = next
  for (const listener of chainListeners) listener()
}

export const chainActions = {
  /**
   * Edits one record. The last record is skipped: with nothing after it,
   * there is no later link to give the edit away.
   */
  edit(index?: number) {
    const editable = RECORDS.length - 1
    const target = index ?? (chainState.edited + 1) % editable
    if (target >= editable) return
    const chain = tamper(intact, target, `${RECORDS[target]} (edited)`)
    setChain({ chain, edited: target, broken: firstBroken(chain) })
  },
  restore() {
    setChain({ chain: intact, edited: -1, broken: -1 })
  },
}

export function useChain() {
  return useSyncExternalStore(
    (listener) => {
      chainListeners.add(listener)
      return () => chainListeners.delete(listener)
    },
    () => chainState,
  )
}
