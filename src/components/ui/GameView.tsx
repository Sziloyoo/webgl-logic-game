import { Leva } from 'leva'
import { useEffect } from 'react'
import { isDebug } from '../../game/url'
import { useGameInput } from '../../hooks/useGameInput'
import { useGameStore } from '../../stores/useGameStore'
import { GameCanvas } from '../canvas/GameCanvas'
import { ExitButton } from './ExitButton'
import classes from './GameView.module.css'
import { LevelCompleteModal } from './LevelCompleteModal'
import { LoadingOverlay } from './LoadingOverlay'

export default function GameView() {
  const runId = useGameStore((state) => state.runId)
  useGameInput()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className={classes.root}>
      <Leva hidden={!isDebug} theme={{ sizes: { rootWidth: '340px', controlWidth: '150px' } }} />
      <GameCanvas />
      <ExitButton />
      <LoadingOverlay />
      <LevelCompleteModal key={runId} />
    </div>
  )
}
