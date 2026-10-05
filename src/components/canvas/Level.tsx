import { useEffect } from 'react'
import { RING_IDS } from '../../game/constants'
import type { Level as LevelData } from '../../game/levels'
import { useGameStore } from '../../stores/useGameStore'
import { Ring } from './Ring'
import { Socket } from './Socket'

/** The rings and sockets of a level. */
export function Level({ level }: { level: LevelData }) {
  const setSceneReady = useGameStore((state) => state.setSceneReady)

  useEffect(() => {
    setSceneReady(true)
    return () => setSceneReady(false)
  }, [setSceneReady])

  return (
    <>
      {RING_IDS.map((ring) => (
        <Ring key={ring} ring={ring} layout={level.ringObjects[ring]} />
      ))}
      {level.socketIndexes.map((index) => (
        <Socket key={index} index={index} />
      ))}
    </>
  )
}
