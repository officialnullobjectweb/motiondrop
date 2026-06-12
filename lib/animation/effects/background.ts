import type { AnimationConfig } from "@/lib/types/animation"
import type { BackgroundLayer } from "@/lib/types/animation"
import { getValueAtTime } from "@/lib/animation/easing"

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function lerpColor(c1: string, c2: string, t: number): string {
  const a = hexToRgb(c1)
  const b = hexToRgb(c2)
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  config: AnimationConfig,
  keyframes: BackgroundLayer,
  currentTime: number,
  canvasWidth: number,
  canvasHeight: number,
): void {
  const fps = config.timing.fps
  const opacity = getValueAtTime(keyframes.keyframes.opacity, currentTime, fps)

  if (opacity <= 0) return

  ctx.save()
  ctx.globalAlpha = opacity

  const bgColor = config.colors.background
  const primaryColor = config.colors.primary

  switch (config.background.type) {
    case "solid_clean": {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      break
    }

    case "gradient_breathe": {
      const shift = getValueAtTime(keyframes.keyframes.colorShift, currentTime, fps)
      const c1 = bgColor
      const c2 = lerpColor(config.colors.primary, config.colors.secondary, shift)
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
      gradient.addColorStop(0, c1)
      gradient.addColorStop(0.5, c2)
      gradient.addColorStop(1, c1)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      break
    }

    case "radial_pulse": {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      const scale = getValueAtTime(keyframes.keyframes.scale, currentTime, fps)
      const cx = canvasWidth / 2
      const cy = canvasHeight / 2
      const maxRadius = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) * 0.7 * scale
      const ringCount = 3

      for (let i = 0; i < ringCount; i++) {
        const phase = (currentTime * config.background.speed + i * 0.5) % 1.5 / 1.5
        const radius = maxRadius * (0.3 + phase * 0.7)
        const alpha = 0.08 * (1 - phase) * config.background.intensity
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(primaryColor, alpha)
        ctx.fill()
      }

      const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.5)
      innerGlow.addColorStop(0, hexToRgba(primaryColor, 0.05 * config.background.intensity))
      innerGlow.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = innerGlow
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      break
    }

    case "particle_field": {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      break
    }

    case "geometric_shapes": {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      const shapes = [
        { x: canvasWidth * 0.15, y: canvasHeight * 0.2, w: 80, h: 80, rot: 0.2 },
        { x: canvasWidth * 0.75, y: canvasHeight * 0.3, w: 60, h: 120, rot: -0.3 },
        { x: canvasWidth * 0.5, y: canvasHeight * 0.7, w: 100, h: 100, rot: 0.5 },
        { x: canvasWidth * 0.2, y: canvasHeight * 0.8, w: 50, h: 50, rot: -0.1 },
        { x: canvasWidth * 0.8, y: canvasHeight * 0.85, w: 70, h: 70, rot: 0.4 },
      ]

      for (const shape of shapes) {
        const drift = Math.sin(currentTime * 0.3 + shape.x * 0.01) * 20
        ctx.save()
        ctx.translate(shape.x + drift, shape.y)
        ctx.rotate(shape.rot + currentTime * 0.1)
        ctx.fillStyle = hexToRgba(primaryColor, 0.12)
        ctx.fillRect(-shape.w / 2, -shape.h / 2, shape.w, shape.h)
        ctx.strokeStyle = hexToRgba(primaryColor, 0.2)
        ctx.lineWidth = 1.5
        ctx.strokeRect(-shape.w / 2, -shape.h / 2, shape.w, shape.h)
        ctx.restore()
      }
      break
    }

    case "grid_lines": {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      const gridAlpha = 0.06 * config.background.intensity
      ctx.strokeStyle = hexToRgba(primaryColor, gridAlpha)
      ctx.lineWidth = 1

      const spacing = 60
      for (let x = 0; x <= canvasWidth; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }
      for (let y = 0; y <= canvasHeight; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }

      const fadeDir = Math.sin(currentTime * 0.2) * 0.5 + 0.5
      ctx.fillStyle = hexToRgba(primaryColor, 0.03 * fadeDir)
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      break
    }

    default: {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    }
  }

  ctx.restore()
}
