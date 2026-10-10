import { useCallback, useSyncExternalStore } from 'react'
import { measure, type Measurement } from './measure'
import { sections, type SectionId } from './sections'

// Scroll state lives outside React. Scenes read `getSection(id)` every frame
// without re-rendering; React only hears about changes to which sections are
// visible and which one is active.

export interface ScrollSnapshot {
  active: SectionId
  visible: readonly SectionId[]
}

const hidden: Measurement = { progress: 0, offset: 0, visible: false }

const elements = new Map<SectionId, HTMLElement>()
const state = new Map<SectionId, Measurement>()
const listeners = new Set<() => void>()

let snapshot: ScrollSnapshot = { active: sections[0].id, visible: [] }
let frame = 0

export function getSection(id: SectionId): Measurement {
  return state.get(id) ?? hidden
}

function update() {
  frame = 0
  const viewport = window.innerHeight
  const visible: SectionId[] = []
  let active = snapshot.active

  for (const { id } of sections) {
    const element = elements.get(id)
    if (!element) {
      state.delete(id)
      continue
    }
    const rect = element.getBoundingClientRect()
    const measured = measure(rect.top, rect.height, viewport)
    state.set(id, measured)
    if (measured.visible) visible.push(id)
    if (rect.top <= viewport / 2 && rect.bottom > viewport / 2) active = id
  }

  const changed =
    active !== snapshot.active ||
    visible.length !== snapshot.visible.length ||
    visible.some((id, index) => id !== snapshot.visible[index])
  if (changed) {
    snapshot = { active, visible }
    for (const listener of listeners) listener()
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}

function registerSection(id: SectionId, element: HTMLElement) {
  if (elements.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  elements.set(id, element)
  // Catches layout changes that move sections without a scroll or resize.
  const observer = new ResizeObserver(schedule)
  observer.observe(element)
  schedule()

  return () => {
    observer.disconnect()
    elements.delete(id)
    if (elements.size === 0) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
    schedule()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Ref callback that tracks an element as the scroll section `id`. */
export function useSectionRef(id: SectionId) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (element) return registerSection(id, element)
    },
    [id],
  )
}

export function useScrollSnapshot(): ScrollSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot)
}
