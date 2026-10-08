import { Anchor, Container, Group, Image, SimpleGrid, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { IconCheck, IconLock, IconPlayerSkipForwardFilled } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { LEVELS } from '../../game/levels'
import { useGameStore } from '../../stores/useGameStore'
import { isLevelUnlocked, useProgressStore } from '../../stores/useProgressStore'
import classes from './MainMenu.module.css'

function LevelButton({ level }: { level: number }) {
  const startLevel = useGameStore((state) => state.startLevel)
  const unlocked = useProgressStore((state) => isLevelUnlocked(state, level))
  const completed = useProgressStore((state) => state.completedLevels.includes(level))
  const skipped = useProgressStore((state) => state.skippedLevels.includes(level))

  const status = !unlocked ? 'locked' : completed ? 'completed' : skipped ? 'skipped' : 'open'
  const badge = { locked: <IconLock size={18} />, completed: <IconCheck size={20} />, skipped: <IconPlayerSkipForwardFilled size={16} /> }

  return (
    <UnstyledButton
      className={classes.levelButton}
      onClick={() => startLevel(level)}
      disabled={!unlocked}
      aria-label={`Level ${level}${status === 'open' ? '' : `, ${status}`}`}
    >
      {level}
      {status !== 'open' && (
        <span className={`${classes.levelBadge} ${status === 'locked' ? classes.levelBadgeLocked : ''}`}>{badge[status]}</span>
      )}
    </UnstyledButton>
  )
}

function ControlHelp({ image, alt, children }: { image: string; alt: string; children: ReactNode }) {
  return (
    <Stack gap="sm" align="center">
      <Image src={image} alt={alt} className={classes.controlImage} />
      <Text className={classes.text}>{children}</Text>
    </Stack>
  )
}

export function MainMenu() {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="lg">
        <Title className={classes.title}>WebGL Logic Game</Title>
        <Stack align="center" gap={4}>
          <Text className={classes.text}>
            The door unlocking minigame from Ratchet and Clank (2002) remade for the web by:
          </Text>
          <Anchor href="https://www.linkedin.com/in/szilard-pullai/" className={classes.text} underline="never">
            Szilárd Pullai
          </Anchor>
        </Stack>

        <Title order={2} className={classes.heading}>
          Select a level!
        </Title>
        <Group justify="center" gap="xl">
          {LEVELS.map((_, index) => (
            <LevelButton key={index} level={index + 1} />
          ))}
        </Group>

        <Title order={2} className={classes.heading}>
          Controls
        </Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" maw={960}>
          <ControlHelp image="menu/controls_select_ring.jpg" alt="select ring">
            To select a ring swipe UP / DOWN on mobile, OR use the arrow keyboard keys
          </ControlHelp>
          <ControlHelp image="menu/controls_rotate_ring.jpg" alt="rotate ring">
            To rotate the selected ring swipe LEFT / RIGHT on mobile, OR use the arrow keyboard keys
          </ControlHelp>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
