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
  children,
}: {
  id: SectionId
  children: ReactNode
}) {
  const ref = useSectionRef(id)
  const label = sections.find((section) => section.id === id)?.label

  return (
    <section ref={ref} id={id} className="scroll-section" aria-label={label}>
      <div className="scroll-section__pin">
        <div className="panel">{children}</div>
      </div>
    </section>
  )
}
