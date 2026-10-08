import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { IconClockHour4 } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { WIN_POPUP_DELAY } from '../../game/constants'
import { LEVEL_COUNT } from '../../game/levels'
import { formatTime } from '../../game/time'
import { useGameStore } from '../../stores/useGameStore'

export function LevelCompleteModal() {
  const won = useGameStore((state) => state.status === 'won')
  const levelNumber = useGameStore((state) => state.levelNumber)
  // The timer is stopped once the level is won
  const finishTime = useGameStore((state) => state.timerElapsed)
  const nextLevel = useGameStore((state) => state.nextLevel)
  const exitToMenu = useGameStore((state) => state.exitToMenu)
  const [opened, setOpened] = useState(false)

  // Give the player a moment to see the solved board
  useEffect(() => {
    if (!won) return
    const timeout = setTimeout(() => setOpened(true), WIN_POPUP_DELAY)
    return () => clearTimeout(timeout)
  }, [won])

  const hasNextLevel = levelNumber !== null && levelNumber < LEVEL_COUNT

  return (
    <Modal
      opened={opened}
      onClose={exitToMenu}
      centered
      size="xs"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <Stack align="center" gap="md" py="sm">
        <Title order={2}>Congratulations!</Title>
        <Text fz="lg" fw={600}>
          {hasNextLevel ? 'You completed the level!' : 'You completed every level!'}
        </Text>
        <Group gap="xs" c="aqua.3">
          <IconClockHour4 size={28} />
          <Text fz="2rem" fw={700} style={{ fontVariantNumeric: 'tabular-nums' }} aria-label="Completion time">
            {formatTime(finishTime)}
          </Text>
        </Group>
        <Group justify="center">
          <Button variant="light" onClick={exitToMenu}>
            Exit to Menu
          </Button>
          {hasNextLevel && <Button onClick={nextLevel}>Play next</Button>}
        </Group>
      </Stack>
    </Modal>
  )
}
