import type { AnimationConfig } from "@/lib/types/animation"
import {
  BACKGROUND_TYPES,
  PARTICLE_TYPES,
  LOGO_ENTRANCES,
  IDLE_ANIMATIONS,
  TEXT_ANIMATIONS,
} from "@/constants/animationLibrary"

export const FALLBACK_CONFIG: AnimationConfig = {
  brand: { name: "Brand", tagline: "Your Tagline", industry: "tech", personality: ["modern", "clean", "bold"] },
  colors: {
    background: "#0A0A0F",
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    glow: "rgba(99,102,241,0.3)",
    textPrimary: "#FFFFFF",
    textSecondary: "#888888",
  },
  timing: { totalDuration: 3.5, introEnd: 1.4, holdStart: 1.4, holdEnd: 2.6, outroStart: 2.6, energyLevel: 6, fps: 60 },
  easing: { primary: "cubic-bezier(0.34,1.56,0.64,1)", secondary: "cubic-bezier(0.4,0,0.2,1)", character: "bouncy" },
  background: { type: "radial_pulse", intensity: 0.5, speed: 1.0 },
  particles: {
    enabled: true,
    type: "rising_particles",
    count: 15,
    color: "#6366F1",
    sizeRange: [2, 4],
    speed: 1.0,
    opacity: 0.5,
  },
  logo: {
    provided: false,
    imageData: null,
    entranceAnimation: "scale_overshoot",
    entranceStart: 0.5,
    entranceDuration: 0.8,
    idleAnimation: "glow_pulse",
    idleIntensity: 0.3,
    scale: 1.0,
  },
  text: {
    primaryText: "Brand Name",
    primaryAnimation: "fade_up_stagger",
    primaryStart: 1.2,
    primaryDuration: 0.5,
    secondaryText: "Your Tagline",
    secondaryAnimation: "fade_up_stagger",
    secondaryStart: 1.6,
    secondaryDuration: 0.4,
    fontWeight: "bold",
    letterSpacing: "wide",
  },
  canvas: { width: 1080, height: 1920, aspectRatio: "portrait" },
  sequence: [
    { time: 0.0, event: "background_starts" },
    { time: 0.2, event: "particles_begin" },
    { time: 0.5, event: "logo_enters" },
    { time: 1.2, event: "primary_text_enters" },
    { time: 1.6, event: "secondary_text_enters" },
    { time: 2.6, event: "hold_begins" },
    { time: 3.5, event: "animation_complete" },
  ],
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

const REQUIRED_TOP_KEYS: (keyof AnimationConfig)[] = [
  "brand",
  "colors",
  "timing",
  "easing",
  "background",
  "particles",
  "logo",
  "text",
  "sequence",
]

function extractJSON(raw: string): string {
  const trimmed = raw.trim()
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) return codeBlockMatch[1].trim()

  const braceStart = trimmed.indexOf("{")
  const braceEnd = trimmed.lastIndexOf("}")
  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    return trimmed.slice(braceStart, braceEnd + 1)
  }

  return trimmed
}

function isInArray(val: string, arr: readonly string[]): boolean {
  return arr.includes(val)
}

function recalculateTiming(duration: number, energy: number) {
  const introEnd = duration * 0.4
  const holdStart = introEnd
  const holdEnd = duration * 0.75
  const outroStart = holdEnd
  return { totalDuration: duration, introEnd, holdStart, holdEnd, outroStart, energyLevel: energy, fps: 60 }
}

