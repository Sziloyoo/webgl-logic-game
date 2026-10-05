import { Html } from '@react-three/drei'
import { isDebug } from '../../game/url'
import { useDebugStore } from '../../stores/useDebugStore'

/** Name tag that follows its parent object, only rendered in debug mode. */
export function DebugLabel({ text }: { text: string }) {
  const showLabels = useDebugStore((state) => state.showLabels)
  if (!isDebug || !showLabels) return null

  return (
    <Html center className="debug-label" zIndexRange={[10, 0]}>
      {text}
    </Html>
  )
}
