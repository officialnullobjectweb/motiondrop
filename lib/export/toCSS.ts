import type { AnimationConfig, KeyframeData, Keyframe } from "@/lib/types/animation"

function kfToCSS(keyframes: Keyframe[], prop: string, valScale: (v: number) => string, fps: number): string {
  const lines: string[] = []
  for (const kf of keyframes) {
    const pct = (kf.frame / Math.max(keyframes[keyframes.length - 1]?.frame ?? 1, 1)) * 100
    const val = valScale(typeof kf.value === "number" ? kf.value : (kf.value as number[])[0])
    lines.push(`    ${pct.toFixed(1)}% { ${prop}: ${val}; }`)
  }
  return lines.join("\n")
}

export function exportToCSS(config: AnimationConfig, keyframes: KeyframeData): string {
  const fps = keyframes.fps
  const totalFrames = keyframes.totalFrames
  const totalDuration = config.timing.totalDuration

  const sections: string[] = []

  sections.push(`/*
 * MotionDrop Animation Export
 * Brand: ${config.brand.name}
 * Duration: ${totalDuration}s
 * Frames: ${totalFrames}
 * Size: ${config.canvas.width}x${config.canvas.height}
 *
 * Usage:
 * 1. Include this CSS in your HTML
 * 2. Add the container: <div class="md-animation">
 * 3. Inner elements get animated automatically
 *
 * HTML structure:
 * <div class="md-animation">
 *   <div class="md-background"></div>
 *   <div class="md-particles"></div>
 *   <div class="md-logo"></div>
 *   <div class="md-text-primary">${config.text.primaryText}</div>
 *   <div class="md-text-secondary">${config.text.secondaryText}</div>
 * </div>
 */`)

  sections.push(`:root {
  --md-bg: ${config.colors.background};
  --md-primary: ${config.colors.primary};
  --md-secondary: ${config.colors.secondary};
  --md-accent: ${config.colors.accent};
  --md-glow: ${config.colors.glow};
  --md-text-primary: ${config.colors.textPrimary};
  --md-text-secondary: ${config.colors.textSecondary};
}`)

  sections.push(`.md-animation {
  position: relative;
  width: ${config.canvas.width}px;
  height: ${config.canvas.height}px;
  overflow: hidden;
  background: var(--md-bg);
  font-family: Arial, sans-serif;
}`)

  sections.push(`.md-animation > * {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}`)

  const bgOpacity = keyframes.layers.background.keyframes.opacity
  sections.push(`@keyframes md-bg-opacity {
${kfToCSS(bgOpacity, "opacity", (v) => String(v), fps)}
}`)
  sections.push(`.md-background {
  animation: md-bg-opacity ${totalDuration}s ease infinite;
}`)

  const ptOpacity = keyframes.layers.particles.keyframes.opacity
  sections.push(`@keyframes md-particles-opacity {
${kfToCSS(ptOpacity, "opacity", (v) => String(v), fps)}
}`)
  sections.push(`.md-particles {
  animation: md-particles-opacity ${totalDuration}s ease infinite;
}`)

  const logoOpacity = keyframes.layers.logo.keyframes.opacity
  const logoScale = keyframes.layers.logo.keyframes.scale
  const logoPosition = keyframes.layers.logo.keyframes.position

  sections.push(`@keyframes md-logo-opacity {
${kfToCSS(logoOpacity, "opacity", (v) => String(v), fps)}
}`)
  sections.push(`@keyframes md-logo-scale {
${kfToCSS(logoScale, "transform", (v) => `scale(${v})`, fps)}
}`)
  sections.push(`@keyframes md-logo-position {
${kfToCSS(logoPosition, "transform", (v) => `translateY(${v}px)`, fps)}
}`)
  sections.push(`.md-logo {
  animation:
    md-logo-opacity ${totalDuration}s ease infinite,
    md-logo-scale ${totalDuration}s ease infinite,
    md-logo-position ${totalDuration}s ease infinite;
}`)

  const t1Opacity = keyframes.layers.textPrimary.keyframes.opacity
  const t1Position = keyframes.layers.textPrimary.keyframes.position
  const t1Scale = keyframes.layers.textPrimary.keyframes.scale

  sections.push(`@keyframes md-text-primary-opacity {
${kfToCSS(t1Opacity, "opacity", (v) => String(v), fps)}
}`)
  sections.push(`@keyframes md-text-primary-position {
${kfToCSS(t1Position, "transform", (v) => `translateY(${v}px)`, fps)}
}`)
  sections.push(`@keyframes md-text-primary-scale {
${kfToCSS(t1Scale, "transform", (v) => `scale(${v})`, fps)}
}`)
  sections.push(`.md-text-primary {
  color: var(--md-text-primary);
  font-weight: ${config.text.fontWeight};
  letter-spacing: ${config.text.letterSpacing};
  font-size: 48px;
  animation:
    md-text-primary-opacity ${totalDuration}s ease infinite,
    md-text-primary-position ${totalDuration}s ease infinite,
    md-text-primary-scale ${totalDuration}s ease infinite;
}`)

  const t2Opacity = keyframes.layers.textSecondary.keyframes.opacity
  const t2Position = keyframes.layers.textSecondary.keyframes.position
  const t2Scale = keyframes.layers.textSecondary.keyframes.scale

  sections.push(`@keyframes md-text-secondary-opacity {
${kfToCSS(t2Opacity, "opacity", (v) => String(v), fps)}
}`)
  sections.push(`@keyframes md-text-secondary-position {
${kfToCSS(t2Position, "transform", (v) => `translateY(${v}px)`, fps)}
}`)
  sections.push(`@keyframes md-text-secondary-scale {
${kfToCSS(t2Scale, "transform", (v) => `scale(${v})`, fps)}
}`)
  sections.push(`.md-text-secondary {
  color: var(--md-text-secondary);
  font-weight: normal;
  font-size: 24px;
  animation:
    md-text-secondary-opacity ${totalDuration}s ease infinite,
    md-text-secondary-position ${totalDuration}s ease infinite,
    md-text-secondary-scale ${totalDuration}s ease infinite;
}`)

  return sections.join("\n\n") + "\n"
}
