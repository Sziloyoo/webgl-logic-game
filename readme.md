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
