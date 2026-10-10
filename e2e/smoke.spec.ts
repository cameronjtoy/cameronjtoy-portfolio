import { expect, test } from '@playwright/test'
import { carProgress } from '../src/sections/bnsf/timeline.ts'

test('renders the resume without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('./')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Cameron Toy' }),
  ).toBeVisible()
  for (const name of ['Experience', 'Projects', 'Skills', 'Education']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible()
  }
  for (const name of [
    'BNSF Railway',
    'Stony Brook Administrative Services, LLC',
    'Prem',
  ]) {
    await expect(page.getByRole('heading', { level: 3, name })).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('has no horizontal scroll at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('./')
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test.describe('3D experience', () => {
  test('shows the canvas and tracks the active section while scrolling', async ({
    page,
  }) => {
    await page.goto('./')
    await expect(page.locator('.stage canvas')).toBeVisible()

    const rail = page.getByRole('navigation', { name: 'Sections' })
    await expect(rail.locator('[aria-current]')).toHaveText('Intro')

    await page.evaluate(() =>
      document.querySelector('#stony-brook')!.scrollIntoView(),
    )
    await expect(rail.locator('[aria-current]')).toHaveText('Stony Brook')
  })

  test('shows the BNSF highlight for the car that is passing', async ({
    page,
  }) => {
    await page.goto('./')
    const active = page.locator('#bnsf .steps li[data-active]')
    await expect(active).toHaveCount(0)

    // Scroll to where the second car (the CRUD framework) is centred.
    await page.evaluate((progress) => {
      const section = document.querySelector<HTMLElement>('#bnsf')!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: top + (section.offsetHeight - window.innerHeight) * progress,
        behavior: 'instant',
      })
    }, carProgress(1))

    await expect(active).toHaveCount(1)
    await expect(active).toContainText('~150')
    await expect(active).toContainText('CRUD framework')
  })

  test('shows the Stony Brook highlight for the current beat', async ({
    page,
  }) => {
    await page.goto('./')
    const active = page.locator('#stony-brook .steps li[data-active]')

    // Halfway through the section is the second beat: transform and file.
    await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>('#stony-brook')!
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: top + (section.offsetHeight - window.innerHeight) * 0.5,
        behavior: 'instant',
      })
    })

    await expect(active).toHaveCount(1)
    await expect(active).toContainText('REST APIs')
  })

  test('switches the earlier-work entry with its beats', async ({ page }) => {
    await page.goto('./')
    const current = page.locator('#earlier .entry-stack > [data-current]')
    const active = page.locator('#earlier .steps li[data-active]')

    const scrollTo = (progress: number) =>
      page.evaluate((progress) => {
        const section = document.querySelector<HTMLElement>('#earlier')!
        const top = section.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: top + (section.offsetHeight - window.innerHeight) * progress,
          behavior: 'instant',
        })
      }, progress)

    // Second of four beats: Develop for Good, passwordless sign-in.
    await scrollTo(0.4)
    await expect(current).toContainText('Develop for Good')
    await expect(active).toContainText('500+')

    // Third beat: University at Buffalo, the data profiler.
    await scrollTo(0.68)
    await expect(current).toContainText('University at Buffalo')
    await expect(active).toHaveCount(1)
    await expect(active).toContainText('20%')
  })
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('falls back to the plain page with all content', async ({ page }) => {
    await page.goto('./')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Cameron Toy' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 3, name: 'BNSF Railway' }),
    ).toBeVisible()
    await expect(page.locator('canvas')).toHaveCount(0)
  })
})
