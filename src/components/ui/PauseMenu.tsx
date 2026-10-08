import { Badge, Button, Modal, Stack, Title } from '@mantine/core'
import { IconDoorExit, IconPlayerPlayFilled, IconPlayerSkipForwardFilled } from '@tabler/icons-react'
import { showRewardedAd, useAdStore } from '../../services/ads'
import { useGameStore } from '../../stores/useGameStore'

export function PauseMenu() {
  const paused = useGameStore((state) => state.paused)
  const resume = useGameStore((state) => state.resume)
  const skipLevel = useGameStore((state) => state.skipLevel)
  const exitToMenu = useGameStore((state) => state.exitToMenu)
  const adPlaying = useAdStore((state) => state.playing)

  const handleSkip = async () => {
    const result = await showRewardedAd()
    if (result === 'rewarded') skipLevel()
  }

  return (
    <Modal
      opened={paused}
      onClose={resume}
      centered
      size="xs"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false} // Escape is handled by useGameInput
      overlayProps={{ blur: 3 }}
    >
      <Stack gap="md" py="sm">
        <Title order={2} ta="center">
          Paused
        </Title>
        <Button size="md" leftSection={<IconPlayerPlayFilled size={18} />} onClick={resume} disabled={adPlaying} data-autofocus>
          Resume
        </Button>
        <Button
          size="md"
          variant="light"
          leftSection={<IconPlayerSkipForwardFilled size={18} />}
          rightSection={<Badge size="sm">Watch ad</Badge>}
          onClick={handleSkip}
          loading={adPlaying}
        >
          Skip level
        </Button>
        <Button size="md" variant="subtle" leftSection={<IconDoorExit size={18} />} onClick={exitToMenu} disabled={adPlaying}>
          Exit to menu
        </Button>
      </Stack>
    </Modal>
  )
}
