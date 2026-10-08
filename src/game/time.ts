/** Formats milliseconds as `MM:SS.cc`, e.g. `01:07.25`. */
export function formatTime(milliseconds: number) {
  const centiseconds = Math.floor(milliseconds / 10)
  const minutes = Math.floor(centiseconds / 6000)
  const seconds = Math.floor(centiseconds / 100) % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds % 100)}`
}
