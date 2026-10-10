import { describe, expect, it } from 'vitest'
import { seededRandom } from '../design/random'
import {
  createCluster,
  currentLeader,
  heal,
  kill,
  partition,
  revive,
  step,
  type Cluster,
} from './raft'

function run(cluster: Cluster, ticks: number, each?: () => void) {
  for (let i = 0; i < ticks; i++) {
    step(cluster)
    each?.()
  }
}

const leaders = (cluster: Cluster) =>
  cluster.nodes.filter((node) => node.alive && node.role === 'leader')

/** No two nodes may disagree about an entry both consider committed. */
function expectCommittedLogsAgree(cluster: Cluster) {
  for (const a of cluster.nodes) {
    for (const b of cluster.nodes) {
      const shared = Math.min(a.commitCount, b.commitCount)
      expect(a.log.slice(0, shared)).toEqual(b.log.slice(0, shared))
    }
  }
}

describe.each([1, 2, 3, 4, 5])('raft cluster (seed %i)', (seed) => {
  const fresh = () => createCluster(5, seededRandom(seed))

  it('elects exactly one leader', () => {
    const cluster = fresh()
    run(cluster, 400)
    expect(leaders(cluster)).toHaveLength(1)
  })

  it('never has two leaders in the same term', () => {
    const cluster = fresh()
    const leaderByTerm = new Map<number, number>()
    const chaos = seededRandom(seed + 100)
    run(cluster, 6000, () => {
      // Randomly stop and restart nodes and split and heal the network.
      if (cluster.tick % 150 === 0) {
        const id = Math.floor(chaos() * 5)
        if (cluster.nodes[id].alive) kill(cluster, id)
        else revive(cluster, id)
      }
      if (cluster.tick % 400 === 0) {
        if (cluster.groups) heal(cluster)
        else partition(cluster, [Math.floor(chaos() * 5)])
      }
      for (const node of cluster.nodes) {
        if (node.role !== 'leader') continue
        const known = leaderByTerm.get(node.term)
        expect(known ?? node.id).toBe(node.id)
        leaderByTerm.set(node.term, node.id)
      }
      if (cluster.tick % 50 === 0) expectCommittedLogsAgree(cluster)
    })
  })

  it('replicates and commits entries on every node', () => {
    const cluster = fresh()
    run(cluster, 1000)
    const leader = currentLeader(cluster)!
    expect(leader.commitCount).toBeGreaterThan(5)
    for (const node of cluster.nodes) {
      expect(node.commitCount).toBeGreaterThanOrEqual(leader.commitCount - 1)
    }
    expectCommittedLogsAgree(cluster)
  })

  it('replaces a stopped leader with one in a later term', () => {
    const cluster = fresh()
    run(cluster, 400)
    const old = currentLeader(cluster)!
    const oldTerm = old.term
    kill(cluster, old.id)
    run(cluster, 600)
    const next = currentLeader(cluster)!
    expect(next.id).not.toBe(old.id)
    expect(next.term).toBeGreaterThan(oldTerm)
  })

  it('catches a restarted node up on the log', () => {
    const cluster = fresh()
    run(cluster, 400)
    const follower = cluster.nodes.find((node) => node.role === 'follower')!
    kill(cluster, follower.id)
    run(cluster, 800)
    const behind = follower.log.length
    expect(currentLeader(cluster)!.log.length).toBeGreaterThan(behind + 5)

    revive(cluster, follower.id)
    run(cluster, 400)
    const leader = currentLeader(cluster)!
    expect(follower.commitCount).toBeGreaterThanOrEqual(leader.commitCount - 1)
    expectCommittedLogsAgree(cluster)
  })

  it('keeps the majority working through a split and converges after it heals', () => {
    const cluster = fresh()
    run(cluster, 400)
    const old = currentLeader(cluster)!
    const other = cluster.nodes.find((node) => node.id !== old.id)!
    const minority = [old.id, other.id]
    const committedBefore = old.commitCount

    // Cut the leader off with one follower: the minority cannot commit.
    partition(cluster, minority)
    run(cluster, 1000)
    expect(old.commitCount).toBe(committedBefore)
    const majorityLeader = cluster.nodes.find(
      (node) => node.role === 'leader' && !minority.includes(node.id),
    )!
    expect(majorityLeader.term).toBeGreaterThan(old.term)
    expect(majorityLeader.commitCount).toBeGreaterThan(committedBefore + 5)

    heal(cluster)
    run(cluster, 600)
    expect(leaders(cluster)).toHaveLength(1)
    const leader = currentLeader(cluster)!
    for (const node of cluster.nodes) {
      expect(node.commitCount).toBeGreaterThanOrEqual(leader.commitCount - 1)
    }
    expectCommittedLogsAgree(cluster)
  })

  it('is deterministic for a given seed', () => {
    const a = fresh()
    const b = fresh()
    run(a, 800)
    run(b, 800)
    expect(a.nodes).toEqual(b.nodes)
  })
})
