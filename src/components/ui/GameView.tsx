import gsap from 'gsap'
import { useEffect } from 'react'
import { useGameAudio } from '../../audio/useGameAudio'
import { useGameInput } from '../../hooks/useGameInput'
import { useGameStore } from '../../stores/useGameStore'
import { GameCanvas } from '../canvas/GameCanvas'
import { AdPlaceholder } from './AdPlaceholder'
import classes from './GameView.module.css'
import { Hud } from './Hud'
import { LevelCompleteModal } from './LevelCompleteModal'
import { LoadingOverlay } from './LoadingOverlay'
import { PauseMenu } from './PauseMenu'
import { Tutorial } from './Tutorial'

export default function GameView() {
  const runId = useGameStore((state) => state.runId)
  const levelNumber = useGameStore((state) => state.levelNumber)
  const paused = useGameStore((state) => state.paused)
  useGameInput()
  useGameAudio()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Freeze the ring animations together with the scene
  useEffect(() => {
    if (paused) gsap.globalTimeline.pause()
    else gsap.globalTimeline.resume()
  }, [paused])
  useEffect(() => () => void gsap.globalTimeline.resume(), [])

  // Pause when the player switches to another tab or app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) useGameStore.getState().pause()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <div className={classes.root}>
      <GameCanvas />
      <Hud />
      {levelNumber === 1 && <Tutorial key={`tutorial-${runId}`} />}
      <LoadingOverlay />
      <PauseMenu />
      <LevelCompleteModal key={`complete-${runId}`} />
      <AdPlaceholder />
    </div>
  )
}
