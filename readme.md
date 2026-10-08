# The logic game from Ratchet and Clank recreated for WebGL.
![Local GIF](./screenshots/demo.gif)
## Setup
```node
npm install
npm run dev
```

## Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type check and build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Run the TypeScript compiler |
| `npm run lint` | Lint with oxlint |
| `npm run deploy` | Deploy to Vercel |

## Tech stack
- [React](https://react.dev) + TypeScript, bundled with [Vite](https://vite.dev)
- [React Three Fiber](https://r3f.docs.pmnd.rs) with three.js `WebGPURenderer` (falls back to WebGL 2 where WebGPU is not available)
- Materials and post processing (bloom) written in [TSL](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
- [drei](https://drei.docs.pmnd.rs) helpers (glTF / texture loading, environment map, camera controls)
- [zustand](https://zustand.docs.pmnd.rs) for the game state, the saved progress and settings
- [Mantine](https://mantine.dev) + [Tabler icons](https://tabler.io/icons) for the menus and the HUD
- [Howler.js](https://howlerjs.com) for music and sound effects

## Gameplay features
- Levels unlock one by one: a level opens after the previous one is completed (or skipped). Progress is saved in
  local storage (`logic-game-progress`), clear it to start over.
- A timer runs during gameplay and the completion time is shown when a level is solved.
- The first level shows a short tutorial.
- Pause menu (top right, or `Escape`): resume, skip the level by watching an ad, exit to the menu. The scene stops
  updating and rendering while paused, and the game pauses itself when the tab is hidden.
- Mute button (top left), saved in local storage (`logic-game-settings`).

## Audio
The audio system is ready but has no files yet. See the [audio guide](./docs/audio.md) for adding music and sound
effects (ring switch, ring rotation, level complete...).

## Ads
`showRewardedAd()` in `src/services/ads.ts` is a placeholder that shows a 3 second fake ad and always grants the
reward. Replace its body with the ad network SDK once there is one.

## Project structure
```
src/
├── audio/        # Sound list, playback helpers, game event -> sound wiring
├── components/
│   ├── canvas/   # R3F scene: board, rings, lasers, blockers, sockets, camera, lights, post processing
│   └── ui/       # Menus, HUD, pause menu, tutorial, overlays
├── game/         # Levels, board constants, game events, asset paths
├── hooks/        # Keyboard and touch controls
├── materials/    # TSL node materials
├── services/     # Ads (placeholder)
└── stores/       # zustand stores: game, progress, settings, colliders
static/           # Models, textures, audio and Draco decoders served as they are
docs/             # Guides
```
