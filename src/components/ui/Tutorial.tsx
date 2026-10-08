import { Group, Kbd, Paper, Stack, Text, Transition } from '@mantine/core'
import { useEffect, useState, type ReactNode } from 'react'
import { TUTORIAL_CONTROLS_HIDE_DELAY } from '../../game/constants'
import { gameEvents } from '../../game/events'
import { useGameStore } from '../../stores/useGameStore'
import classes from './GameView.module.css'

type Step = 'controls' | 'goal'

const FADE_DURATION = 300

function TutorialBox({ mounted, delay = 0, title, children }: { mounted: boolean; delay?: number; title: string; children: ReactNode }) {
  return (
    <Transition mounted={mounted} transition="fade-up" duration={FADE_DURATION} enterDelay={delay}>
      {(styles) => (
        <div className={classes.tutorial} style={styles} role="status">
          <Paper className={classes.tutorialCard} px="md" py="sm" radius="lg" shadow="lg">
            <Stack gap={6}>
              <Text className={classes.tutorialTitle} fz="lg" fw={700} lh={1.2}>
                {title}
              </Text>
              {children}
            </Stack>
          </Paper>
        </div>
      )}
    </Transition>
  )
}

function ControlRow({ keys, children }: { keys: string[]; children: ReactNode }) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Group gap={4} wrap="nowrap">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </Group>
      <Text fz="md" fw={600}>
        {children}
      </Text>
    </Group>
  )
}

/** Explains the controls and then the goal of the game, shown in the first level. */
export function Tutorial() {
  const sceneReady = useGameStore((state) => state.sceneReady)
  const won = useGameStore((state) => state.status === 'won')
  const [step, setStep] = useState<Step>('controls')

  // Move on to the goal a little after the player first rotates a ring (and moves a laser with it)
  useEffect(() => {
    if (step !== 'controls') return
    let timeout: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = gameEvents.on('ringRotated', () => {
      timeout ??= setTimeout(() => setStep('goal'), TUTORIAL_CONTROLS_HIDE_DELAY)
    })
    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [step])

  return (
    <>
      <TutorialBox mounted={sceneReady && step === 'controls'} title="How to play">
        <ControlRow keys={['↑', '↓']}>or swipe up / down to select a ring</ControlRow>
        <ControlRow keys={['←', '→']}>or swipe left / right to rotate it</ControlRow>
        <Text fz="sm" c="dimmed">
          W A S D work too. Rotate the rings to aim their lasers at the sockets around the board.
        </Text>
      </TutorialBox>

      <TutorialBox mounted={sceneReady && step === 'goal' && !won} delay={FADE_DURATION} title="Light up every socket">
        <Text fz="md" fw={600}>
          Point the lasers into the free sockets around the board. When all the lights on the ring turn green, the level
          is complete.
        </Text>
      </TutorialBox>
    </>
  )
}
