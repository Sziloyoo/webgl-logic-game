import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, type ReactNode } from 'react'
import { RepeatWrapping } from 'three/webgpu'
import { TEXTURES } from '../../game/assets'
import { createAtlasMaterial } from '../../materials/atlasMaterial'
import { createGlassMaterial } from '../../materials/glassMaterial'
import { MaterialsContext, type GameMaterials } from '../../materials/MaterialsContext'

/** Loads the textures and builds the materials shared by the scene objects. */
export function MaterialsProvider({ children }: { children: ReactNode }) {
  const textures = useTexture(TEXTURES)

  const materials = useMemo<GameMaterials>(() => {
    // The models are exported from Blender as glTF, which expects non flipped textures
    Object.values(textures).forEach((texture) => {
      texture.flipY = false
      texture.needsUpdate = true
    })
    textures.noise.wrapS = RepeatWrapping
    textures.noise.wrapT = RepeatWrapping

    const atlas = createAtlasMaterial({ color: textures.atlasColor, normal: textures.atlasNormal, aorm: textures.atlasAORM })
    const glass = createGlassMaterial({ opacity: textures.glassOpacity, normal: textures.glassNormal, aorm: textures.glassAORM })

    return { atlas: atlas.material, glass: glass.material, noiseTexture: textures.noise }
  }, [textures])

  useEffect(
    () => () => {
      materials.atlas.dispose()
      materials.glass.dispose()
    },
    [materials],
  )

  return <MaterialsContext value={materials}>{children}</MaterialsContext>
}
