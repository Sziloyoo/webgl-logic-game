import { Anchor, Container, Group, Image, SimpleGrid, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import type { ReactNode } from 'react'
import { LEVELS } from '../../game/levels'
import { useGameStore } from '../../stores/useGameStore'
import classes from './MainMenu.module.css'

function ControlHelp({ image, alt, children }: { image: string; alt: string; children: ReactNode }) {
  return (
    <Stack gap="sm" align="center">
      <Image src={image} alt={alt} className={classes.controlImage} />
      <Text className={classes.text}>{children}</Text>
    </Stack>
  )
}

export function MainMenu() {
  const startLevel = useGameStore((state) => state.startLevel)

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
            <UnstyledButton key={index} className={classes.levelButton} onClick={() => startLevel(index + 1)}>
              {index + 1}
            </UnstyledButton>
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
