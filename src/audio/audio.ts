import { Howl, Howler } from 'howler'
import { useSettingsStore } from '../stores/useSettingsStore'
import { SOUNDS, type SoundDefinition, type SoundName } from './sounds'

/** Howls are created on first use, `null` marks a sound that has no files yet. */
const howls = new Map<SoundName, Howl | null>()

function getHowl(name: SoundName) {
  if (!howls.has(name)) {
    const { src, ...options }: SoundDefinition = SOUNDS[name]
    howls.set(name, src.length > 0 ? new Howl({ src, ...options }) : null)
  }
  return howls.get(name) ?? null
}

/** Plays a sound effect. Overlapping plays of the same sound are fine. */
export function playSound(name: SoundName) {
  getHowl(name)?.play()
}

/** Starts a looping sound (music) unless it is already playing. */
export function playMusic(name: SoundName = 'music') {
  const howl = getHowl(name)
  if (howl && !howl.playing()) howl.play()
}

export function stopMusic(name: SoundName = 'music') {
  getHowl(name)?.stop()
}

/** Loads every sound up front, so the first play has no delay. */
export function preloadSounds() {
  Object.keys(SOUNDS).forEach((name) => getHowl(name as SoundName))
}

// Keep the global mute in sync with the saved setting
Howler.mute(useSettingsStore.getState().muted)
useSettingsStore.subscribe((state) => Howler.mute(state.muted))
