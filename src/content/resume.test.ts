import { describe, expect, it } from 'vitest'
import { resume } from './resume'

describe('resume content', () => {
  it('gives every experience and project a unique id', () => {
    const ids = [...resume.experience, ...resume.projects].map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has at least one highlight per experience and project', () => {
    for (const entry of [...resume.experience, ...resume.projects]) {
      expect(entry.highlights.length, entry.id).toBeGreaterThan(0)
    }
  })

  it('does not list a skill twice', () => {
    const items = resume.skills.flatMap((group) => group.items)
    expect(new Set(items).size).toBe(items.length)
  })

  it('uses absolute or mailto links', () => {
    for (const link of resume.links) {
      expect(link.href, link.label).toMatch(/^(https:\/\/|mailto:)/)
    }
  })
})
