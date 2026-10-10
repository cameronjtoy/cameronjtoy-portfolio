import { Canvas } from '@react-three/fiber'
import { CAMERA_FOV, CAMERA_Z } from './camera'
import { Lights } from '../design/Lights'
import { quality } from './quality'
import { SceneSlot } from './SceneSlot'
import { useScrollSnapshot } from './scroll'

/** The single fixed canvas behind the page. Only nearby sections' scenes mount. */
export default function Stage() {
  const { visible } = useScrollSnapshot()

  return (
    <div className="stage" aria-hidden="true">
      {/* The canvas sits behind the page and ignores the pointer, so scenes
          get their clicks from the page root instead. */}
      <Canvas
        eventSource={document.getElementById('root')!}
        eventPrefix="client"
        dpr={[1, quality.maxDpr]}
        shadows={quality.shadows}
        gl={{ antialias: quality.antialias, alpha: true }}
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
      >
        <Lights />
        {visible.map((id) => (
          <SceneSlot key={id} id={id} />
        ))}
      </Canvas>
    </div>
  )
}
