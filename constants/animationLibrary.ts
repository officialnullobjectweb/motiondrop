import type {
  BackgroundEffectType,
  ParticleType,
  LogoEntranceType,
  IdleAnimationType,
  TextAnimationType,
  EasingCharacter,
} from "@/lib/types/animation"

export const BACKGROUND_TYPES: BackgroundEffectType[] = [
  "gradient_breathe",
  "radial_pulse",
  "particle_field",
  "geometric_shapes",
  "grid_lines",
  "solid_clean",
]

export const PARTICLE_TYPES: ParticleType[] = [
  "rising_particles",
  "burst_particles",
  "orbit_particles",
  "spark_trail",
  "confetti",
  "none",
]

export const LOGO_ENTRANCES: LogoEntranceType[] = [
  "scale_from_zero",
  "scale_overshoot",
  "fade_up",
  "drop_in",
  "glitch_in",
]

export const IDLE_ANIMATIONS: IdleAnimationType[] = [
  "glow_pulse",
  "float",
  "none",
]

export const TEXT_ANIMATIONS: TextAnimationType[] = [
  "typewriter",
  "fade_up_stagger",
  "split_reveal",
  "letter_drop",
]

export const EASING_CURVES: Record<EasingCharacter, string> = {
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  sharp: "cubic-bezier(0.16, 1, 0.3, 1)",
  elastic: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
}
