export type SlotObject = 'empty' | 'laser' | 'blocker'

/** The 12 slots of a ring, slot `n` is stored at index `n - 1`. */
export type RingLayout = readonly SlotObject[]

export interface Level {
  /** Positions (0-11) of the sockets around the board that all need to be hit by a laser. */
  socketIndexes: readonly number[]
  /** Object layout of each ring, keyed by ring id (1 = innermost). */
  ringObjects: Readonly<Record<RingId, RingLayout>>
}

export type RingId = 1 | 2 | 3

const _ = 'empty'
const L = 'laser'
const B = 'blocker'

export const LEVELS: readonly Level[] = [
  {
    socketIndexes: [3, 7, 11],
    ringObjects: {
      1: [_, _, _, _, _, _, _, _, _, _, _, L],
      2: [_, _, _, _, _, _, _, _, _, L, _, _],
      3: [_, _, _, _, _, _, _, L, _, _, _, _],
    },
  },
  {
    socketIndexes: [6, 8, 10, 11],
    ringObjects: {
      1: [_, _, _, _, _, _, _, L, _, _, _, _],
      2: [_, _, _, _, _, _, L, _, _, _, _, _],
      3: [_, _, _, _, _, _, _, _, L, L, _, _],
    },
  },
  {
    socketIndexes: [4, 6, 7, 9],
    ringObjects: {
      1: [_, _, _, _, _, _, _, _, L, _, _, _],
      2: [_, _, _, B, _, L, _, _, _, _, _, _],
      3: [_, _, L, _, L, _, _, _, _, _, _, _],
    },
  },
  {
    socketIndexes: [2, 4, 7, 9],
    ringObjects: {
      1: [_, _, _, L, _, _, _, _, _, _, L, _],
      2: [B, _, B, _, _, _, _, B, _, _, _, _],
      3: [_, L, _, _, _, _, L, _, _, _, _, _],
    },
  },
  {
    socketIndexes: [1, 2, 3, 4, 5],
    ringObjects: {
      1: [_, _, _, _, _, _, _, _, _, _, _, L],
      2: [_, _, _, _, _, _, L, B, L, _, _, _],
      3: [_, _, _, L, B, B, B, L, _, _, _, _],
    },
  },
  {
    socketIndexes: [0, 2, 4, 9],
    ringObjects: {
      1: [_, _, B, _, _, _, L, L, _, _, _, L],
      2: [_, _, L, _, L, _, _, B, _, L, _, _],
      3: [_, L, B, _, B, _, _, _, _, _, _, _],
    },
  },
  {
    socketIndexes: [6, 7, 8, 9],
    ringObjects: {
      1: [_, _, _, _, L, L, _, _, _, _, _, _],
      2: [_, _, _, _, _, _, _, L, _, _, B, _],
      3: [_, B, _, L, _, _, _, B, _, _, _, _],
    },
  },
  {
    socketIndexes: [0, 2, 4, 9],
    ringObjects: {
      1: [_, L, B, _, _, _, _, _, _, _, _, _],
      2: [_, L, _, _, _, B, _, _, _, _, _, _],
      3: [B, _, _, _, _, L, _, _, _, _, L, _],
    },
  },
  {
    socketIndexes: [1, 3, 5, 6, 8],
    ringObjects: {
      1: [_, L, _, L, _, _, _, _, _, _, B, _],
      2: [_, _, _, _, _, L, _, _, _, B, _, _],
      3: [_, L, _, _, L, _, _, _, _, _, _, B],
    },
  },
  {
    socketIndexes: [1, 3, 11],
    ringObjects: {
      1: [_, L, _, _, _, _, _, _, _, _, _, _],
      2: [_, L, _, L, _, B, _, _, _, _, _, _],
      3: [L, _, B, _, _, _, _, _, _, _, B, _],
    },
  },
  {
    socketIndexes: [3, 4, 8, 11],
    ringObjects: {
      1: [_, _, _, _, L, _, _, _, _, _, _, L],
      2: [B, L, _, _, _, _, _, _, _, _, _, _],
      3: [_, _, _, _, _, B, _, _, _, _, L, _],
    },
  },
  {
    socketIndexes: [3, 5, 6, 8],
    ringObjects: {
      1: [_, _, L, _, _, _, B, _, _, _, _, _],
      2: [_, _, L, _, _, L, _, _, _, _, _, _],
      3: [_, _, L, L, _, B, B, _, _, _, _, _],
    },
  },
  {
    socketIndexes: [1, 5, 8, 10],
    ringObjects: {
      1: [L, _, _, L, _, _, _, _, _, _, _, _],
      2: [_, _, B, _, _, _, _, L, _, L, _, _],
      3: [B, _, _, L, _, _, _, L, _, _, B, _],
    },
  },
  {
    socketIndexes: [0, 8, 9, 10, 11],
    ringObjects: {
      1: [_, B, _, _, _, _, _, _, L, _, L, _],
      2: [_, _, _, _, _, _, B, _, _, _, L, _],
      3: [_, _, _, _, _, L, _, L, _, _, _, _],
    },
  },
  {
    socketIndexes: [0, 2, 4, 9, 11],
    ringObjects: {
      1: [_, _, _, L, _, _, _, _, L, _, _, _],
      2: [_, _, _, _, _, _, _, _, L, _, B, _],
      3: [L, _, L, _, _, _, _, B, _, _, _, _],
    },
  },
]

export const LEVEL_COUNT = LEVELS.length

export const getLevel = (levelNumber: number): Level | undefined => LEVELS[levelNumber - 1]
