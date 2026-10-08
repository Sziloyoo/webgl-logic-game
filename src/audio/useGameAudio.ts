import { useEffect } from 'react'
import { gameEvents } from '../game/events'
import { playMusic, playSound, preloadSounds, stopMusic } from './audio'

/** Plays the background music during gameplay and the sound effects of the game events. */
export function useGameAudio() {
  useEffect(() => {
    preloadSounds()
    playMusic()

    // Game event -> sound effect
    const unsubscribers = [
      gameEvents.on('ringSelected', () => playSound('ringSelect')),
      gameEvents.on('ringRotated', () => playSound('ringRotate')),
      gameEvents.on('levelCompleted', () => playSound('levelComplete')),
    ]

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      stopMusic()
    }
  }, [])
}
