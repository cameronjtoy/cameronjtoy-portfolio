import { expect, test } from '@playwright/test'

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
