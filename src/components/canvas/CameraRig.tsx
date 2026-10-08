import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { MathUtils } from 'three/webgpu'

const DEFAULT_DISTANCE = 24
/** Used when a portrait oriented screen needs more horizontal space. */
const FAR_DISTANCE = 52
const PORTRAIT_ASPECT = 9 / 16
const LANDSCAPE_ASPECT = 16 / 9
/** How far the camera orbits following the mouse, in radians. */
const MOVE_AMOUNT = 0.125

/** Fits the board on screen and slightly orbits the camera following the mouse. */
export function CameraRig() {
  const controlsRef = useRef<CameraControls>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const size = useThree((state) => state.size)
  const initialized = useRef(false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Move the camera further away on narrow screens, so the whole board stays visible
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const aspect = size.width / size.height
    const t = MathUtils.clamp((aspect - PORTRAIT_ASPECT) / (LANDSCAPE_ASPECT - PORTRAIT_ASPECT), 0, 1)
    void controls.setPosition(0, 0, MathUtils.lerp(FAR_DISTANCE, DEFAULT_DISTANCE, t), initialized.current)
    initialized.current = true
  }, [size])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    void controls.rotateAzimuthTo(pointer.current.x * MOVE_AMOUNT, true)
    void controls.rotatePolarTo(Math.PI / 2 + pointer.current.y * MOVE_AMOUNT, true)
  })

  // The player can't move the camera, it is only used for its smooth transitions
  return <CameraControls ref={controlsRef} enabled={false} makeDefault />
}
