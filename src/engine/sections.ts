// The scroll sections of the page, in order. Each one owns a DOM section and
// a 3D scene (see registry.ts).
export const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'bnsf', label: 'BNSF' },
  { id: 'stony-brook', label: 'Stony Brook' },
  { id: 'earlier', label: 'Earlier work' },
  { id: 'personal', label: 'Projects' },
  { id: 'closing', label: 'Skills & education' },
] as const

export type SectionId = (typeof sections)[number]['id']
