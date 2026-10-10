import type { Project } from '../../content/resume'
import { useSectionValue } from '../../engine/scroll'
import { ProjectEntry } from '../ProjectEntry'
import {
  chainActions,
  CLUSTER_SIZE,
  clusterActions,
  useChain,
  useClusterStatus,
} from './store'
import { activeBeat } from './timeline'

/**
 * The projects section. In the 3D experience it opens with a live cluster
 * simulation, then shows each project beside its own scene. The plain page
 * lists the projects.
 */
export function PersonalSection({ projects }: { projects: Project[] }) {
  const beat = useSectionValue('personal', (section) =>
    activeBeat(section.progress),
  )
  const current = Math.max(0, beat)

  return (
    <div className="entry-stack">
      <div className="enhanced-only" data-current={current === 0 || undefined}>
        <ClusterPanel active={current === 0} />
      </div>
      {projects.map((project, index) => {
        const isCurrent = current === index + 1
        return (
          <div key={project.id} data-current={isCurrent || undefined}>
            <ProjectEntry project={project}>
              {project.id === 'prem' && <ChainPanel active={isCurrent} />}
            </ProjectEntry>
          </div>
        )
      })}
    </div>
  )
}

function ClusterPanel({ active }: { active: boolean }) {
  const status = useClusterStatus()

  return (
    <article className="entry">
      <h3>Distributed systems</h3>
      <p className="role">
        Five nodes running a simplified Raft: leader election, heartbeats and a
        replicated log. Break it and watch it recover.
      </p>
      <div className="controls">
        <button
          type="button"
          disabled={!active}
          onClick={clusterActions.stopLeader}
        >
          Stop the leader
        </button>
        <button type="button" disabled={!active} onClick={clusterActions.split}>
          Split the network
        </button>
        <button
          type="button"
          disabled={!active}
          onClick={clusterActions.restore}
        >
          Restore
        </button>
      </div>
      <p className="status">
        Term {status.term} ·{' '}
        {status.leader < 0 ? 'no leader' : `leader: node ${status.leader + 1}`}{' '}
        · {status.committed} entries committed · {status.alive} of{' '}
        {CLUSTER_SIZE} nodes up{status.split && ' · network split'}
      </p>
      <p className="status">Click a node to stop or restart it.</p>
    </article>
  )
}

function ChainPanel({ active }: { active: boolean }) {
  const { chain, edited, broken } = useChain()

  return (
    <div className="enhanced-only">
      <div className="controls">
        <button
          type="button"
          disabled={!active}
          onClick={() => chainActions.edit()}
        >
          Edit a record
        </button>
        <button type="button" disabled={!active} onClick={chainActions.restore}>
          Restore
        </button>
      </div>
      <p className="status">
        {broken < 0
          ? `Audit trail: all ${chain.length} records verify.`
          : `Record ${edited + 1} was edited. Records ${broken + 1} to ${chain.length} no longer verify.`}
      </p>
    </div>
  )
}
