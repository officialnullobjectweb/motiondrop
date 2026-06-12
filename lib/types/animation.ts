export type BackgroundEffectType =
  | "gradient_breathe"
  | "radial_pulse"
  | "particle_field"
  | "geometric_shapes"
  | "grid_lines"
  | "solid_clean"

export type ParticleType =
  | "rising_particles"
  | "burst_particles"
  | "orbit_particles"
  | "spark_trail"
  | "confetti"
  | "none"

export type LogoEntranceType =
  | "scale_from_zero"
  | "scale_overshoot"
  | "fade_up"
  | "drop_in"
  | "glitch_in"

export type IdleAnimationType =
  | "glow_pulse"
  | "float"
  | "none"

export type TextAnimationType =
  | "typewriter"
  | "fade_up_stagger"
  | "split_reveal"
  | "letter_drop"

export type EasingCharacter =
  | "smooth"
  | "bouncy"
  | "sharp"
  | "elastic"

export type AspectRatio =
  | "portrait"
  | "square"
  | "desktop"

export type ProviderName =
  | "gemini"
  | "openrouter"
  | "groq"
  | "openai"
  | "anthropic"

export interface SequenceEvent {
  time: number
  event: string
}

export interface AnimationConfig {
  brand: {
    name: string
    tagline: string
    industry: string
    personality: string[]
  }
  colors: {
    background: string
    primary: string
    secondary: string
    accent: string
    glow: string
    textPrimary: string
    textSecondary: string
  }
  timing: {
    totalDuration: number
    introEnd: number
    holdStart: number
    holdEnd: number
    outroStart: number
    energyLevel: number
    fps: number
  }
  easing: {
    primary: string
    secondary: string
    character: EasingCharacter
  }
  background: {
    type: BackgroundEffectType
    intensity: number
    speed: number
  }
  particles: {
    enabled: boolean
    type: ParticleType
    count: number
    color: string
    sizeRange: [number, number]
    speed: number
    opacity: number
  }
  logo: {
    provided: boolean
    imageData: string | null
    entranceAnimation: LogoEntranceType
    entranceStart: number
    entranceDuration: number
    idleAnimation: IdleAnimationType
    idleIntensity: number
    scale: number
  }
  text: {
    primaryText: string
    primaryAnimation: TextAnimationType
    primaryStart: number
    primaryDuration: number
    secondaryText: string
    secondaryAnimation: TextAnimationType
    secondaryStart: number
    secondaryDuration: number
    fontWeight: string
    letterSpacing: string
  }
  canvas: {
    width: number
    height: number
    aspectRatio: AspectRatio
  }
  sequence: SequenceEvent[]
}

export interface Keyframe {
  frame: number
  value: number | number[]
  easing: string
}

export interface BackgroundLayer {
  type: string
  keyframes: {
    opacity: Keyframe[]
    colorShift: Keyframe[]
    scale: Keyframe[]
  }
}

export interface ParticleLayer {
  type: string
  keyframes: {
    opacity: Keyframe[]
    count: Keyframe[]
    speed: Keyframe[]
    size: Keyframe[]
  }
}

export interface LogoLayer {
  type: string
  keyframes: {
    scale: Keyframe[]
    opacity: Keyframe[]
    position: Keyframe[]
    rotation: Keyframe[]
  }
}

export interface TextLayer {
  text: string
  keyframes: {
    opacity: Keyframe[]
    position: Keyframe[]
    scale: Keyframe[]
  }
}

export interface KeyframeData {
  fps: number
  totalFrames: number
  layers: {
    background: BackgroundLayer
    particles: ParticleLayer
    logo: LogoLayer
    textPrimary: TextLayer
    textSecondary: TextLayer
  }
}
