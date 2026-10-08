# Audio guide

The game uses [Howler.js](https://howlerjs.com) for music and sound effects. Everything is already wired up: the
sounds just have no files yet, so they are silent. Adding a file is enough to hear it.

| File | What it does |
| --- | --- |
| `src/audio/sounds.ts` | The list of sounds (`SOUNDS`): files, volume, looping |
| `src/audio/audio.ts` | `playSound()`, `playMusic()`, `stopMusic()`, mute handling |
| `src/audio/useGameAudio.ts` | Connects game events to sounds, starts and stops the music |
| `src/game/events.ts` | The game events (`ringSelected`, `ringRotated`, `levelCompleted`) |
| `static/audio/` | Put your audio files here |

## 1. Add the audio files

Copy the files into `static/audio/`, for example:

```
static/audio/
├── music.mp3
├── ring-select.webm
├── ring-select.mp3
├── ring-rotate.webm
├── ring-rotate.mp3
├── level-complete.webm
└── level-complete.mp3
```

- `.mp3` plays everywhere. A `.webm` (Opus) version next to it is smaller, Howler picks the first format the browser supports.
- Keep sound effects short (well under a second for the ring sounds, they can play several times per second).
- Trim the silence from the start of the files, otherwise the sound lags behind the action.

## 2. Register them in `src/audio/sounds.ts`

Fill in the `src` arrays (paths are relative to the `static` folder):

```ts
export const SOUNDS = {
  music: { src: ['audio/music.mp3'], loop: true, volume: 0.4, html5: true },
  ringSelect: { src: ['audio/ring-select.webm', 'audio/ring-select.mp3'], volume: 0.6 },
  ringRotate: { src: ['audio/ring-rotate.webm', 'audio/ring-rotate.mp3'], volume: 0.6 },
  levelComplete: { src: ['audio/level-complete.webm', 'audio/level-complete.mp3'], volume: 0.8 },
} satisfies Record<string, SoundDefinition>
```

That's it, the sounds now play on these events:

| Event | Fired when | Sound |
| --- | --- | --- |
| `ringSelected` | The player switches ring (`↑` `↓`, `W` `S`, swipe up / down) | `ringSelect` |
| `ringRotated` | The selected ring rotates by one slot (`←` `→`, `A` `D`, swipe left / right) | `ringRotate` |
| `levelCompleted` | Every socket turns green | `levelComplete` |
| (level starts / exits) | The game screen opens / closes | `music` starts / stops |

Every entry accepts the [Howl options](https://github.com/goldfire/howler.js#options) besides `src`: `volume`
(0 to 1), `loop`, `rate` (playback speed), `sprite` (several effects in one file), `html5` (streams the file, use it
for long music tracks only).

## How it works

The game store (`src/stores/useGameStore.ts`) emits an event whenever something happens:

```ts
// useGameStore.ts, in rotateSelectedRing()
gameEvents.emit('ringRotated', { ring, direction })
```

`useGameAudio()` (used by the game screen) listens to the events and plays the matching sound:

```ts
// src/audio/useGameAudio.ts
const unsubscribers = [
  gameEvents.on('ringSelected', () => playSound('ringSelect')),
  gameEvents.on('ringRotated', () => playSound('ringRotate')),
  gameEvents.on('levelCompleted', () => playSound('levelComplete')),
]
```

The game logic doesn't know about audio, and the audio code doesn't know about the game logic. The events carry
data, so a listener can react differently, e.g. per direction:

```ts
gameEvents.on('ringRotated', ({ direction }) => playSound(direction === 'left' ? 'ringRotateLeft' : 'ringRotateRight'))
```

## Adding a new sound for a new event

Example: a "ding" whenever a socket lights up.

1. Add the sound to `SOUNDS` in `src/audio/sounds.ts`:

   ```ts
   socketLit: { src: ['audio/socket-lit.webm', 'audio/socket-lit.mp3'], volume: 0.5 },
   ```

2. Declare the event in `GameEventMap` in `src/game/events.ts`:

   ```ts
   /** A laser started hitting a socket. */
   socketLit: { socketIndex: number }
   ```

3. Emit it where it happens. Lasers report the socket they hit through `setLaserTarget()` in
   `src/stores/useGameStore.ts`. A socket lights up when no other laser was hitting it already, so add this right
   after the `const laserTargets = ...` line:

   ```ts
   const wasLit = socketIndex !== null && Object.values(state.laserTargets).includes(socketIndex)
   if (socketIndex !== null && !wasLit) gameEvents.emit('socketLit', { socketIndex })
   ```

4. Play it in `src/audio/useGameAudio.ts`:

   ```ts
   gameEvents.on('socketLit', () => playSound('socketLit')),
   ```

## Playing a sound directly

Anything outside the game events (e.g. UI clicks) can call the functions from `src/audio/audio.ts` directly:

```tsx
import { playSound } from '../../audio/audio'

<Button onClick={() => { playSound('buttonClick'); startLevel(level) }}>Play</Button>
```

## Music

`useGameAudio()` calls `playMusic()` when a level opens and `stopMusic()` when the player returns to the menu. The
music keeps playing in the pause menu. To pause it together with the game, add this effect to `useGameAudio()`:

```ts
// import { useGameStore } from '../stores/useGameStore'
const paused = useGameStore((state) => state.paused)
useEffect(() => {
  if (paused) stopMusic()
  else playMusic()
}, [paused])
```

(`stopMusic()` restarts the track on resume. For a seamless resume, add a `pauseMusic()` helper to `audio.ts` that
calls `getHowl(name)?.pause()`.)

## Mute

The mute button (top left during gameplay) toggles `muted` in `src/stores/useSettingsStore.ts`. The setting is saved
in local storage and `audio.ts` keeps `Howler.mute()` in sync with it, which silences every sound at once. Read or
change it from anywhere with `useSettingsStore`.

## Browser autoplay

Browsers block audio until the player interacts with the page. Howler unlocks audio on the first click or tap, and the
music only starts after the player picks a level, so nothing extra is needed.
