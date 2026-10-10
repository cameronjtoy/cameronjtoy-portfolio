import { lazy, type ComponentType } from 'react'
import type { SectionId } from './sections'

export interface SceneProps {
  id: SectionId
}

// Each section's scene is its own lazily loaded chunk. Scenes read their
// scroll state with `getSection(id)` inside `useFrame`.
const placeholder = lazy(
  () => import('../sections/placeholder/PlaceholderScene'),
)

export const scenes: Record<SectionId, ComponentType<SceneProps>> = {
  hero: placeholder,
  bnsf: placeholder,
  'stony-brook': placeholder,
  earlier: placeholder,
  personal: placeholder,
  closing: placeholder,
}
