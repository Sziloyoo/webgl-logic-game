import { useGLTF } from '@react-three/drei'
import type { Mesh } from 'three/webgpu'
import { DRACO_PATH, MODELS } from '../../game/assets'
import { useMaterials } from '../../materials/MaterialsContext'

type BoardModel = { nodes: { ring: Mesh; glass: Mesh } }

/** The static metal frame of the board with its glass cover. */
export function Board() {
  const { nodes } = useGLTF(MODELS.ring, DRACO_PATH) as unknown as BoardModel
  const { atlas, glass } = useMaterials()

  return (
    <group>
      <mesh geometry={nodes.ring.geometry} material={atlas} />
      <mesh geometry={nodes.glass.geometry} material={glass} />
    </group>
  )
}
