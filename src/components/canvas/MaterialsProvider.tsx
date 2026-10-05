import { useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, type ReactNode } from 'react'
import { RepeatWrapping } from 'three/webgpu'
import { TEXTURES } from '../../game/assets'
import { createAtlasMaterial } from '../../materials/atlasMaterial'
import { createGlassMaterial } from '../../materials/glassMaterial'
import { MaterialsContext, type GameMaterials } from '../../materials/MaterialsContext'

/** Loads the textures and builds the materials shared by the scene objects. */
export function MaterialsProvider({ children }: { children: ReactNode }) {
  const textures = useTexture(TEXTURES)

  const { atlas, glass, materials } = useMemo(() => {
    // The models are exported from Blender as glTF, which expects non flipped textures
    Object.values(textures).forEach((texture) => {
      texture.flipY = false
      texture.needsUpdate = true
    })
    textures.noise.wrapS = RepeatWrapping
    textures.noise.wrapT = RepeatWrapping

    const atlas = createAtlasMaterial({ color: textures.atlasColor, normal: textures.atlasNormal, aorm: textures.atlasAORM })
    const glass = createGlassMaterial({ opacity: textures.glassOpacity, normal: textures.glassNormal, aorm: textures.glassAORM })
    const materials: GameMaterials = { atlas: atlas.material, glass: glass.material, noiseTexture: textures.noise }

    return { atlas, glass, materials }
  }, [textures])

  useEffect(
    () => () => {
      atlas.material.dispose()
      glass.material.dispose()
    },
    [atlas, glass],
  )

  const { metalness, roughness, normalStrength, aoIntensity } = useControls('Atlas Material', {
    metalness: { value: atlas.uniforms.metalness.value, min: 0, max: 1, label: 'Metalness' },
    roughness: { value: atlas.uniforms.roughness.value, min: 0, max: 1, label: 'Roughness' },
    normalStrength: { value: atlas.uniforms.normalStrength.value, min: 1, max: 3, label: 'Normal Strength' },
    aoIntensity: { value: atlas.uniforms.aoIntensity.value, min: 0, max: 2, label: 'AO Intensity' },
  })

  const { transmission, opacity, ior } = useControls('Glass Material', {
    transmission: { value: glass.uniforms.transmission.value, min: 0, max: 1, label: 'Transmission' },
    opacity: { value: glass.uniforms.opacity.value, min: 0, max: 1, label: 'Opacity' },
    ior: { value: glass.uniforms.ior.value, min: 1, max: 2.33, label: 'IOR' },
  })

  useEffect(() => {
    atlas.uniforms.metalness.value = metalness
    atlas.uniforms.roughness.value = roughness
    atlas.uniforms.normalStrength.value = normalStrength
    atlas.uniforms.aoIntensity.value = aoIntensity
  }, [atlas, metalness, roughness, normalStrength, aoIntensity])

  useEffect(() => {
    glass.uniforms.transmission.value = transmission
    glass.uniforms.opacity.value = opacity
    glass.uniforms.ior.value = ior
  }, [glass, transmission, opacity, ior])

  return <MaterialsContext value={materials}>{children}</MaterialsContext>
}