function rebuildSequence(timing: AnimationConfig["timing"]): AnimationConfig["sequence"] {
  return [
    { time: 0.0, event: "background_starts" },
    { time: 0.2, event: "particles_begin" },
    { time: 0.5, event: "logo_enters" },
    { time: 1.2, event: "primary_text_enters" },
    { time: 1.6, event: "secondary_text_enters" },
    { time: timing.holdEnd, event: "hold_begins" },
    { time: timing.totalDuration, event: "animation_complete" },
  ]
}

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function validateAndParse(rawResponse: string): AnimationConfig {
  let config: Partial<AnimationConfig>
  let failCount = 0

  const jsonStr = extractJSON(rawResponse)

  try {
    config = JSON.parse(jsonStr)
  } catch {
    return cloneDeep(FALLBACK_CONFIG)
  }

  if (typeof config !== "object" || config === null) {
    return cloneDeep(FALLBACK_CONFIG)
  }

  const result = cloneDeep(FALLBACK_CONFIG)

  for (const key of REQUIRED_TOP_KEYS) {
    if (config[key] === undefined || config[key] === null) {
      failCount++
    } else {
      ;(result as any)[key] = config[key]
    }
  }

  if (result.colors) {
    const colorFields: (keyof AnimationConfig["colors"])[] = [
      "background",
      "primary",
      "secondary",
      "accent",
      "textPrimary",
      "textSecondary",
    ]
    for (const field of colorFields) {
      const val = result.colors[field]
      if (typeof val !== "string" || !HEX_REGEX.test(val)) {
        result.colors[field] = FALLBACK_CONFIG.colors[field]
        failCount++
      }
    }
    if (typeof result.colors.glow !== "string" || !result.colors.glow.startsWith("rgba")) {
      result.colors.glow = FALLBACK_CONFIG.colors.glow
      failCount++
    }
  }

  if (result.timing) {
    const t = result.timing
    if (
      typeof t.totalDuration !== "number" ||
      typeof t.introEnd !== "number" ||
      typeof t.holdStart !== "number" ||
      typeof t.holdEnd !== "number" ||
      typeof t.outroStart !== "number"
    ) {
      failCount++
    } else {
      const mathOk =
        t.introEnd < t.holdStart &&
        t.holdStart <= t.holdEnd &&
        t.holdEnd < t.outroStart &&
        t.outroStart <= t.totalDuration

      if (!mathOk) {
        result.timing = recalculateTiming(t.totalDuration, t.energyLevel)
        failCount++
      }
    }

    if (t.totalDuration < 2.5 || t.totalDuration > 8.0) {
      result.timing.totalDuration = Math.max(2.5, Math.min(8.0, t.totalDuration))
      const recalc = recalculateTiming(result.timing.totalDuration, t.energyLevel)
      result.timing.introEnd = recalc.introEnd
      result.timing.holdStart = recalc.holdStart
      result.timing.holdEnd = recalc.holdEnd
      result.timing.outroStart = recalc.outroStart
      failCount++
    }

    if (typeof t.energyLevel !== "number" || t.energyLevel < 1 || t.energyLevel > 10) {
      result.timing.energyLevel = Math.max(1, Math.min(10, typeof t.energyLevel === "number" ? t.energyLevel : 6))
      failCount++
    }

    result.timing.fps = 60
  }

  if (result.background) {
    if (!isInArray(result.background.type, BACKGROUND_TYPES)) {
      result.background.type = "radial_pulse"
      failCount++
    }
    if (typeof result.background.intensity !== "number") {
      result.background.intensity = 0.5
      failCount++
    }
    if (typeof result.background.speed !== "number") {
      result.background.speed = 1.0
      failCount++
    }
  }

  if (result.particles) {
    if (!isInArray(result.particles.type, PARTICLE_TYPES)) {
      result.particles.type = "rising_particles"
      failCount++
    }
    if (typeof result.particles.count !== "number") result.particles.count = 15
    if (typeof result.particles.speed !== "number") result.particles.speed = 1.0
    if (typeof result.particles.opacity !== "number") result.particles.opacity = 0.5
  }

  if (result.logo) {
    if (!isInArray(result.logo.entranceAnimation, LOGO_ENTRANCES)) {
      result.logo.entranceAnimation = "scale_overshoot"
      failCount++
    }
    if (!isInArray(result.logo.idleAnimation, IDLE_ANIMATIONS)) {
      result.logo.idleAnimation = "glow_pulse"
      failCount++
    }
    if (typeof result.logo.entranceStart !== "number") result.logo.entranceStart = 0.5
    if (typeof result.logo.entranceDuration !== "number") result.logo.entranceDuration = 0.8
    if (typeof result.logo.idleIntensity !== "number") result.logo.idleIntensity = 0.3
    if (typeof result.logo.scale !== "number") result.logo.scale = 1.0
  }

  if (result.text) {
    if (!isInArray(result.text.primaryAnimation, TEXT_ANIMATIONS)) {
      result.text.primaryAnimation = "fade_up_stagger"
      failCount++
    }
    if (!isInArray(result.text.secondaryAnimation, TEXT_ANIMATIONS)) {
      result.text.secondaryAnimation = "fade_up_stagger"
      failCount++
    }
    if (typeof result.text.primaryStart !== "number") result.text.primaryStart = 1.2
    if (typeof result.text.primaryDuration !== "number") result.text.primaryDuration = 0.5
    if (typeof result.text.secondaryStart !== "number") result.text.secondaryStart = 1.6
    if (typeof result.text.secondaryDuration !== "number") result.text.secondaryDuration = 0.4
  }

  if (result.sequence) {
    if (!Array.isArray(result.sequence) || result.sequence.length !== 7) {
      result.sequence = rebuildSequence(result.timing)
      failCount++
    }
  }

  if (failCount > 3) {
    return cloneDeep(FALLBACK_CONFIG)
  }

  return result
}
