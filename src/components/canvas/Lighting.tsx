import { Environment } from '@react-three/drei'
import { useControls } from 'leva'
import { ENVIRONMENT_MAP } from '../../game/assets'

export function Lighting() {
  const { directionalIntensity, environmentIntensity, directionalPosition } = useControls('Lights', {
    directionalIntensity: { value: 0.5, min: 0, max: 2, label: 'Directional Intensity' },
    environmentIntensity: { value: 1.5, min: 0, max: 2, label: 'Environment Intensity' },
    directionalPosition: { value: { x: -2.6, y: -2.2, z: 7.2 }, label: 'Directional Position' },
  })

  return (
    <>
      <directionalLight
        intensity={directionalIntensity}
        position={[directionalPosition.x, directionalPosition.y, directionalPosition.z]}
      />
      <Environment files={ENVIRONMENT_MAP} environmentIntensity={environmentIntensity} />
    </>
  )
}
