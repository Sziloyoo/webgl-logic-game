import { useEffect } from 'react'
import { ROTATE_COOLDOWN, SELECT_COOLDOWN } from '../game/constants'
import { useAdStore } from '../services/ads'
import { useGameStore } from '../stores/useGameStore'

type InputAction = 'up' | 'down' | 'left' | 'right'

const KEY_BINDINGS: Record<string, InputAction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}

/** Minimum swipe distance in pixels, to avoid accidental touches. */
const MIN_SWIPE_DISTANCE = 20

/** Keyboard (arrows / WASD, Escape to pause) and touch swipe controls of the rings. */
export function useGameInput() {
  useEffect(() => {
    // Prevents button spamming while a ring is rotating
    let lockedUntil = 0
    let touchStart: { x: number; y: number } | null = null

    const trigger = (action: InputAction) => {
      const now = performance.now()
      const game = useGameStore.getState()
      if (now < lockedUntil || game.status !== 'playing' || game.paused || !game.sceneReady) return

      switch (action) {
        case 'up':
          game.selectOuterRing()
          lockedUntil = now + SELECT_COOLDOWN
          break
        case 'down':
          game.selectInnerRing()
          lockedUntil = now + SELECT_COOLDOWN
          break
        case 'left':
          game.rotateSelectedRing('left')
          lockedUntil = now + ROTATE_COOLDOWN
          break
        case 'right':
          game.rotateSelectedRing('right')
          lockedUntil = now + ROTATE_COOLDOWN
          break
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape toggles the pause menu (not while an ad is playing)
      if (event.code === 'Escape') {
        const game = useGameStore.getState()
        if (!game.paused) game.pause()
        else if (!useAdStore.getState().playing) game.resume()
        return
      }
      const action = KEY_BINDINGS[event.code]
      if (action) trigger(action)
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStart) return
      const diffX = event.changedTouches[0].clientX - touchStart.x
      const diffY = event.changedTouches[0].clientY - touchStart.y
      const absDiffX = Math.abs(diffX)
      const absDiffY = Math.abs(diffY)
      touchStart = null

      if (absDiffX > absDiffY && absDiffX > MIN_SWIPE_DISTANCE) trigger(diffX > 0 ? 'right' : 'left')
      else if (absDiffY > absDiffX && absDiffY > MIN_SWIPE_DISTANCE) trigger(diffY > 0 ? 'down' : 'up')
    }

    // Safari: prevent the pull down to refresh gesture while swiping
    const preventTouchMove = (event: TouchEvent) => event.preventDefault()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchmove', preventTouchMove, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchmove', preventTouchMove)
    }
  }, [])
}
