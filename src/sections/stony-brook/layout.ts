import type { RefObject } from 'react'

// Positions shared between parts of the office. The origin is the centre of
// the floor; y is height above it.

/** 0..1 per beat, written by the scene each frame. See timeline.ts. */
export type BeatsRef = RefObject<number[]>

export const ROOM = { width: 5.2, depth: 3.4, height: 2.6 }

/** The cabinet that receives the transformed records. */
export const CABINET = { x: 1.75, z: -1.25, width: 0.85, depth: 0.7 }
/** Centre height of each drawer, top to bottom. One record category each. */
export const DRAWER_Y = [1.34, 0.82, 0.3]
export const DRAWER_OPEN = 0.42

/** The transform unit: records go in one side and come out the other. */
export const MACHINE = { x: 0.1, z: 0.35, width: 0.9, height: 0.9, depth: 0.6 }
export const SLOT_Y = 0.64

/** One colour per record category, matching the drawer labels. */
export const CATEGORY_COLORS = ['teal', 'amber', 'plum'] as const
