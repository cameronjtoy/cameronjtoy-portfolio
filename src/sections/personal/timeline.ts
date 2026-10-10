import { makeBeats } from '../../engine/beats'

// Three beats: 0 the cluster, 1 Prem's hash chain, 2 VCT Manager.
export const BEATS = 3
export const { activeBeat, beatProgress } = makeBeats(BEATS)
