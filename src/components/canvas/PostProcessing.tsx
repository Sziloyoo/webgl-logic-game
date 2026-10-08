import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { pass } from 'three/tsl'
import { RenderPipeline, type WebGPURenderer } from 'three/webgpu'

const BLOOM = { strength: 0.25, radius: 0.1, threshold: 0.4 }

/** Bloom on top of the scene, tone mapping and color space conversion are applied by the pipeline output. */
export function PostProcessing() {
  const renderer = useThree((state) => state.gl) as unknown as WebGPURenderer
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)

  const pipeline = useMemo(() => {
    const scenePass = pass(scene, camera)
    const sceneColor = scenePass.getTextureNode('output')
    const bloomPass = bloom(sceneColor, BLOOM.strength, BLOOM.radius, BLOOM.threshold)

    return new RenderPipeline(renderer, sceneColor.add(bloomPass))
  }, [renderer, scene, camera])

  useEffect(() => () => pipeline.dispose(), [pipeline])

  // A positive priority takes over the render loop from R3F
  useFrame(() => pipeline.render(), 1)

  return null
}
