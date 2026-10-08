import { texture, uniform, uv, vec2 } from 'three/tsl'
import { AdditiveBlending, Color, FrontSide, MeshBasicNodeMaterial, type Texture } from 'three/webgpu'

export const BEAM_COLORS = {
  idle: new Color(0.6, 0.3, 0),
  socket: new Color(0, 1, 0),
  blocked: new Color(1, 0, 0),
} as const

/** Seconds of (unpaused) play time that scroll the beam textures, advanced by the scene every frame. */
export const beamTime = uniform(0)

/** Scrolling, additive laser beam. The noise texture is tiled along the beam based on its current length. */
export function createLaserMaterial(noise: Texture, length: number) {
  const uniforms = {
    length: uniform(length),
    color: uniform(BEAM_COLORS.idle.clone()),
    speed: uniform(-1.25),
    brightness: uniform(1.0),
  }

  const beamUv = vec2(uv().x, uv().y.mul(uniforms.length).mul(0.35).add(uniforms.speed.mul(beamTime)))
  const noiseSample = texture(noise, beamUv)

  const material = new MeshBasicNodeMaterial({
    transparent: true,
    blending: AdditiveBlending,
    side: FrontSide,
    depthTest: true,
    depthWrite: false,
  })
  material.name = 'Laser'
  material.colorNode = noiseSample.rgb.mul(uniforms.color).mul(uniforms.brightness)
  material.opacityNode = noiseSample.a

  return { material, uniforms }
}
