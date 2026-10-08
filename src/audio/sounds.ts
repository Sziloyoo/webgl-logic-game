import type { HowlOptions } from 'howler'

export interface SoundDefinition extends Omit<HowlOptions, 'src'> {
  /**
   * Audio files relative to the `static` folder, e.g. `['audio/rotate.webm', 'audio/rotate.mp3']`.
   * The first format the browser supports is used. A sound without files is silent.
   */
  src: string[]
}

/** Every sound of the game. See docs/audio.md for adding files and new sounds. */
export const SOUNDS = {
  /** Background music, loops during gameplay. `html5` streams long files instead of decoding them up front. */
  music: { src: [], loop: true, volume: 0.4, html5: true },
  /** The player selected another ring. */
  ringSelect: { src: [], volume: 0.6 },
  /** The selected ring rotated by one slot. */
  ringRotate: { src: [], volume: 0.6 },
  /** Every socket is lit. */
  levelComplete: { src: [], volume: 0.8 },
} satisfies Record<string, SoundDefinition>

export type SoundName = keyof typeof SOUNDS
