export const EASING_CURVES = {
  smooth: {
    name: "Smooth",
    css: "cubic-bezier(0.4, 0, 0.2, 1)",
    description: "Calm and professional — use for premium brands",
  },
  bouncy: {
    name: "Bouncy",
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    description: "Playful and energetic — use for fun brands",
  },
  sharp: {
    name: "Sharp",
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    description: "Premium and decisive — use for luxury brands",
  },
  elastic: {
    name: "Elastic",
    css: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    description: "Playful and fun — use for gaming brands",
  },
} as const

export type EasingCurveName = keyof typeof EASING_CURVES
