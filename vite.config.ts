import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// BASE_PATH is set by the deploy workflow to the GitHub Pages path
// (e.g. /cameronjtoy-portfolio/). Locally the site is served from the root.
const base = process.env.BASE_PATH
  ? `${process.env.BASE_PATH.replace(/\/$/, '')}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    // three.js is one large lazy chunk by nature. scripts/check-bundle.mjs
    // enforces the real size budgets.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // 404.html is what GitHub Pages serves for unknown addresses.
      input: ['index.html', '404.html'],
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
