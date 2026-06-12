import type { AnimationConfig, TextLayer } from "@/lib/types/animation"
import { getValueAtTime } from "@/lib/animation/easing"

export function drawText(
  ctx: CanvasRenderingContext2D,
  config: AnimationConfig,
  layer: TextLayer,
  currentTime: number,
  isPrimary: boolean,
): void {
  const text = layer.text
  if (!text) return

  const fps = config.timing.fps
  const opacity = getValueAtTime(layer.keyframes.opacity, currentTime, fps)
  if (opacity <= 0) return

  const posY = getValueAtTime(layer.keyframes.position, currentTime, fps) ?? 0
  const scale = getValueAtTime(layer.keyframes.scale, currentTime, fps) ?? 1

  const fontSize = isPrimary ? 48 : 24
  const color = isPrimary ? config.colors.textPrimary : config.colors.textSecondary
  const startTime = isPrimary ? config.text.primaryStart : config.text.secondaryStart
  const duration = isPrimary ? config.text.primaryDuration : config.text.secondaryDuration
  const animation = isPrimary ? config.text.primaryAnimation : config.text.secondaryAnimation

  const cx = config.canvas.width / 2
  const baseY = isPrimary
    ? config.canvas.height * 0.52
    : config.canvas.height * 0.52 + fontSize * 1.6

  ctx.save()
  ctx.translate(cx, baseY + posY)
  ctx.scale(scale, scale)
  ctx.globalAlpha = opacity
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  ctx.font = `${isPrimary ? "bold" : config.text.fontWeight || "normal"} ${fontSize}px Inter, system-ui, sans-serif`
  ctx.letterSpacing = config.text.letterSpacing || "normal"
  ctx.fillStyle = color

  switch (animation) {
    case "typewriter": {
      const elapsed = Math.max(0, currentTime - startTime)
      const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 1
      const charCount = Math.floor(progress * text.length)
      const visibleText = text.slice(0, charCount)
      ctx.fillText(visibleText, 0, 0)
      break
    }

    case "split_reveal": {
      const elapsed = Math.max(0, currentTime - startTime)
      const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 1
      const chars = text.split("")
      const charWidth = fontSize * 0.6
      const totalWidth = chars.length * charWidth
      const startX = -totalWidth / 2

      for (let i = 0; i < chars.length; i++) {
        const charProgress = Math.min(Math.max((progress * chars.length - i) / 1, 0), 1)
        ctx.save()
        ctx.globalAlpha = opacity * charProgress
        ctx.translate(startX + i * charWidth + charWidth / 2, 0)
        ctx.scale(charProgress, 1)
        ctx.fillText(chars[i], 0, 0)
        ctx.restore()
      }
      break
    }

    case "letter_drop": {
      const elapsed = Math.max(0, currentTime - startTime)
      const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 1
      const chars = text.split("")
      const charWidth = fontSize * 0.6
      const totalWidth = chars.length * charWidth
      const startX = -totalWidth / 2

      for (let i = 0; i < chars.length; i++) {
        const charProgress = Math.min(Math.max((progress * chars.length - i) / 1, 0), 1)
        const dropOffset = (1 - charProgress) * -40
        ctx.save()
        ctx.globalAlpha = opacity * charProgress
        ctx.translate(startX + i * charWidth + charWidth / 2, dropOffset)
        ctx.fillText(chars[i], 0, 0)
        ctx.restore()
      }
      break
    }

    case "fade_up_stagger":
    default: {
      const words = text.split(/\s+/)
      const wordWidth = fontSize * 0.6
      const gap = wordWidth * 0.4
      const totalWidth = words.reduce((sum, w) => sum + w.length * wordWidth + gap, 0) - gap
      const startX = -totalWidth / 2
      let xOffset = 0

      for (let i = 0; i < words.length; i++) {
        const elapsed = Math.max(0, currentTime - startTime - i * 0.1)
        const wordProgress = duration > 0 ? Math.min(elapsed / (duration / words.length), 1) : 1
        const wordOpacity = wordProgress
        const wordOffsetY = (1 - wordProgress) * 20

        ctx.save()
        ctx.globalAlpha = opacity * wordOpacity
        ctx.translate(startX + xOffset, wordOffsetY)
        ctx.fillText(words[i], 0, 0)
        ctx.restore()

        xOffset += words[i].length * wordWidth + gap
      }
      break
    }
  }

  ctx.restore()
}
