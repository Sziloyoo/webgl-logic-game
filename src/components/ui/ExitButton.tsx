import { CloseButton } from '@mantine/core'
import { useGameStore } from '../../stores/useGameStore'
import classes from './GameView.module.css'

export function ExitButton() {
  const exitToMenu = useGameStore((state) => state.exitToMenu)

  return <CloseButton className={classes.exitButton} size="xl" onClick={exitToMenu} aria-label="Exit to menu" />
}
