import { create } from 'zustand'

interface DebugState {
  showLabels: boolean
  showColliders: boolean
  set: (state: Partial<Pick<DebugState, 'showLabels' | 'showColliders'>>) => void
}

/** Debug toggles that are shared by many scene components, driven by the leva panel. */
export const useDebugStore = create<DebugState>()((set) => ({
  showLabels: true,
  showColliders: false,
  set,
}))
