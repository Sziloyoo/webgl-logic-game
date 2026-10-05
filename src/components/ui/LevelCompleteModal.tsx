import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { WIN_POPUP_DELAY } from '../../game/constants'
import { LEVEL_COUNT } from '../../game/levels'
import { useGameStore } from '../../stores/useGameStore'

export function LevelCompleteModal() {
  const won = useGameStore((state) => state.status === 'won')
  const levelNumber = useGameStore((state) => state.levelNumber)
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
