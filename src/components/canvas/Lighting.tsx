import { Environment } from '@react-three/drei'
import { ENVIRONMENT_MAP } from '../../game/assets'

export function Lighting() {
  return (
    <>
      <directionalLight intensity={0.5} position={[-2.6, -2.2, 7.2]} />
      <Environment files={ENVIRONMENT_MAP} environmentIntensity={1.5} />
    </>
  )
}
