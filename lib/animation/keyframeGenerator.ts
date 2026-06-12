import type { AnimationConfig, KeyframeData, Keyframe } from "@/lib/types/animation"

function frame(time: number, fps: number): number {
  return Math.round(time * fps)
}

function kf(frame: number, value: number, easing: string): Keyframe {
  return { frame, value, easing }
}

function easingCharToName(c: string): string {
  switch (c) {
    case "smooth": return "cubic-bezier(0.4,0,0.2,1)"
    case "bouncy": return "cubic-bezier(0.34,1.56,0.64,1)"
    case "sharp": return "cubic-bezier(0.16,1,0.3,1)"
    case "elastic": return "cubic-bezier(0.68,-0.55,0.27,1.55)"
    default: return "cubic-bezier(0.4,0,0.2,1)"
  }
}

function generateBackgroundKeyframes(config: AnimationConfig) {
  const { fps, totalDuration } = config.timing
  const total = Math.ceil(totalDuration * fps)
  const fadeInEnd = frame(0.3, fps)
  const bgEasing = easingCharToName(config.easing.character)

  const opacity: Keyframe[] = [
    kf(0, 0, "cubic-bezier(0.4,0,0.2,1)"),
    kf(fadeInEnd, 1, "cubic-bezier(0.4,0,0.2,1)"),
    kf(total, 1, "cubic-bezier(0.4,0,0.2,1)"),
  ]

  const colorShift: Keyframe[] = []
  const scale: Keyframe[] = []

  if (config.background.type === "gradient_breathe") {
    const cycleFrames = Math.round(1.5 * fps)
    const halfCycle = Math.round(cycleFrames / 2)
    for (let t = 0; t <= total; t += halfCycle) {
      const isLow = (t / halfCycle) % 2 === 0
      colorShift.push(kf(Math.min(t, total), isLow ? 0 : 1, bgEasing))
    }
    if (colorShift.length < 2) {
      colorShift.push(kf(0, 0, bgEasing), kf(total, 0, bgEasing))
    }
  } else {
    colorShift.push(kf(0, 0, bgEasing), kf(total, 0, bgEasing))
  }

  if (config.background.type === "radial_pulse") {
    const pulseFrames = Math.round(1.5 * fps)
    const halfPulse = Math.round(pulseFrames / 2)
    for (let t = 0; t <= total; t += halfPulse) {
      const isPeak = (t / halfPulse) % 2 === 1
      scale.push(kf(Math.min(t, total), isPeak ? 1.05 : 1.0, bgEasing))
    }
    if (scale.length < 2) {
      scale.push(kf(0, 1.0, bgEasing), kf(total, 1.0, bgEasing))
    }
  } else {
    scale.push(kf(0, 1.0, bgEasing), kf(total, 1.0, bgEasing))
  }

  return { type: config.background.type, keyframes: { opacity, colorShift, scale } }
}

function generateParticleKeyframes(config: AnimationConfig) {
  const { fps, totalDuration } = config.timing
  const total = Math.ceil(totalDuration * fps)
  const startFrame = frame(0.2, fps)
  const fadeInEnd = Math.min(startFrame + frame(0.5, fps), total)
  const bgEasing = easingCharToName(config.easing.character)
  const countVal = config.particles.enabled ? config.particles.count : 0

  const opacity: Keyframe[] = config.particles.enabled
    ? [
        kf(0, 0, "cubic-bezier(0.4,0,0.2,1)"),
        kf(startFrame, 0, "cubic-bezier(0.4,0,0.2,1)"),
        kf(fadeInEnd, config.particles.opacity, "cubic-bezier(0.4,0,0.2,1)"),
        kf(total, config.particles.opacity, "cubic-bezier(0.4,0,0.2,1)"),
      ]
    : [kf(0, 0, bgEasing), kf(total, 0, bgEasing)]

  const count: Keyframe[] = [
    kf(0, 0, "cubic-bezier(0.4,0,0.2,1)"),
    kf(startFrame, 0, "cubic-bezier(0.4,0,0.2,1)"),
    kf(fadeInEnd, countVal, "cubic-bezier(0.4,0,0.2,1)"),
    kf(total, countVal, "cubic-bezier(0.4,0,0.2,1)"),
  ]

  const speed: Keyframe[] = [
    kf(0, config.particles.speed, bgEasing),
    kf(total, config.particles.speed, bgEasing),
  ]

  const sizeVal = config.particles.enabled ? (config.particles.sizeRange[0] + config.particles.sizeRange[1]) / 2 : 0
  const size: Keyframe[] = [
    kf(0, sizeVal, bgEasing),
    kf(total, sizeVal, bgEasing),
  ]

  return { type: config.particles.type, keyframes: { opacity, count, speed, size } }
}

