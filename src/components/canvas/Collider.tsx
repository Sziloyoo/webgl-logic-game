import { useEffect, useRef, type ReactNode } from 'react'
import type { Mesh } from 'three/webgpu'
import { useColliderStore, type ColliderData } from '../../stores/useColliderStore'
import { useDebugStore } from '../../stores/useDebugStore'

interface ColliderProps {
  name: string
  data: ColliderData
  size: [width: number, height: number, depth: number]
  position?: [x: number, y: number, z: number]
  children?: ReactNode
}

/** Invisible box that stops the laser beams. */
export function Collider({ name, data, size, position, children }: ColliderProps) {
  const meshRef = useRef<Mesh>(null)
  const showColliders = useDebugStore((state) => state.showColliders)

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const { addCollider, removeCollider } = useColliderStore.getState()
    addCollider(mesh)
    return () => removeCollider(mesh)
  }, [])

  // Hidden meshes are still hit by raycasts
  return (
    <mesh ref={meshRef} name={name} userData={data} position={position} visible={showColliders}>
      <boxGeometry args={size} />
      <meshBasicNodeMaterial color="#00ff00" wireframe />
      {children}
    </mesh>
  )
}
