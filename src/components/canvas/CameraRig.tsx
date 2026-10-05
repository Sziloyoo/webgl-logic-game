import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { MathUtils } from 'three/webgpu'

const DEFAULT_DISTANCE = 24
/** Used when a portrait oriented screen needs more horizontal space. */
const FAR_DISTANCE = 52
const PORTRAIT_ASPECT = 9 / 16
const LANDSCAPE_ASPECT = 16 / 9

/** Fits the board on screen and slightly orbits the camera following the mouse. */
export function CameraRig() {
  const controlsRef = useRef<CameraControls>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const size = useThree((state) => state.size)
  const initialized = useRef(false)

  const { debugCamera, moveAmount } = useControls('Camera', {
    debugCamera: { value: false, label: 'Debug Camera' },
    moveAmount: { value: 0.125, min: 0, max: 1, label: 'Move Amount' },
  })

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
    if (!controls || debugCamera) return

    const aspect = size.width / size.height
    const t = MathUtils.clamp((aspect - PORTRAIT_ASPECT) / (LANDSCAPE_ASPECT - PORTRAIT_ASPECT), 0, 1)
    void controls.setPosition(0, 0, MathUtils.lerp(FAR_DISTANCE, DEFAULT_DISTANCE, t), initialized.current)
    initialized.current = true
  }, [size, debugCamera])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls || debugCamera) return

    void controls.rotateAzimuthTo(pointer.current.x * moveAmount, true)
    void controls.rotatePolarTo(Math.PI / 2 + pointer.current.y * moveAmount, true)
  })

  return <CameraControls ref={controlsRef} enabled={debugCamera} makeDefault />
}
