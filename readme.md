# The logic game from Ratchet and Clank recreated for WebGL.
![Local GIF](./screenshots/demo.gif)
## Setup
```node
npm install
npm run dev
```
## ToDo
- New levels are only available after the player completed the one before it.
- A timer should be displayed at the top center of the screen during gameplay.
- When completing a level, the time needs to be displayed after finish.
- In the first level a tutorial textbox should appear at the bottom of the screen with information about the controls and how to complete a level. After the player moves a laser, with a two second delay the controls help textbox should disappear. After that a new one comes up which explains that the lasers must be pointed into a free socket. When all lights turn green on the ring, the level is completed.
- At the top right corner a pause menu should appear instead of the exit button. During paused the game rendering / logic must stop. In the pause menu: watch ad button to skip level, rest level button and exit menu button.
- Add sound effects to the game.
- Add music to the game, and a mute button at the top left corner during gameplay
- Add some kind of radial background shader behind the ring which moves slightly
- Skip level in the pause menu by watching an ad.
- Remove debug menu and url hash level IDs.
- Remove vercel from the project.

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
- [drei](https://drei.docs.pmnd.rs) helpers (glTF / texture loading, environment map, camera controls, HTML labels)
- [zustand](https://zustand.docs.pmnd.rs) for the game state
- [Mantine](https://mantine.dev) for the menus
- [leva](https://github.com/pmndrs/leva) for the debug panel

## Debug mode
Open the game with `#debug` or `?debug` in the URL (e.g. `http://localhost:5173/?debug#3`) to show the leva panel,
the object labels and the debug camera. A level can be opened directly with its number in the hash, e.g. `#7`.

## Project structure
```
src/
├── components/
│   ├── canvas/   # R3F scene: board, rings, lasers, blockers, sockets, camera, lights, post processing
│   └── ui/       # Mantine menus and overlays
├── game/         # Levels, board constants, asset paths
├── hooks/        # Keyboard and touch controls
├── materials/    # TSL node materials
└── stores/       # zustand stores
static/           # Models, textures and Draco decoders served as they are
```
