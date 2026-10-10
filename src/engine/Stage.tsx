import { Canvas } from '@react-three/fiber'
import { Lights } from '../design/Lights'
import { quality } from './quality'
import { SceneSlot } from './SceneSlot'
import { useScrollSnapshot } from './scroll'

/** The single fixed canvas behind the page. Only nearby sections' scenes mount. */
export default function Stage() {
  const { visible } = useScrollSnapshot()

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, quality.maxDpr]}
        shadows={quality.shadows}
        gl={{ antialias: quality.antialias, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 35 }}
      >
        <Lights />
        {visible.map((id) => (
          <SceneSlot key={id} id={id} />
        ))}
      </Canvas>
    </div>
  )
}
