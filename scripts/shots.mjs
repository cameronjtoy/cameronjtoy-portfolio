// Captures a fixed set of screenshots for before/after comparison:
// every gallery model from two angles, and every section of the site at
// several scroll positions on a desktop and a phone-sized screen.
//
//   npm run shots -- before     -> shots/before/*.png
//   npm run shots -- after      -> shots/after/*.png
//
// It starts its own dev server, so nothing else needs to be running.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const label = process.argv[2] ?? 'latest'
const out = `shots/${label}`
const port = 5199
const origin = `http://localhost:${port}`

const sections = [
  'hero',
  'bnsf',
  'stony-brook',
  'earlier',
  'personal',
  'closing',
]
const desktopStops = [0.1, 0.35, 0.6, 0.85]
const phoneStops = [0.35, 0.7]
const angles = [0.6, -0.9]

mkdirSync(out, { recursive: true })

const server = spawn('npx', ['vite', '--port', String(port), '--strictPort'], {
  stdio: 'ignore',
})

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(origin)).ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('The dev server did not start.')
}

async function scrollToSection(page, id, progress) {
  await page.evaluate(
    ([id, progress]) => {
      const section = document.getElementById(id)
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: top + (section.offsetHeight - window.innerHeight) * progress,
        behavior: 'instant',
      })
    },
    [id, progress],
  )
  // Long enough for lazy scenes to load and time-based reveals to settle.
  await page.waitForTimeout(1500)
}

async function captureSite(browser, name, contextOptions, stops) {
  const context = await browser.newContext(contextOptions)
  const page = await context.newPage()
  await page.goto(origin)
  await page.waitForTimeout(1000)
  for (const id of sections) {
    for (const progress of stops) {
      await scrollToSection(page, id, progress)
      const stop = String(Math.round(progress * 100)).padStart(2, '0')
      await page.screenshot({ path: `${out}/${name}-${id}-${stop}.png` })
    }
  }
  await context.close()
}

async function captureGallery(browser) {
  const context = await browser.newContext({
    viewport: { width: 1100, height: 700 },
  })
  const page = await context.newPage()
  await page.goto(`${origin}/?gallery`)
  const links = page.locator('nav a[href^="?gallery="]')
  await links.first().waitFor()
  const ids = await links.evaluateAll((links) =>
    links.map((link) => new URL(link.href).searchParams.get('gallery')),
  )
  for (const id of ids) {
    for (const [index, angle] of angles.entries()) {
      await page.goto(`${origin}/?gallery=${id}&angle=${angle}`)
      await page.waitForTimeout(900)
      await page
        .locator('[data-gallery-view]')
        .screenshot({ path: `${out}/model-${id}-${index + 1}.png` })
    }
  }
  await context.close()
}

try {
  await waitForServer()
  const browser = await chromium.launch()
  await captureGallery(browser)
  await captureSite(
    browser,
    'desktop',
    { viewport: { width: 1280, height: 800 } },
    desktopStops,
  )
  await captureSite(
    browser,
    'phone',
    {
      viewport: { width: 390, height: 780 },
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
    },
    phoneStops,
  )
  await browser.close()
  console.log(`Saved screenshots to ${out}/`)
} finally {
  server.kill()
}
