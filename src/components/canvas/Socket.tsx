import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import type { Mesh } from 'three/webgpu'
import { DRACO_PATH, MODELS } from '../../game/assets'
import { slotAngle, slotPosition, SOCKET_RADIUS, SOCKET_Z_OFFSET } from '../../game/constants'
import type { ColliderData } from '../../stores/useColliderStore'
import { useIsSocketActive } from '../../stores/useGameStore'
import { Collider } from './Collider'

type SocketModel = { nodes: { socket: Mesh } }

const COLLIDER_SIZE: [number, number, number] = [0.3, 0.3, 0.3]
const COLORS = { active: '#00ff00', inactive: '#ff0000' }

/** Target around the board, it turns green while a laser beam hits it. */
export function Socket({ index }: { index: number }) {
  const active = useIsSocketActive(index)
  const { nodes } = useGLTF(MODELS.socket, DRACO_PATH) as unknown as SocketModel
  const colliderData = useMemo<ColliderData>(() => ({ kind: 'socket', socketIndex: index }), [index])

  return (
    <group position={slotPosition(index, SOCKET_RADIUS, SOCKET_Z_OFFSET)} rotation-z={slotAngle(index) + Math.PI / 2}>
      <mesh geometry={nodes.socket.geometry}>
        <meshBasicNodeMaterial color={active ? COLORS.active : COLORS.inactive} />
      </mesh>
      {/* The collider sits on the plane of the lasers */}
      <Collider name={`socket-${index}`} data={colliderData} size={COLLIDER_SIZE} position={[0, 0, -SOCKET_Z_OFFSET]} />
    </group>
  )
}
