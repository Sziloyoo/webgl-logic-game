import { create } from 'zustand'
import { RING_IDS } from '../game/constants'
import { getLevel, LEVEL_COUNT, type Level, type RingId } from '../game/levels'
import { getLevelFromHash } from '../game/url'

export type GameStatus = 'playing' | 'won'
export type RotationDirection = 'left' | 'right'

interface GameState {
  /** The current level number (1-based), `null` while the menu is open. */
  levelNumber: number | null
  level: Level | null
  /** Incremented on every level start, used to remount the level scene. */
  runId: number
  status: GameStatus
  /** Becomes true once the level assets are loaded and the scene is mounted. */
  sceneReady: boolean
  /** The ring controlled by the player, 1 is the innermost one. */
  selectedRing: RingId
  /** Rotation of each ring counted in slots, positive values are counterclockwise. */
  ringSteps: Record<RingId, number>
  /** The socket each laser beam is currently hitting (by laser id). */
  laserTargets: Record<string, number | null>

  startLevel: (levelNumber: number) => void
  nextLevel: () => void
  exitToMenu: () => void
  setSceneReady: (ready: boolean) => void
  selectOuterRing: () => void
  selectInnerRing: () => void
  rotateSelectedRing: (direction: RotationDirection) => void
  setLaserTarget: (laserId: string, socketIndex: number | null) => void
}

const OUTERMOST_RING = RING_IDS[RING_IDS.length - 1]
const INNERMOST_RING = RING_IDS[0]

const initialRingSteps = (): Record<RingId, number> => ({ 1: 0, 2: 0, 3: 0 })

const isSolved = (level: Level, laserTargets: GameState['laserTargets']) => {
  const hitSockets = new Set(Object.values(laserTargets))
  return level.socketIndexes.length > 0 && level.socketIndexes.every((socket) => hitSockets.has(socket))
}

const levelState = (levelNumber: number | null) => {
  const level = levelNumber === null ? null : (getLevel(levelNumber) ?? null)
  return {
    levelNumber: level ? levelNumber : null,
    level,
    status: 'playing' as const,
    sceneReady: false,
    selectedRing: OUTERMOST_RING,
    ringSteps: initialRingSteps(),
    laserTargets: {},
  }
}

export const useGameStore = create<GameState>()((set, get) => ({
  ...levelState(getLevelFromHash()),
  runId: 0,

  startLevel: (levelNumber) => set((state) => ({ ...levelState(levelNumber), runId: state.runId + 1 })),

  nextLevel: () => {
    const { levelNumber, startLevel, exitToMenu } = get()
    if (levelNumber === null || levelNumber >= LEVEL_COUNT) exitToMenu()
    else startLevel(levelNumber + 1)
  },

  exitToMenu: () => set(levelState(null)),

  setSceneReady: (sceneReady) => set({ sceneReady }),

  selectOuterRing: () =>
    set((state) => (state.selectedRing < OUTERMOST_RING ? { selectedRing: (state.selectedRing + 1) as RingId } : state)),

  selectInnerRing: () =>
    set((state) => (state.selectedRing > INNERMOST_RING ? { selectedRing: (state.selectedRing - 1) as RingId } : state)),

  rotateSelectedRing: (direction) =>
    set((state) => ({
      ringSteps: {
        ...state.ringSteps,
        [state.selectedRing]: state.ringSteps[state.selectedRing] + (direction === 'left' ? 1 : -1),
      },
    })),

  setLaserTarget: (laserId, socketIndex) =>
    set((state) => {
      if (state.laserTargets[laserId] === socketIndex) return state

      const laserTargets = { ...state.laserTargets, [laserId]: socketIndex }
      const won = state.status === 'playing' && state.level !== null && isSolved(state.level, laserTargets)

      return { laserTargets, status: won ? 'won' : state.status }
    }),
}))

/** True while any laser beam hits the given socket. */
export const useIsSocketActive = (socketIndex: number) =>
  useGameStore((state) => Object.values(state.laserTargets).includes(socketIndex))
