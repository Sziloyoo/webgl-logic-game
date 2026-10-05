import { createContext, use } from 'react'
import type { MeshPhysicalNodeMaterial, MeshStandardNodeMaterial, Texture } from 'three/webgpu'

export interface GameMaterials {
  atlas: MeshStandardNodeMaterial
  glass: MeshPhysicalNodeMaterial
  noiseTexture: Texture
}

export const MaterialsContext = createContext<GameMaterials | null>(null)

export function useMaterials() {
  const materials = use(MaterialsContext)
  if (!materials) throw new Error('useMaterials must be used inside <MaterialsProvider>')
  return materials
}
