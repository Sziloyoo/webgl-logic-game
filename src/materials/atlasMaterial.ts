import { normalMap, texture, uniform, vec2 } from 'three/tsl'
import { MeshStandardNodeMaterial, SRGBColorSpace, type Texture } from 'three/webgpu'

export interface AtlasTextures {
  color: Texture
  normal: Texture
  /** R: ambient occlusion, G: roughness, B: metalness */
  aorm: Texture
}

/** Shared PBR material of the metal parts (board, laser bodies, blockers), all of them use one texture atlas. */
export function createAtlasMaterial({ color, normal, aorm }: AtlasTextures) {
  color.colorSpace = SRGBColorSpace

  const uniforms = {
    metalness: uniform(0.6),
    roughness: uniform(0.5),
    normalStrength: uniform(1.0),
    aoIntensity: uniform(1.5),
  }

  const aormSample = texture(aorm)

  const material = new MeshStandardNodeMaterial()
  material.name = 'Atlas'
  material.colorNode = texture(color)
  material.normalNode = normalMap(texture(normal), vec2(uniforms.normalStrength))
  material.aoNode = aormSample.r.sub(1).mul(uniforms.aoIntensity).add(1)
  material.roughnessNode = aormSample.g.mul(uniforms.roughness)
  material.metalnessNode = aormSample.b.mul(uniforms.metalness)

  return { material, uniforms }
}
