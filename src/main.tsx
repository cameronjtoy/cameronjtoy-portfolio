import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)

// `?gallery` in development shows the model gallery instead of the site.
// The condition is false in a production build, so none of it ships.
if (
  import.meta.env.DEV &&
  new URLSearchParams(location.search).has('gallery')
) {
  const { Gallery } = await import('./dev/Gallery.tsx')
  root.render(
    <StrictMode>
      <Gallery />
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
