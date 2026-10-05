import { Center, Loader, Progress, Stack, Text, Transition } from '@mantine/core'
import { useProgress } from '@react-three/drei'
import { useGameStore } from '../../stores/useGameStore'
import classes from './GameView.module.css'

/** Covers the canvas until the level assets are loaded and the scene is mounted. */
export function LoadingOverlay() {
  const sceneReady = useGameStore((state) => state.sceneReady)
  const { progress } = useProgress()

  return (
    <Transition mounted={!sceneReady} transition="fade" duration={400}>
      {(styles) => (
        <Center className={classes.loadingOverlay} style={styles}>
          <Stack align="center" gap="md" w={240}>
            <Loader type="dots" size="lg" />
            <Progress value={progress} w="100%" size="sm" />
            <Text fz="lg" fw={600}>
              Loading level...
            </Text>
          </Stack>
        </Center>
      )}
    </Transition>
  )
}
