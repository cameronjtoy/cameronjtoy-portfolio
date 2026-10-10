// A small Raft-style consensus simulation: leader election, heartbeats and
// log replication over a lossy network. It is a pure, deterministic state
// machine advanced one tick at a time, so it can be unit tested and drawn.
//
// It follows the Raft paper's rules for terms, voting and log matching, and
// leaves out what a visual demo does not need: persistence, snapshots,
// membership changes and client request handling.

export type Role = 'follower' | 'candidate' | 'leader'

export interface Entry {
  term: number
  value: number
}

export interface RaftNode {
  id: number
  alive: boolean
  role: Role
  term: number
  votedFor: number | null
  log: Entry[]
  /** How many entries from the start of the log are committed. */
  commitCount: number
  electionTimer: number
  heartbeatTimer: number
  /** Votes received in the current term, while a candidate. */
  votes: number
  /** Leader only: per peer, how many entries it is assumed to hold. */
  nextCount: number[]
  /** Leader only: per peer, how many entries are known to match. */
  matchCount: number[]
}

interface Envelope {
  from: number
  to: number
  term: number
  sentAt: number
  arriveAt: number
}

export type Message = Envelope &
  (
    | { type: 'requestVote'; logCount: number; lastTerm: number }
    | { type: 'vote'; granted: boolean }
    | {
        type: 'append'
        prevCount: number
        prevTerm: number
        entries: Entry[]
        leaderCommit: number
      }
    | { type: 'appendAck'; success: boolean; logCount: number }
  )

type Payload = Message extends infer M
  ? M extends Message
    ? Omit<M, 'from' | 'to' | 'term' | 'sentAt' | 'arriveAt'>
    : never
  : never

export interface Cluster {
  nodes: RaftNode[]
  /** Messages in flight. */
  messages: Message[]
  tick: number
  /** A group number per node while the network is split, otherwise null. */
  groups: number[] | null
  random: () => number
  nextValue: number
}

// All durations are in ticks.
export const LATENCY = 8
const HEARTBEAT = 15
const ELECTION_MIN = 45
const ELECTION_MAX = 90
/** How often a leader is handed a new entry to replicate. */
const CLIENT_INTERVAL = 40

function electionTimeout(cluster: Cluster) {
  return (
    ELECTION_MIN +
    Math.floor(cluster.random() * (ELECTION_MAX - ELECTION_MIN + 1))
  )
}

export function createCluster(size: number, random: () => number): Cluster {
  const cluster: Cluster = {
    nodes: [],
    messages: [],
    tick: 0,
    groups: null,
    random,
    nextValue: 1,
  }
  for (let id = 0; id < size; id++) {
    cluster.nodes.push({
      id,
      alive: true,
      role: 'follower',
      term: 0,
      votedFor: null,
      log: [],
      commitCount: 0,
      electionTimer: electionTimeout(cluster),
      heartbeatTimer: 0,
      votes: 0,
      nextCount: Array.from({ length: size }, () => 0),
      matchCount: Array.from({ length: size }, () => 0),
    })
  }
  return cluster
}

export function connected(cluster: Cluster, a: number, b: number) {
  return !cluster.groups || cluster.groups[a] === cluster.groups[b]
}

/** The live leader with the highest term, if there is one. */
export function currentLeader(cluster: Cluster): RaftNode | undefined {
  let leader: RaftNode | undefined
  for (const node of cluster.nodes) {
    if (node.alive && node.role === 'leader') {
      if (!leader || node.term > leader.term) leader = node
    }
  }
  return leader
}

export function kill(cluster: Cluster, id: number) {
  const node = cluster.nodes[id]
  node.alive = false
  node.role = 'follower'
}

/** Brings a node back with the term, vote and log it had when it stopped. */
export function revive(cluster: Cluster, id: number) {
  const node = cluster.nodes[id]
  if (node.alive) return
  node.alive = true
  node.role = 'follower'
  node.electionTimer = electionTimeout(cluster)
}

/** Cuts the network so `isolated` nodes can only reach each other. */
export function partition(cluster: Cluster, isolated: number[]) {
  cluster.groups = cluster.nodes.map((node) =>
    isolated.includes(node.id) ? 1 : 0,
  )
}

export function heal(cluster: Cluster) {
  cluster.groups = null
}

function send(cluster: Cluster, from: RaftNode, to: number, payload: Payload) {
  if (!connected(cluster, from.id, to)) return
  cluster.messages.push({
    ...payload,
    from: from.id,
    to,
    term: from.term,
    sentAt: cluster.tick,
    arriveAt: cluster.tick + LATENCY,
  } as Message)
}

function broadcast(
  cluster: Cluster,
  from: RaftNode,
  payload: (to: number) => Payload,
) {
  for (const peer of cluster.nodes) {
    if (peer.id !== from.id) send(cluster, from, peer.id, payload(peer.id))
  }
}

const lastTerm = (node: RaftNode) => node.log.at(-1)?.term ?? 0
const majority = (cluster: Cluster) => Math.floor(cluster.nodes.length / 2) + 1

