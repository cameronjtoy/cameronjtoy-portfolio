import type { ReactNode } from 'react'
import { useSectionRef } from './scroll'
import { sections, type SectionId } from './sections'

/**
 * A page section tied to a 3D scene. In the 3D experience it is tall and pins
 * its content panel while the scene plays; on the plain page it is an ordinary
 * section.
 */
export function ScrollSection({
  id,
  layout = 'beside',
  children,
}: {
  id: SectionId
  /** `stage` puts the content above a full-width scene and scrolls for longer. */
  layout?: 'beside' | 'stage'
  children: ReactNode
}) {
  const ref = useSectionRef(id)
  const label = sections.find((section) => section.id === id)?.label

  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-section scroll-section--${layout}`}
      aria-label={label}
    >
      <div className="scroll-section__pin">
        <div className="panel">{children}</div>
      </div>
    </section>
  )
}
