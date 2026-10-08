import { Center, Portal, RingProgress, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { PLACEHOLDER_AD_SECONDS, useAdStore } from '../../services/ads'
import classes from './GameView.module.css'

/** Stands in for a real ad while `showRewardedAd()` is a placeholder. */
export function AdPlaceholder() {
  const playing = useAdStore((state) => state.playing)
  const startedAt = useAdStore((state) => state.startedAt)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setProgress(Math.min((performance.now() - startedAt) / (PLACEHOLDER_AD_SECONDS * 1000), 1))
    }, 50)
    return () => clearInterval(interval)
  }, [playing, startedAt])

  if (!playing) return null

  const secondsLeft = Math.ceil(PLACEHOLDER_AD_SECONDS * (1 - progress))

  // Portaled next to the modals, so it covers the pause menu
  return (
    <Portal>
      <Center className={classes.adOverlay} role="dialog" aria-label="Advertisement">
        <Stack align="center" gap="sm">
          <Text c="dimmed" fz="sm" tt="uppercase" fw={600}>
            Advertisement
          </Text>
          <Title order={2}>Your ad plays here</Title>
          <RingProgress
            size={96}
            thickness={6}
            roundCaps
            sections={[{ value: progress * 100, color: 'aqua' }]}
            label={
              <Text ta="center" fz="xl" fw={700}>
                {secondsLeft}
              </Text>
            }
          />
        </Stack>
      </Center>
    </Portal>
  )
}
