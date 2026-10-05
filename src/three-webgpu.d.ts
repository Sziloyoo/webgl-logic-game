import type { ThreeToJSXElements } from '@react-three/fiber'
import type * as THREE from 'three/webgpu'

// Expose the WebGPU / node material classes (e.g. <meshBasicNodeMaterial />) as JSX elements
declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}
