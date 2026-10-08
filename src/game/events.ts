import type { RotationDirection } from './constants'
import type { RingId } from './levels'

/** Everything that happens in the game and other systems (audio, analytics...) can react to. */
export interface GameEventMap {
  /** The player selected another ring. */
  ringSelected: { ring: RingId }
  /** The player rotated the selected ring by one slot. */
  ringRotated: { ring: RingId; direction: RotationDirection }
  /** Every socket is lit. `time` is the completion time in milliseconds. */
  levelCompleted: { level: number; time: number }
}

export type GameEvent = keyof GameEventMap
type Listener<E extends GameEvent> = (payload: GameEventMap[E]) => void

const listeners = new Map<GameEvent, Set<(payload: never) => void>>()

export const gameEvents = {
  /** Subscribes to an event, returns the function that unsubscribes. */
  on<E extends GameEvent>(event: E, listener: Listener<E>) {
    let eventListeners = listeners.get(event)
    if (!eventListeners) listeners.set(event, (eventListeners = new Set()))
    eventListeners.add(listener)
    return () => {
      eventListeners.delete(listener)
    }
  },

  emit<E extends GameEvent>(event: E, payload: GameEventMap[E]) {
    listeners.get(event)?.forEach((listener) => (listener as Listener<E>)(payload))
  },
}
