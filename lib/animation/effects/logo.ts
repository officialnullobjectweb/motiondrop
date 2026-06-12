import type { AnimationConfig, LogoLayer } from "@/lib/types/animation"
import { getValueAtTime } from "@/lib/animation/easing"

export function drawLogo(
  ctx: CanvasRenderingContext2D,
  config: AnimationConfig,
  layer: LogoLayer,
  currentTime: number,
  imageElement: HTMLImageElement | null,
): void {
  if (!config.logo.provided && !config.brand.name) return

  const fps = config.timing.fps
  const opacity = getValueAtTime(layer.keyframes.opacity, currentTime, fps)
  if (opacity <= 0) return

  const scale = getValueAtTime(layer.keyframes.scale, currentTime, fps)
  const posY = getValueAtTime(layer.keyframes.position, currentTime, fps) ?? 0
  const rotation = getValueAtTime(layer.keyframes.rotation, currentTime, fps) ?? 0

  const cx = config.canvas.width / 2
  const cy = config.canvas.height * 0.35
  const logoSize = Math.min(config.canvas.width, config.canvas.height) * 0.18

  ctx.save()
  ctx.translate(cx, cy + posY)
  ctx.scale(scale, scale)
  ctx.rotate(rotation * 0.02)
  ctx.globalAlpha = opacity

  const glowColor = config.colors.glow || config.colors.primary
  ctx.shadowColor = glowColor
  ctx.shadowBlur = 20 + config.logo.idleIntensity * 15

  if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
    const imgSize = logoSize * 2
    ctx.drawImage(imageElement, -imgSize / 2, -imgSize / 2, imgSize, imgSize)
  } else {
    const size = logoSize * 1.2
    const radius = size * 0.22
    ctx.beginPath()
    ctx.roundRect(-size / 2, -size / 2, size, size, radius)
    ctx.fillStyle = config.colors.primary
    ctx.fill()

    ctx.shadowBlur = 0
    const initials = config.brand.name
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join("")

    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const fontSize = size * 0.4
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.fillText(initials || "?", 0, 0)
  }

  ctx.restore()
}
