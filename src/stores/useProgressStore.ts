import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  /** Levels the player solved. */
  completedLevels: number[]
  /** Levels the player skipped (by watching an ad) without solving them. */
  skippedLevels: number[]
  completeLevel: (level: number) => void
  skipLevel: (level: number) => void
}

/** The player's progress, saved in the browser's local storage. */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLevels: [],
      skippedLevels: [],

      completeLevel: (level) =>
        set((state) => ({
          completedLevels: state.completedLevels.includes(level)
            ? state.completedLevels
            : [...state.completedLevels, level],
          skippedLevels: state.skippedLevels.filter((skipped) => skipped !== level),
        })),

      skipLevel: (level) =>
        set((state) =>
          state.completedLevels.includes(level) || state.skippedLevels.includes(level)
            ? state
            : { skippedLevels: [...state.skippedLevels, level] },
        ),
    }),
    { name: 'logic-game-progress', version: 1 },
  ),
)

type Progress = Pick<ProgressState, 'completedLevels' | 'skippedLevels'>

/** A level opens once the one before it is completed (or skipped). The first level is always open. */
export const isLevelUnlocked = ({ completedLevels, skippedLevels }: Progress, level: number) =>
  level === 1 || completedLevels.includes(level - 1) || skippedLevels.includes(level - 1)
