import { lazy, type ComponentType } from 'react'
import type { SectionId } from './sections'

export interface SceneProps {
  id: SectionId
}

export interface SceneEntry {
  component: ComponentType<SceneProps>
  /**
   * Scenes are moved with their section by default. A scene that fills the
   * view out to a horizon cannot be slid off screen, so it sets this and
   * handles its own entrance and exit from `getSection(id).offset`.
   */
  selfPositioned?: boolean
}

// Each section's scene is its own lazily loaded chunk. Scenes read their
// scroll state with `getSection(id)` inside `useFrame`.
const placeholder: SceneEntry = {
  component: lazy(() => import('../sections/placeholder/PlaceholderScene')),
}

export const scenes: Record<SectionId, SceneEntry> = {
  hero: {
    component: lazy(() => import('../sections/hero/Scene')),
    selfPositioned: true,
  },
  bnsf: placeholder,
  'stony-brook': placeholder,
  earlier: placeholder,
  personal: placeholder,
  closing: placeholder,
}
