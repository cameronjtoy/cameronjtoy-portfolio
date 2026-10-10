import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { Lights } from '../design/Lights'
import { models } from './models'

// Development-only page for reviewing models one at a time, away from the
// scrolling site. Open `/?gallery` and pick a model, or link straight to one
// with `/?gallery=locomotive`. Add `&angle=0.6` to hold the turntable at a
// fixed angle (in radians), which is what `npm run shots` does.

const params = new URLSearchParams(location.search)
const fixedAngle = params.has('angle') ? Number(params.get('angle')) : null
const current =
  models.find((model) => model.id === params.get('gallery')) ?? models[0]

function Turntable() {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (group.current && fixedAngle === null) {
      group.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group rotation={[0.22, 0, 0]}>
      <group
        ref={group}
        rotation={[0, fixedAngle ?? 0.6, 0]}
        position={[0, current.y ?? 0, 0]}
        scale={current.scale ?? 1}
      >
        {current.render()}
      </group>
    </group>
  )
}

export function Gallery() {
  return (
    <div style={{ display: 'flex', height: '100vh', maxWidth: 'none' }}>
      <nav
        aria-label="Models"
        style={{
          flex: 'none',
          width: '12rem',
          padding: '1.25rem',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
        }}
      >
        <p className="eyebrow">Model gallery</p>
        <ul style={{ listStyle: 'none', lineHeight: 2 }}>
          {models.map((model) => (
            <li key={model.id}>
              <a
                href={`?gallery=${model.id}`}
                aria-current={model === current ? 'page' : undefined}
                style={{ fontWeight: model === current ? 700 : 400 }}
              >
                {model.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="status">
          <a href="./">Back to the site</a>
        </p>
      </nav>
      <div style={{ flex: 1, minWidth: 0 }} data-gallery-view>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 35 }}>
          <Lights />
          <Turntable />
        </Canvas>
      </div>
    </div>
  )
}
