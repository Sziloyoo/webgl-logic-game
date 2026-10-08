import { useEffect, useRef } from 'react'
import type { Mesh } from 'three/webgpu'
import { useColliderStore, type ColliderData } from '../../stores/useColliderStore'

interface ColliderProps {
  name: string
  data: ColliderData
  size: [width: number, height: number, depth: number]
  position?: [x: number, y: number, z: number]
}

/** Invisible box that stops the laser beams. */
export function Collider({ name, data, size, position }: ColliderProps) {
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const { addCollider, removeCollider } = useColliderStore.getState()
    addCollider(mesh)
    return () => removeCollider(mesh)
  }, [])

  // Hidden meshes are still hit by raycasts
  return (
    <mesh ref={meshRef} name={name} userData={data} position={position} visible={false}>
      <boxGeometry args={size} />
    </mesh>
  )
}