function generateLogoKeyframes(config: AnimationConfig) {
  const { fps, totalDuration } = config.timing
  const total = Math.ceil(totalDuration * fps)
  const start = frame(config.logo.entranceStart, fps)
  const duration = Math.max(frame(config.logo.entranceDuration, fps), 1)
  const end = Math.min(start + duration, total)
  const charMap: Record<string, string> = { smooth: "cubic-bezier(0.4,0,0.2,1)", bouncy: "cubic-bezier(0.34,1.56,0.64,1)", sharp: "cubic-bezier(0.16,1,0.3,1)", elastic: "cubic-bezier(0.68,-0.55,0.27,1.55)" }
  const logoEasing = charMap[config.easing.character] ?? "cubic-bezier(0.4,0,0.2,1)"
  const smoothEasing = "cubic-bezier(0.4,0,0.2,1)"

  const scale: Keyframe[] = []
  const opacity: Keyframe[] = []
  const position: Keyframe[] = []
  const rotation: Keyframe[] = []

  if (config.logo.provided) {
    scale.push(kf(0, 0, smoothEasing))
    opacity.push(kf(0, 0, smoothEasing))
    position.push(kf(0, 0, smoothEasing))
    rotation.push(kf(0, 0, smoothEasing))

    switch (config.logo.entranceAnimation) {
      case "scale_overshoot": {
        const mid = start + Math.round(duration * 0.6)
        scale.push(kf(start, 0, logoEasing))
        scale.push(kf(mid, 1.1, logoEasing))
        scale.push(kf(end, config.logo.scale, smoothEasing))
        opacity.push(kf(start, 1, smoothEasing))
        opacity.push(kf(end, 1, smoothEasing))
        position.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        rotation.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        break
      }
      case "scale_from_zero": {
        scale.push(kf(start, 0, logoEasing))
        scale.push(kf(end, config.logo.scale, smoothEasing))
        opacity.push(kf(start, 1, smoothEasing))
        opacity.push(kf(end, 1, smoothEasing))
        position.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        rotation.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        break
      }
      case "fade_up": {
        scale.push(kf(start, config.logo.scale, smoothEasing))
        scale.push(kf(end, config.logo.scale, smoothEasing))
        opacity.push(kf(start, 0, smoothEasing))
        opacity.push(kf(end, 1, smoothEasing))
        position.push(kf(start, 20, smoothEasing))
        position.push(kf(end, 0, smoothEasing))
        rotation.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        break
      }
      case "drop_in": {
        scale.push(kf(start, 0.5, logoEasing))
        scale.push(kf(end, config.logo.scale, smoothEasing))
        opacity.push(kf(start, 1, smoothEasing))
        opacity.push(kf(end, 1, smoothEasing))
        position.push(kf(start, -50, smoothEasing))
        position.push(kf(end, 0, smoothEasing))
        rotation.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        break
      }
      case "glitch_in": {
        scale.push(kf(start, config.logo.scale, smoothEasing))
        scale.push(kf(end, config.logo.scale, smoothEasing))
        const glitchCount = 5
        const glitchStep = Math.round(duration / glitchCount)
        for (let i = 0; i < glitchCount; i++) {
          const f = start + i * glitchStep
          opacity.push(kf(f, i % 2 === 0 ? 0 : 1, smoothEasing))
          position.push(kf(f, i % 2 === 0 ? 5 : -5, smoothEasing))
        }
        opacity.push(kf(end, 1, smoothEasing))
        position.push(kf(end, 0, smoothEasing))
        rotation.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
        break
      }
    }

    if (config.logo.idleAnimation === "glow_pulse") {
      const idleStart = Math.max(end, frame(config.timing.holdStart, fps))
      const pulseFrames = Math.round(2 * fps)
      const halfPulse = Math.round(pulseFrames / 2)
      const intensity = 0.3 + config.logo.idleIntensity * 0.4
      for (let t = idleStart; t <= total; t += halfPulse) {
        const isPeak = ((t - idleStart) / halfPulse) % 2 === 1
        scale.push(kf(Math.min(t, total), isPeak ? 1.0 + intensity * 0.1 : config.logo.scale, smoothEasing))
      }
    } else if (config.logo.idleAnimation === "float") {
      const idleStart = Math.max(end, frame(config.timing.holdStart, fps))
      const floatFrames = Math.round(3 * fps)
      const halfFloat = Math.round(floatFrames / 2)
      for (let t = idleStart; t <= total; t += halfFloat) {
        const isPeak = ((t - idleStart) / halfFloat) % 2 === 1
        position.push(kf(Math.min(t, total), isPeak ? -5 : 0, smoothEasing))
      }
    }
  } else {
    scale.push(kf(0, 0, smoothEasing), kf(total, 0, smoothEasing))
    opacity.push(kf(0, 0, smoothEasing), kf(total, 0, smoothEasing))
    position.push(kf(0, 0, smoothEasing), kf(total, 0, smoothEasing))
    rotation.push(kf(0, 0, smoothEasing), kf(total, 0, smoothEasing))
  }

  return {
    type: config.logo.entranceAnimation,
    keyframes: { scale, opacity, position, rotation },
  }
}

