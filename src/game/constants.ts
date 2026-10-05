import type { RingId } from './levels'

export const RING_IDS: readonly RingId[] = [1, 2, 3]
export const NUMBER_OF_RINGS = RING_IDS.length

/** Every ring (and the socket circle) is divided into 12 slots. */
export const SLOT_COUNT = 12
export const SLOT_ANGLE = (Math.PI * 2) / SLOT_COUNT

export const RING_SPACING = 1.2
export const RING_TUBE_RADIUS = 0.06
export const ringRadius = (ring: RingId) => ring * RING_SPACING + 1

export const SOCKET_RADIUS = NUMBER_OF_RINGS + 3.075
export const SOCKET_Z_OFFSET = 0.45

/** A beam reaches through the center of the board and ends right at the sockets on the other side. */
export const laserMaxLength = (ring: RingId) => ringRadius(ring) + SOCKET_RADIUS - 0.25

export const slotAngle = (slot: number) => slot * SLOT_ANGLE

export const slotPosition = (slot: number, radius: number, z = 0): [number, number, number] => {
  const angle = slotAngle(slot)
  return [radius * Math.cos(angle), radius * Math.sin(angle), z]
}

/** Ring rotation animation, also used to rate limit the input. */
export const ROTATION_DURATION = 0.2

/** Input cooldowns in milliseconds. */
export const SELECT_COOLDOWN = 100
export const ROTATE_COOLDOWN = 200

/** Delay before the level complete popup shows up, in milliseconds. */
export const WIN_POPUP_DELAY = 1000
