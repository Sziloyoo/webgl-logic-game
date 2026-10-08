import { MantineProvider } from '@mantine/core'
import { lazy, Suspense, useEffect } from 'react'
import { MainMenu } from './components/ui/MainMenu'
import { useGameStore } from './stores/useGameStore'
import { cssVariablesResolver, theme } from './theme'

// three.js and the 3D scene are only downloaded when they are needed
const GameView = lazy(() => import('./components/ui/GameView'))

export function App() {
  const levelNumber = useGameStore((state) => state.levelNumber)

  // Start downloading the game code and assets while the player picks a level
  useEffect(() => {
    void import('./game/assets').then(({ preloadAssets }) => preloadAssets())
  }, [])

  return (
    <MantineProvider theme={theme} forceColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
      {levelNumber === null ? (
        <MainMenu />
      ) : (
        <Suspense fallback={null}>
          <GameView />
        </Suspense>
      )}
    </MantineProvider>
  )
}
