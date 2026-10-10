import { makeBeats } from '../../engine/beats'

// The scene plays in three beats, one per resume highlight, in order:
// 0 the dashboard comes up, 1 legacy records are transformed and filed,
// 2 duplicates are merged and an invoice prints.

export const BEATS = 3
export const { activeBeat, beatProgress } = makeBeats(BEATS)
