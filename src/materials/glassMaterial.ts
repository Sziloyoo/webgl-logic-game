import { float, normalMap, texture, uniform } from 'three/tsl'
import { MeshPhysicalNodeMaterial, type Texture } from 'three/webgpu'

export interface GlassTextures {
  opacity: Texture
  normal: Texture
  /** R: ambient occlusion, G: roughness */
  aorm: Texture
}

/** Transmissive glass that covers the board. */
export function createGlassMaterial({ opacity, normal, aorm }: GlassTextures) {
  const uniforms = {
    transmission: uniform(1.0),
    opacity: uniform(0.9),
    ior: uniform(1.5),
  }

  const aormSample = texture(aorm)

  const material = new MeshPhysicalNodeMaterial({ transparent: true })
  material.name = 'Glass'
  material.transmissionNode = texture(opacity).r.mul(uniforms.transmission)
  material.opacityNode = uniforms.opacity
  material.normalNode = normalMap(texture(normal))
  material.aoNode = aormSample.r
  material.roughnessNode = aormSample.g
  material.metalnessNode = float(0)
  material.iorNode = uniforms.ior

  return { material, uniforms }
}
