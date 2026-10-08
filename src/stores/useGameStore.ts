import { create } from 'zustand'
import { RING_IDS, type RotationDirection } from '../game/constants'
import { gameEvents } from '../game/events'
import { getLevel, LEVEL_COUNT, type Level, type RingId } from '../game/levels'
import { isLevelUnlocked, useProgressStore } from './useProgressStore'

export type GameStatus = 'playing' | 'won'

interface GameState {
  /** The current level number (1-based), `null` while the menu is open. */
  levelNumber: number | null
  level: Level | null
  /** Incremented on every level start, used to remount the level scene. */
  runId: number
  status: GameStatus
  /** Becomes true once the level assets are loaded and the scene is mounted. */
  sceneReady: boolean
  /** While paused the scene is neither updated nor rendered. */
  paused: boolean
  /** The ring controlled by the player, 1 is the innermost one. */
  selectedRing: RingId
  /** Rotation of each ring counted in slots, positive values are counterclockwise. */
  ringSteps: Record<RingId, number>
  /** The socket each laser beam is currently hitting (by laser id). */
  laserTargets: Record<string, number | null>
  /** Play time measured before the timer was last started, in milliseconds. */
  timerElapsed: number
  /** `performance.now()` of the last timer start, `null` while the timer is stopped. */
  timerStartedAt: number | null

  startLevel: (levelNumber: number) => void
  nextLevel: () => void
  /** Starts the current level over, with a reset timer. */
  restartLevel: () => void
  /** Marks the current level as skipped and moves on to the next one. */
  skipLevel: () => void
  exitToMenu: () => void
  setSceneReady: (ready: boolean) => void
  pause: () => void
  resume: () => void
  selectOuterRing: () => void
  selectInnerRing: () => void
  rotateSelectedRing: (direction: RotationDirection) => void
  setLaserTarget: (laserId: string, socketIndex: number | null) => void
}

type TimerState = Pick<GameState, 'timerElapsed' | 'timerStartedAt'>

const OUTERMOST_RING = RING_IDS[RING_IDS.length - 1]
const INNERMOST_RING = RING_IDS[0]

/** The play time of the current level in milliseconds, pauses excluded. */
export const getElapsedTime = ({ timerElapsed, timerStartedAt }: TimerState) =>
  timerElapsed + (timerStartedAt === null ? 0 : performance.now() - timerStartedAt)

const stopTimer = (state: TimerState): TimerState => ({ timerElapsed: getElapsedTime(state), timerStartedAt: null })

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
    paused: false,
    selectedRing: OUTERMOST_RING,
    ringSteps: { 1: 0, 2: 0, 3: 0 },
    laserTargets: {},
    timerElapsed: 0,
    timerStartedAt: null,
  }
}

export const useGameStore = create<GameState>()((set, get) => ({
  ...levelState(null),
  runId: 0,

  startLevel: (levelNumber) => {
    if (!isLevelUnlocked(useProgressStore.getState(), levelNumber)) return
    set((state) => ({ ...levelState(levelNumber), runId: state.runId + 1 }))
  },

  nextLevel: () => {
    const { levelNumber, startLevel, exitToMenu } = get()
    if (levelNumber === null || levelNumber >= LEVEL_COUNT) exitToMenu()
    else startLevel(levelNumber + 1)
  },

  restartLevel: () => {
    const { levelNumber, startLevel } = get()
    if (levelNumber !== null) startLevel(levelNumber)
  },

  skipLevel: () => {
    const { levelNumber, nextLevel } = get()
    if (levelNumber === null) return
    useProgressStore.getState().skipLevel(levelNumber)
    nextLevel()
  },

  exitToMenu: () => set(levelState(null)),

  // The timer starts once the level is visible
  setSceneReady: (ready) =>
    set((state) => {
      if (ready === state.sceneReady) return state
      if (!ready) return { sceneReady: false, ...stopTimer(state) }
      const running = state.status === 'playing' && !state.paused
      return { sceneReady: true, timerStartedAt: running ? performance.now() : null }
    }),

  pause: () =>
    set((state) =>
      state.sceneReady && state.status === 'playing' && !state.paused ? { paused: true, ...stopTimer(state) } : state,
    ),

  resume: () => set((state) => (state.paused ? { paused: false, timerStartedAt: performance.now() } : state)),

  selectOuterRing: () => {
    const { selectedRing } = get()
    if (selectedRing >= OUTERMOST_RING) return
    const ring = (selectedRing + 1) as RingId
    set({ selectedRing: ring })
    gameEvents.emit('ringSelected', { ring })
  },

  selectInnerRing: () => {
    const { selectedRing } = get()
    if (selectedRing <= INNERMOST_RING) return
    const ring = (selectedRing - 1) as RingId
    set({ selectedRing: ring })
    gameEvents.emit('ringSelected', { ring })
  },

  rotateSelectedRing: (direction) => {
    const { selectedRing: ring, ringSteps } = get()
    set({ ringSteps: { ...ringSteps, [ring]: ringSteps[ring] + (direction === 'left' ? 1 : -1) } })
    gameEvents.emit('ringRotated', { ring, direction })
  },

  setLaserTarget: (laserId, socketIndex) => {
    const state = get()
    if (state.laserTargets[laserId] === socketIndex) return

    const laserTargets = { ...state.laserTargets, [laserId]: socketIndex }
    const won = state.status === 'playing' && state.level !== null && isSolved(state.level, laserTargets)
    if (!won) {
      set({ laserTargets })
      return
    }

    const time = getElapsedTime(state)
    set({ laserTargets, status: 'won', timerElapsed: time, timerStartedAt: null })
    if (state.levelNumber !== null) {
      useProgressStore.getState().completeLevel(state.levelNumber)
      gameEvents.emit('levelCompleted', { level: state.levelNumber, time })
    }
  },
}))

/** True while any laser beam hits the given socket. */
export const useIsSocketActive = (socketIndex: number) =>
  useGameStore((state) => Object.values(state.laserTargets).includes(socketIndex))
