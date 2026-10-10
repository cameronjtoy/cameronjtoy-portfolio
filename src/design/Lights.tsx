/** Shared lighting rig: soft sky fill plus one warm key light for flat-shaded facets. */
export function Lights() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#8d8579', 1.6]} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#fff4e6" />
    </>
  )
}