function startElection(cluster: Cluster, node: RaftNode) {
  node.term++
  node.role = 'candidate'
  node.votedFor = node.id
  node.votes = 1
  node.electionTimer = electionTimeout(cluster)
  broadcast(cluster, node, () => ({
    type: 'requestVote',
    logCount: node.log.length,
    lastTerm: lastTerm(node),
  }))
}

function sendAppends(cluster: Cluster, leader: RaftNode) {
  leader.heartbeatTimer = HEARTBEAT
  broadcast(cluster, leader, (to) => {
    const prevCount = leader.nextCount[to]
    return {
      type: 'append',
      prevCount,
      prevTerm: prevCount > 0 ? leader.log[prevCount - 1].term : 0,
      entries: leader.log.slice(prevCount),
      leaderCommit: leader.commitCount,
    }
  })
}

function becomeLeader(cluster: Cluster, node: RaftNode) {
  node.role = 'leader'
  node.nextCount.fill(node.log.length)
  node.matchCount.fill(0)
  node.matchCount[node.id] = node.log.length
  sendAppends(cluster, node)
}

/** Commits the longest prefix from the leader's own term held by a majority. */
function advanceCommit(cluster: Cluster, leader: RaftNode) {
  for (let count = leader.log.length; count > leader.commitCount; count--) {
    if (leader.log[count - 1].term !== leader.term) break
    const holders = leader.matchCount.filter((match) => match >= count).length
    if (holders >= majority(cluster)) {
      leader.commitCount = count
      break
    }
  }
}

function receive(cluster: Cluster, node: RaftNode, message: Message) {
  if (message.term > node.term) {
    node.term = message.term
    node.role = 'follower'
    node.votedFor = null
  }

  switch (message.type) {
    case 'requestVote': {
      const upToDate =
        message.lastTerm > lastTerm(node) ||
        (message.lastTerm === lastTerm(node) &&
          message.logCount >= node.log.length)
      const granted =
        message.term === node.term &&
        (node.votedFor === null || node.votedFor === message.from) &&
        upToDate
      if (granted) {
        node.votedFor = message.from
        node.electionTimer = electionTimeout(cluster)
      }
      send(cluster, node, message.from, { type: 'vote', granted })
      break
    }

    case 'vote': {
      if (
        node.role === 'candidate' &&
        message.term === node.term &&
        message.granted
      ) {
        node.votes++
        if (node.votes >= majority(cluster)) becomeLeader(cluster, node)
      }
      break
    }

    case 'append': {
      if (message.term < node.term) {
        send(cluster, node, message.from, {
          type: 'appendAck',
          success: false,
          logCount: node.log.length,
        })
        break
      }
      node.role = 'follower'
      node.electionTimer = electionTimeout(cluster)

      const { prevCount, prevTerm, entries } = message
      const matches =
        node.log.length >= prevCount &&
        (prevCount === 0 || node.log[prevCount - 1].term === prevTerm)
      if (matches) {
        entries.forEach((entry, offset) => {
          const index = prevCount + offset
          // A conflicting entry and everything after it is discarded.
          if (node.log[index] && node.log[index].term !== entry.term) {
            node.log.length = index
          }
          if (!node.log[index]) node.log.push(entry)
        })
        const sent = prevCount + entries.length
        node.commitCount = Math.max(
          node.commitCount,
          Math.min(message.leaderCommit, sent),
        )
      }
      send(cluster, node, message.from, {
        type: 'appendAck',
        success: matches,
        logCount: matches ? prevCount + entries.length : node.log.length,
      })
      break
    }

    case 'appendAck': {
      if (node.role !== 'leader' || message.term !== node.term) break
      const peer = message.from
      if (message.success) {
        node.matchCount[peer] = Math.max(
          node.matchCount[peer],
          message.logCount,
        )
        node.nextCount[peer] = node.matchCount[peer]
        advanceCommit(cluster, node)
      } else {
        // Back up, using the follower's log length as a hint.
        node.nextCount[peer] = Math.max(
          0,
          Math.min(node.nextCount[peer] - 1, message.logCount),
        )
      }
      break
    }
  }
}

/** Advances the cluster by one tick. */
export function step(cluster: Cluster) {
  cluster.tick++

  const arriving: Message[] = []
  cluster.messages = cluster.messages.filter((message) => {
    if (message.arriveAt > cluster.tick) return true
    arriving.push(message)
    return false
  })
  for (const message of arriving) {
    const node = cluster.nodes[message.to]
    // Lost if the receiver is down or was cut off while it was in flight.
    if (node.alive && connected(cluster, message.from, message.to)) {
      receive(cluster, node, message)
    }
  }

  for (const node of cluster.nodes) {
    if (!node.alive) continue
    if (node.role === 'leader') {
      if (--node.heartbeatTimer <= 0) sendAppends(cluster, node)
    } else if (--node.electionTimer <= 0) {
      startElection(cluster, node)
    }
  }

  if (cluster.tick % CLIENT_INTERVAL === 0) {
    // Every leader accepts the write, including a stale one cut off from the
    // majority. Its entry can never commit and is discarded when it rejoins.
    for (const node of cluster.nodes) {
      if (node.alive && node.role === 'leader') {
        node.log.push({ term: node.term, value: cluster.nextValue++ })
        node.matchCount[node.id] = node.log.length
      }
    }
  }
}
