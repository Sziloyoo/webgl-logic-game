import { useControls } from 'leva'
import { useEffect } from 'react'
import { useDebugStore } from '../../stores/useDebugStore'

/** Debug toggles shared by the whole scene and the world axes helper. */
export function DebugHelpers() {
  const setDebug = useDebugStore((state) => state.set)

  const { showLabels, showColliders } = useControls('Debug', {
    showLabels: { value: true, label: 'Text' },
    showColliders: { value: false, label: 'Colliders' },
  })

  const { showAxes } = useControls('World', {
    showAxes: { value: false, label: 'Show Axes' },
  })

  useEffect(() => setDebug({ showLabels, showColliders }), [setDebug, showLabels, showColliders])

  return <axesHelper args={[1]} visible={showAxes} />
}
