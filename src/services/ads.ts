import { create } from 'zustand'

export type RewardedAdResult = 'rewarded' | 'dismissed' | 'failed'

/** How long the placeholder "ad" lasts. */
export const PLACEHOLDER_AD_SECONDS = 3

interface AdState {
  /** True while an ad is on screen. */
  playing: boolean
  /** When the current ad started, used by the placeholder countdown. */
  startedAt: number
}

export const useAdStore = create<AdState>()(() => ({ playing: false, startedAt: 0 }))

/**
 * Shows a rewarded ad and resolves once it is over. Grant the reward only for `'rewarded'`.
 *
 * PLACEHOLDER: there is no ad network yet, this shows <AdPlaceholder /> for a few seconds and always rewards.
 * Replace the body with the ad SDK call (keep `playing` updated, the pause menu uses it).
 */
export async function showRewardedAd(): Promise<RewardedAdResult> {
  if (useAdStore.getState().playing) return 'failed'

  useAdStore.setState({ playing: true, startedAt: performance.now() })
  await new Promise((resolve) => setTimeout(resolve, PLACEHOLDER_AD_SECONDS * 1000))
  useAdStore.setState({ playing: false })

  return 'rewarded'
}
