import { LEVEL_COUNT } from './levels'

/** Debug mode (leva panel, labels, debug camera) is enabled with `#debug` or `?debug`. */
export const isDebug = window.location.hash === '#debug' || new URLSearchParams(window.location.search).has('debug')

/** A level can be opened directly with `#<level number>`, e.g. `#7`. */
export function getLevelFromHash(): number | null {
  const levelNumber = Number(window.location.hash.replace('#', ''))
  return Number.isInteger(levelNumber) && levelNumber >= 1 && levelNumber <= LEVEL_COUNT ? levelNumber : null
}

export function setLevelHash(levelNumber: number | null) {
  const { pathname, search, hash } = window.location
  const nextHash = levelNumber === null ? '' : `#${levelNumber}`
  // Keep `#debug` alive while browsing the menu
  if (levelNumber === null && hash === '#debug') return
  if (hash !== nextHash) window.history.replaceState(null, '', `${pathname}${search}${nextHash}`)
}
