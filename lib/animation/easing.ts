import type { Keyframe, EasingCharacter } from "@/lib/types/animation"

function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  return (t: number): number => {
    if (t <= 0) return 0
    if (t >= 1) return 1

    let p = t
    for (let i = 0; i < 10; i++) {
      const p2 = p * p
      const p3 = p2 * p
      const bx = 3 * x1 * p * (1 - p) * (1 - p) + 3 * x2 * p2 * (1 - p) + p3
      if (Math.abs(bx - t) < 0.001) break
      const dx = 3 * x1 * (1 - p) * (1 - p) + 6 * (x2 - x1) * p * (1 - p) + 3 * (1 - x2) * p2
      if (Math.abs(dx) < 0.00001) { p = t; break }
      p -= (bx - t) / dx
    }

    const p2 = p * p
    const p3 = p2 * p
    return 3 * y1 * p * (1 - p) * (1 - p) + 3 * y2 * p2 * (1 - p) + p3
  }
}

export const easeSmooth = cubicBezier(0.4, 0, 0.2, 1)
export const easeBouncy = cubicBezier(0.34, 1.56, 0.64, 1)
export const easeSharp = cubicBezier(0.16, 1, 0.3, 1)
export const easeElastic = cubicBezier(0.68, -0.55, 0.27, 1.55)

const easingMap: Record<EasingCharacter, (t: number) => number> = {
  smooth: easeSmooth,
  bouncy: easeBouncy,
  sharp: easeSharp,
  elastic: easeElastic,
}

export function getEasingFunction(character: string): (t: number) => number {
  return easingMap[character as EasingCharacter] ?? easeSmooth
}

export function parseCubicBezierString(s: string): (t: number) => number {
  const match = s.match(/cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/)
  if (match) {
    return cubicBezier(
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3]),
      parseFloat(match[4]),
    )
  }
  return easeSmooth
}

export function interpolate(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

export function getValueAtTime(
  keyframes: Keyframe[],
  currentTime: number,
  fps: number,
): number {
  if (keyframes.length === 0) return 0
  if (keyframes.length === 1) return keyframes[0].value as number

  const currentFrame = currentTime * fps

  if (currentFrame <= keyframes[0].frame) return keyframes[0].value as number
  if (currentFrame >= keyframes[keyframes.length - 1].frame) return keyframes[keyframes.length - 1].value as number

  let prev = keyframes[0]
  let next = keyframes[keyframes.length - 1]

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (currentFrame >= keyframes[i].frame && currentFrame <= keyframes[i + 1].frame) {
      prev = keyframes[i]
      next = keyframes[i + 1]
      break
    }
  }

  const range = next.frame - prev.frame
  if (range === 0) return prev.value as number

  const rawProgress = (currentFrame - prev.frame) / range
  const easingFn = parseCubicBezierString(prev.easing)
  const easedProgress = easingFn(rawProgress)

  const prevVal = prev.value as number
  const nextVal = next.value as number
  return interpolate(prevVal, nextVal, easedProgress)
}
