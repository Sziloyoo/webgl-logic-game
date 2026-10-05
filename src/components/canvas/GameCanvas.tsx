import { Canvas, extend, useFrame, type GLProps } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three/webgpu'
import { useGameStore } from '../../stores/useGameStore'
import { Board } from './Board'
import { CameraRig } from './CameraRig'
import { DebugHelpers } from './DebugHelpers'
import { Level } from './Level'
import { Lighting } from './Lighting'
import { MaterialsProvider } from './MaterialsProvider'
import { PostProcessing } from './PostProcessing'

// Register the WebGPU build of three (node materials etc.) as JSX elements
extend(THREE as unknown as Parameters<typeof extend>[0])

type DefaultGLProps = Parameters<Extract<GLProps, (props: never) => unknown>>[0]

async function createRenderer({ canvas }: DefaultGLProps) {
  // Falls back to the WebGL 2 backend when WebGPU is not available
  const renderer = new THREE.WebGPURenderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  await renderer.init()
  return renderer
}

/** Keeps every world matrix up to date before the lasers cast their rays. */
function MatrixUpdater() {
  useFrame(({ scene }) => scene.updateMatrixWorld(), -2)
  return null
}

export function GameCanvas() {
  const level = useGameStore((state) => state.level)
  const runId = useGameStore((state) => state.runId)

  return (
    <Canvas
      gl={createRenderer}
      dpr={[1, 2]}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, 24] }}
      // No shadows, R3F's default PCFSoftShadowMap type does not exist in WebGPURenderer
      shadows={{ enabled: false, type: THREE.PCFShadowMap }}
    >
      <color attach="background" args={['#000000']} />
      <MatrixUpdater />
      <CameraRig />
      <PostProcessing />
      <DebugHelpers />

      <Suspense fallback={null}>
        <Lighting />
        <MaterialsProvider>
          <Board />
          {level && <Level key={runId} level={level} />}
        </MaterialsProvider>
      </Suspense>
    </Canvas>
  )
}