function generateTextLayerKeyframes(
  text: string,
  animation: string,
  startTime: number,
  durationTime: number,
  config: AnimationConfig,
): { text: string; keyframes: { opacity: Keyframe[]; position: Keyframe[]; scale: Keyframe[] } } {
  const { fps, totalDuration } = config.timing
  const total = Math.ceil(totalDuration * fps)
  const start = frame(startTime, fps)
  const dur = Math.max(frame(durationTime, fps), 1)
  const end = Math.min(start + dur, total)
  const charMap: Record<string, string> = { smooth: "cubic-bezier(0.4,0,0.2,1)", bouncy: "cubic-bezier(0.34,1.56,0.64,1)", sharp: "cubic-bezier(0.16,1,0.3,1)", elastic: "cubic-bezier(0.68,-0.55,0.27,1.55)" }
  const easing = charMap[config.easing.character] ?? "cubic-bezier(0.4,0,0.2,1)"
  const smoothEasing = "cubic-bezier(0.4,0,0.2,1)"

  const opacity: Keyframe[] = []
  const position: Keyframe[] = []
  const scale: Keyframe[] = []

  opacity.push(kf(0, 0, smoothEasing))
  position.push(kf(0, 0, smoothEasing))
  scale.push(kf(0, 0, smoothEasing))

  switch (animation) {
    case "typewriter": {
      const chars = text.split("")
      const charDelay = Math.round(dur / chars.length)
      let prevF = start
      for (let i = 0; i < chars.length; i++) {
        const appearAt = prevF
        const doneAt = Math.min(appearAt + Math.round(0.1 * fps), end)
        opacity.push(kf(appearAt, 0, smoothEasing))
        opacity.push(kf(doneAt, 1, smoothEasing))
        prevF = appearAt + charDelay
      }
      const lastFadeIn = opacity[opacity.length - 1]?.frame ?? start
      position.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
      scale.push(kf(start, 1, smoothEasing), kf(end, 1, smoothEasing))
      break
    }
    case "fade_up_stagger": {
      const words = text.split(/\s+/)
      const wordDelay = Math.round(dur / words.length)
      let prevF = start
      for (let i = 0; i < words.length; i++) {
        const wordStart = prevF
        const wordEnd = Math.min(wordStart + Math.round(0.15 * fps), end)
        opacity.push(kf(wordStart, 0, smoothEasing))
        opacity.push(kf(wordEnd, 1, smoothEasing))
        position.push(kf(wordStart, 20, smoothEasing))
        position.push(kf(wordEnd, 0, smoothEasing))
        prevF = wordStart + wordDelay
      }
      scale.push(kf(start, 1, smoothEasing), kf(end, 1, smoothEasing))
      break
    }
    case "split_reveal": {
      const chars = text.split("")
      const charDelay = Math.round(dur / chars.length)
      let prevF = start
      for (let i = 0; i < chars.length; i++) {
        const charStart = prevF
        const charEnd = Math.min(charStart + Math.round(0.1 * fps), end)
        opacity.push(kf(charStart, 0, smoothEasing))
        opacity.push(kf(charEnd, 1, smoothEasing))
        scale.push(kf(charStart, 0.5, easing))
        scale.push(kf(charEnd, 1, smoothEasing))
        prevF = charStart + charDelay
      }
      position.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
      break
    }
    case "letter_drop": {
      const chars = text.split("")
      const charDelay = Math.round(dur / chars.length)
      let prevF = start
      for (let i = 0; i < chars.length; i++) {
        const charStart = prevF
        const charEnd = Math.min(charStart + Math.round(0.12 * fps), end)
        opacity.push(kf(charStart, 0, smoothEasing))
        opacity.push(kf(charEnd, 1, smoothEasing))
        position.push(kf(charStart, -40, smoothEasing))
        position.push(kf(charEnd, 0, easing))
        prevF = charStart + charDelay
      }
      scale.push(kf(start, 1, smoothEasing), kf(end, 1, smoothEasing))
      break
    }
    default: {
      opacity.push(kf(start, 1, smoothEasing), kf(end, 1, smoothEasing))
      position.push(kf(start, 0, smoothEasing), kf(end, 0, smoothEasing))
      scale.push(kf(start, 1, smoothEasing), kf(end, 1, smoothEasing))
    }
  }

  if (end < total) {
    opacity.push(kf(total, 1, smoothEasing))
    position.push(kf(total, 0, smoothEasing))
    scale.push(kf(total, 1, smoothEasing))
  }

  return { text, keyframes: { opacity, position, scale } }
}

export function generateKeyframes(config: AnimationConfig): KeyframeData {
  const fps = config.timing.fps ?? 60
  const totalFrames = Math.ceil(config.timing.totalDuration * fps)

  const background = generateBackgroundKeyframes(config)
  const particles = generateParticleKeyframes(config)
  const logo = generateLogoKeyframes(config)
  const textPrimary = generateTextLayerKeyframes(
    config.text.primaryText,
    config.text.primaryAnimation,
    config.text.primaryStart,
    config.text.primaryDuration,
    config,
  )
  const textSecondary = generateTextLayerKeyframes(
    config.text.secondaryText,
    config.text.secondaryAnimation,
    config.text.secondaryStart,
    config.text.secondaryDuration,
    config,
  )

  return {
    fps,
    totalFrames,
    layers: {
      background,
      particles,
      logo,
      textPrimary,
      textSecondary,
    },
  }
}
