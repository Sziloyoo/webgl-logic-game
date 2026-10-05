import { useGLTF, useTexture } from '@react-three/drei'

export const DRACO_PATH = 'draco/'

export const MODELS = {
  ring: 'models/ring.glb',
  socket: 'models/socket.glb',
  laser: 'models/laser.glb',
  blocker: 'models/blocker.glb',
} as const

export const TEXTURES = {
  noise: 'textures/noise.png',
  atlasColor: 'textures/atlas_color.jpg',
  atlasNormal: 'textures/atlas_normal.jpg',
  atlasAORM: 'textures/atlas_AORM.jpg',
  glassOpacity: 'textures/glass_opacity.jpg',
  glassNormal: 'textures/glass_normal.jpg',
  glassAORM: 'textures/glass_AORM.jpg',
} as const

export const ENVIRONMENT_MAP = 'textures/rogland_clear_night_1k.hdr'

/** Starts downloading the game assets, so the levels open faster from the menu. */
export function preloadAssets() {
  Object.values(MODELS).forEach((model) => useGLTF.preload(model, DRACO_PATH))
  useTexture.preload(Object.values(TEXTURES))
}
