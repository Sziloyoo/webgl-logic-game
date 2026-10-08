import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  muted: boolean
  toggleMuted: () => void
}

/** Player preferences, saved in the browser's local storage. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      muted: false,
      toggleMuted: () => set((state) => ({ muted: !state.muted })),
    }),
    { name: 'logic-game-settings', version: 1 },
  ),
)
