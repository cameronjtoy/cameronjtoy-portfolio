import { clamp01 } from '../../design/math'

// The scene plays in three beats, one per resume highlight, in order:
// 0 the dashboard comes up, 1 legacy records are transformed and filed,
// 2 duplicates are merged and an invoice prints.

export const BEATS = 3
/** Scroll progress before the first beat, showing the untouched office. */
const INTRO = 0.04
const BEAT_LENGTH = (0.97 - INTRO) / BEATS
/** Each beat's animation finishes early so its result holds on screen. */
const PLAY = 0.85

/** The beat showing at this scroll progress, or -1 during the intro. */
export function activeBeat(progress: number) {
  if (progress < INTRO) return -1
  return Math.min(BEATS - 1, Math.floor((progress - INTRO) / BEAT_LENGTH))
}

/** How far (0..1) a beat's animation has played. */
export function beatProgress(progress: number, beat: number) {
  const start = INTRO + beat * BEAT_LENGTH
  return clamp01((progress - start) / (BEAT_LENGTH * PLAY))
}
