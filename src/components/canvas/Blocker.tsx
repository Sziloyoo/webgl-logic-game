import { useGLTF } from '@react-three/drei'
import type { Mesh } from 'three/webgpu'
import { DRACO_PATH, MODELS } from '../../game/assets'
import { ringRadius, slotAngle, slotPosition } from '../../game/constants'
import type { RingId } from '../../game/levels'
import { useMaterials } from '../../materials/MaterialsContext'
import type { ColliderData } from '../../stores/useColliderStore'
import { Collider } from './Collider'

type BlockerModel = { nodes: { blocker: Mesh } }

const COLLIDER_SIZE: [number, number, number] = [0.65 * 1.5, 0.65, 0.65]
const COLLIDER_DATA: ColliderData = { kind: 'blocker' }

interface BlockerProps {
  ring: RingId
  slot: number
}

/** Wall on a ring that stops every laser beam. */
export function Blocker({ ring, slot }: BlockerProps) {
  const { nodes } = useGLTF(MODELS.blocker, DRACO_PATH) as unknown as BlockerModel
  const { atlas } = useMaterials()

  return (
    <group position={slotPosition(slot, ringRadius(ring))} rotation-z={slotAngle(slot) + Math.PI / 2}>
      <mesh geometry={nodes.blocker.geometry} material={atlas} />
      <Collider name={`blocker-${ring}-${slot}`} data={COLLIDER_DATA} size={COLLIDER_SIZE} />
    </group>
  )
}
