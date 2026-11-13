export const SHAKE_CONFIG = Object.freeze({
  windowMs: 800,
  minVelocity: 850,
  minSegmentDistance: 34,
  axisDominance: 1.65,
  requiredReversals: 3,
  cooldownMs: 1800,
  effectDurationMs: 520,
})

export function createShakeDetector(onTrigger, overrides = {}) {
  const config = { ...SHAKE_CONFIG, ...overrides }
  let previous = null
  let activeAxis = null
  let direction = 0
  let segmentDistance = 0
  let reversals = []
  let cooldownUntil = 0

  function reset() {
    previous = null
    activeAxis = null
    direction = 0
    segmentDistance = 0
    reversals = []
  }

  function push({ x, y, time, pointerType = 'mouse' }) {
    if (pointerType !== 'mouse') return false
    if (!previous) {
      previous = { x, y, time }
      return false
    }

    const dt = Math.max(time - previous.time, 1)
    const dx = x - previous.x
    const dy = y - previous.y
    const velocityX = Math.abs(dx) / dt * 1000
    const velocityY = Math.abs(dy) / dt * 1000
    const axis = velocityX >= velocityY * config.axisDominance
      ? 'x'
      : velocityY >= velocityX * config.axisDominance ? 'y' : null
    previous = { x, y, time }

    if (!axis) return false

    const axisVelocity = axis === 'x' ? velocityX : velocityY
    const axisDelta = axis === 'x' ? dx : dy
    const nextDirection = Math.sign(axisDelta)
    if (!nextDirection || axisVelocity < config.minVelocity) return false

    if (activeAxis && axis !== activeAxis) {
      direction = 0
      segmentDistance = 0
      reversals = []
    }
    activeAxis = axis

    segmentDistance += Math.abs(axisDelta)
    if (!direction) {
      direction = nextDirection
      return false
    }

    if (nextDirection !== direction) {
      if (segmentDistance >= config.minSegmentDistance) {
        reversals.push(time)
        reversals = reversals.filter((timestamp) => time - timestamp <= config.windowMs)
      }
      direction = nextDirection
      segmentDistance = Math.abs(axisDelta)
    }

    if (reversals.length >= config.requiredReversals && time >= cooldownUntil) {
      cooldownUntil = time + config.cooldownMs
      reversals = []
      segmentDistance = 0
      onTrigger()
      return true
    }
    return false
  }

  return { config, push, reset }
}
