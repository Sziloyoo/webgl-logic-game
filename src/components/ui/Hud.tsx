import { ActionIcon } from '@mantine/core'
import { IconPlayerPauseFilled, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { formatTime } from '../../game/time'
import { getElapsedTime, useGameStore } from '../../stores/useGameStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import classes from './GameView.module.css'

function MuteButton() {
  const muted = useSettingsStore((state) => state.muted)
  const toggleMuted = useSettingsStore((state) => state.toggleMuted)

  return (
    <ActionIcon
      className={`${classes.hudButton} ${classes.hudLeft}`}
      variant="subtle"
      size="xl"
      onClick={toggleMuted}
      aria-label={muted ? 'Unmute' : 'Mute'}
      aria-pressed={muted}
    >
      {muted ? <IconVolumeOff /> : <IconVolume />}
    </ActionIcon>
  )
}

function GameTimer() {
  const textRef = useRef<HTMLSpanElement>(null)

  // Written straight into the DOM every frame, without re-rendering React
  useEffect(() => {
    let frame = 0
    const update = () => {
      if (textRef.current) textRef.current.textContent = formatTime(getElapsedTime(useGameStore.getState()))
      frame = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={classes.timer} role="timer" aria-label="Level time">
      <span ref={textRef}>{formatTime(0)}</span>
    </div>
  )
}

function PauseButton() {
  const canPause = useGameStore((state) => state.sceneReady && state.status === 'playing')
  const pause = useGameStore((state) => state.pause)

  return (
    <ActionIcon
      className={`${classes.hudButton} ${classes.hudRight}`}
      variant="subtle"
      size="xl"
      onClick={pause}
      disabled={!canPause}
      aria-label="Pause"
    >
      <IconPlayerPauseFilled />
    </ActionIcon>
  )
}

export function Hud() {
  return (
    <div className={classes.hud}>
      <MuteButton />
      <GameTimer />
      <PauseButton />
    </div>
  )
}
