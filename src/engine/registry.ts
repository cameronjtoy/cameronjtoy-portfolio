import { lazy, type ComponentType } from 'react'
import type { SectionId } from './sections'

export interface SceneProps {
  id: SectionId
}

export interface SceneEntry {
  component: ComponentType<SceneProps>
  /**
   * How the engine places the scene.
   * - `beside` (default): moved with its section and, on wide screens,
   *   shifted right to sit next to the content panel.
   * - `centered`: moved with its section and kept in the middle, for sections
   *   whose content sits above the scene instead of beside it.
   * - `self`: left alone. A scene that fills the view out to a horizon cannot
   *   be slid off screen, so it handles its own entrance and exit from
   *   `getSection(id).offset`.
   */
  placement?: 'beside' | 'centered' | 'self'
}

// Each section's scene is its own lazily loaded chunk. Scenes read their
// scroll state with `getSection(id)` inside `useFrame`.
const placeholder: SceneEntry = {
  component: lazy(() => import('../sections/placeholder/PlaceholderScene')),
}

export const scenes: Record<SectionId, SceneEntry> = {
  hero: {
    component: lazy(() => import('../sections/hero/Scene')),
    placement: 'self',
  },
  bnsf: {
    component: lazy(() => import('../sections/bnsf/Scene')),
    placement: 'centered',
  },
  'stony-brook': placeholder,
  earlier: placeholder,
  personal: placeholder,
  closing: placeholder,
}
