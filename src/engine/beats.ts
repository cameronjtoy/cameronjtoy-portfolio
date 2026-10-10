import { clamp01 } from '../design/math'

/** Scroll progress before the first beat, showing the scene untouched. */
const INTRO = 0.04
const END = 0.97
/** Each beat's animation finishes early so its result holds on screen. */
const PLAY = 0.85

/**
 * Splits a section's scroll progress into `count` equal beats, one per
 * highlight. Both the scene and the DOM use the same functions, so the card
 * on screen always matches what the scene is doing.
 */
export function makeBeats(count: number) {
  const length = (END - INTRO) / count
  return {
    count,
    /** The beat showing at this scroll progress, or -1 during the intro. */
    activeBeat(progress: number) {
      if (progress < INTRO) return -1
      return Math.min(count - 1, Math.floor((progress - INTRO) / length))
    },
    /** How far (0..1) a beat's animation has played. */
    beatProgress(progress: number, beat: number) {
      return clamp01((progress - (INTRO + beat * length)) / (length * PLAY))
    },
  }
}
