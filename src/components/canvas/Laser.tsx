import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, MeshBasicNodeMaterial, PlaneGeometry, Raycaster, Vector3, type Mesh } from 'three/webgpu'
import { DRACO_PATH, MODELS } from '../../game/assets'
import { laserMaxLength, ringRadius, slotAngle, slotPosition } from '../../game/constants'
import type { RingId } from '../../game/levels'
import { BEAM_COLORS, createLaserMaterial } from '../../materials/laserMaterial'
import { useMaterials } from '../../materials/MaterialsContext'
import { getColliderData, useColliderStore, type ColliderData } from '../../stores/useColliderStore'
import { useGameStore } from '../../stores/useGameStore'
import { Collider } from './Collider'
import { DebugLabel } from './DebugLabel'

type LaserModel = { nodes: { laser_base: Mesh; laser_tip: Mesh } }
type BeamState = keyof typeof BEAM_COLORS

const BEAM_WIDTH = 0.8
const COLLIDER_SIZE: [number, number, number] = [0.75, 0.75, 0.75]
const COLLIDER_DATA: ColliderData = { kind: 'laser' }

/** Colors of the emitter tip, values above 1 make it glow through the bloom pass. */
const TIP_COLORS: Record<BeamState, Color> = {
  idle: new Color(1, 0.4, 0),
  socket: new Color(0, 1, 0),
  blocked: new Color(2, 0, 0),
}

const _origin = new Vector3()
const _direction = new Vector3()

interface LaserProps {
  ring: RingId
  slot: number
}

/** Laser emitter on a ring. It shoots through the center of the board and lights up the socket it reaches. */
export function Laser({ ring, slot }: LaserProps) {
  const id = `laser-${ring}-${slot}`
  const maxLength = laserMaxLength(ring)
  const position = useMemo(() => slotPosition(slot, ringRadius(ring)), [ring, slot])
  const rotationZ = slotAngle(slot) + Math.PI / 2

  const { nodes } = useGLTF(MODELS.laser, DRACO_PATH) as unknown as LaserModel
  const { atlas, noiseTexture } = useMaterials()
  const setLaserTarget = useGameStore((state) => state.setLaserTarget)

  const beam = useMemo(() => {
    const geometry = new PlaneGeometry(BEAM_WIDTH, maxLength)
    geometry.translate(0, maxLength / 2, 0) // Grow the beam from the emitter
    return { geometry, ...createLaserMaterial(noiseTexture, maxLength) }
  }, [noiseTexture, maxLength])
  const tipMaterial = useMemo(() => new MeshBasicNodeMaterial({ color: TIP_COLORS.idle }), [])

  useEffect(
    () => () => {
      beam.geometry.dispose()
      beam.material.dispose()
      tipMaterial.dispose()
    },
    [beam, tipMaterial],
  )

  const beamRef = useRef<Mesh>(null)
  const raycaster = useMemo(() => new Raycaster(), [])
  const reportedTarget = useRef<number | null>(undefined)

  useFrame(() => {
    const beamMesh = beamRef.current
    if (!beamMesh) return

    // Cast a ray from the emitter towards the center of the board
    beamMesh.getWorldPosition(_origin)
    _direction.copy(_origin).negate().normalize()
    raycaster.set(_origin, _direction)
    const [hit] = raycaster.intersectObjects(useColliderStore.getState().colliders, false)

    const target = hit ? getColliderData(hit.object) : null
    const beamState: BeamState = !target ? 'idle' : target.kind === 'socket' ? 'socket' : 'blocked'
    const length = hit ? hit.distance : maxLength

    // Stop the beam at the nearest hit
    beamMesh.scale.y = length / maxLength
    beam.uniforms.length.value = length
    beam.uniforms.color.value.copy(BEAM_COLORS[beamState])
    tipMaterial.color.copy(TIP_COLORS[beamState])

    const socketIndex = target?.kind === 'socket' ? target.socketIndex : null
    if (reportedTarget.current !== socketIndex) {
      reportedTarget.current = socketIndex
      setLaserTarget(id, socketIndex)
    }
  })

  return (
    <>
      <mesh ref={beamRef} geometry={beam.geometry} material={beam.material} position={position} rotation-z={rotationZ} />
      <group position={position} rotation-z={rotationZ}>
        <mesh geometry={nodes.laser_base.geometry} material={atlas} />
        <mesh geometry={nodes.laser_tip.geometry} material={tipMaterial} />
      </group>
      <Collider name={id} data={COLLIDER_DATA} size={COLLIDER_SIZE} position={position}>
        <DebugLabel text={id} />
      </Collider>
    </>
  )
}
