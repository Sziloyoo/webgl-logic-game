import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import type { Mesh } from 'three/webgpu'
import { RING_TUBE_RADIUS, ringRadius, ROTATION_DURATION, SLOT_ANGLE } from '../../game/constants'
import type { RingId, RingLayout } from '../../game/levels'
import { useGameStore } from '../../stores/useGameStore'
import { Blocker } from './Blocker'
import { Laser } from './Laser'

const COLORS = { selected: '#ffea00', idle: '#964b00' }

interface RingProps {
  ring: RingId
  layout: RingLayout
}

/** Rotatable ring, the lasers and blockers placed on it turn together with it. */
export function Ring({ ring, layout }: RingProps) {
  const meshRef = useRef<Mesh>(null)
  const selected = useGameStore((state) => state.selectedRing === ring)
  const steps = useGameStore((state) => state.ringSteps[ring])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const tween = gsap.to(mesh.rotation, {
      z: steps * SLOT_ANGLE,
      duration: ROTATION_DURATION,
      ease: 'power2.inOut',
      overwrite: true,
    })
    return () => {
      tween.kill()
    }
  }, [steps])

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[ringRadius(ring), RING_TUBE_RADIUS, 8, 64]} />
      <meshBasicNodeMaterial color={selected ? COLORS.selected : COLORS.idle} depthWrite={false} />

      {layout.map((object, index) => {
        const slot = index + 1
        if (object === 'laser') return <Laser key={slot} ring={ring} slot={slot} />
        if (object === 'blocker') return <Blocker key={slot} ring={ring} slot={slot} />
        return null
      })}
    </mesh>
  )
}
