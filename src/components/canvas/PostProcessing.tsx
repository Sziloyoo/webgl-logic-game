import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useMemo } from 'react'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { pass } from 'three/tsl'
import { RenderPipeline, type WebGPURenderer } from 'three/webgpu'

/** Bloom on top of the scene, tone mapping and color space conversion are applied by the pipeline output. */
export function PostProcessing() {
  const renderer = useThree((state) => state.gl) as unknown as WebGPURenderer
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)

  const { pipeline, bloomPass } = useMemo(() => {
    const scenePass = pass(scene, camera)
    const sceneColor = scenePass.getTextureNode('output')
    const bloomPass = bloom(sceneColor, 0.25, 0.1, 0.4)

    return { pipeline: new RenderPipeline(renderer, sceneColor.add(bloomPass)), bloomPass }
  }, [renderer, scene, camera])

  useEffect(() => () => pipeline.dispose(), [pipeline])

  const { strength, radius, threshold, exposure } = useControls('Post Processing', {
    strength: { value: 0.25, min: 0, max: 2, label: 'Strength' },
    radius: { value: 0.1, min: 0, max: 1, label: 'Radius' },
    threshold: { value: 0.4, min: 0, max: 1, label: 'Threshold' },
    exposure: { value: 1, min: 0, max: 2, label: 'Exposure' },
  })

  useEffect(() => {
    bloomPass.strength.value = strength
    bloomPass.radius.value = radius
    bloomPass.threshold.value = threshold
  }, [bloomPass, strength, radius, threshold])

  useEffect(() => {
    renderer.toneMappingExposure = exposure
  }, [renderer, exposure])

  // A positive priority takes over the render loop from R3F
  useFrame(() => pipeline.render(), 1)

  return null
}
