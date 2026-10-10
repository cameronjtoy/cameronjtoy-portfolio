// Shared car dimensions. Heights are measured up from the top of the rails.

/** Top of a car's underframe, where its body starts. */
export const DECK_Y = 0.46
export const CAR_WIDTH = 0.74

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
