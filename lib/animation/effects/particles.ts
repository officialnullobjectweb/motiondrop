import type { AnimationConfig, ParticleLayer } from "@/lib/types/animation"
import { getValueAtTime } from "@/lib/animation/easing"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  seed: number
}

let particles: Particle[] = []
let lastConfigKey = ""

function hashConfig(c: AnimationConfig): string {
  return `${c.particles.type}:${c.particles.count}:${c.particles.speed}:${c.canvas.width}x${c.canvas.height}`
}

function initParticles(config: AnimationConfig): void {
  const key = hashConfig(config)
  if (key === lastConfigKey && particles.length > 0) return
  lastConfigKey = key

  const count = config.particles.count
  const w = config.canvas.width
  const h = config.canvas.height

  particles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -Math.random() * 1.5 - 0.5,
    size: config.particles.sizeRange[0] + Math.random() * (config.particles.sizeRange[1] - config.particles.sizeRange[0]),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    life: Math.random(),
    maxLife: 1 + Math.random() * 2,
    seed: i * 1000 + Math.random() * 1000,
  }))
}

function updateParticle(p: Particle, dt: number, type: string, w: number, h: number, speed: number): void {
  const s = speed

  switch (type) {
    case "rising_particles":
      p.y -= s * 120 * dt
      p.x += Math.sin(p.seed + p.y * 0.01) * s * 20 * dt
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
      break

    case "burst_particles": {
      const cx = w / 2
      const cy = h / 2
      const dx = p.x - cx
      const dy = p.y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const speedMul = s * 80 * dt
      p.x += (dx / dist) * speedMul
      p.y += (dy / dist) * speedMul
      if (dist > Math.max(w, h) * 0.8) { p.x = cx + (Math.random() - 0.5) * 100; p.y = cy + (Math.random() - 0.5) * 100 }
      break
    }

    case "orbit_particles": {
      const cx = w / 2
      const cy = h / 2
      const angle = Math.atan2(p.y - cy, p.x - cx) + s * 1.5 * dt
      const radius = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2)
      p.x = cx + Math.cos(angle + p.seed * 0.001) * radius
      p.y = cy + Math.sin(angle + p.seed * 0.001) * radius
      p.x += Math.cos(angle) * s * 10 * dt
      p.y += Math.sin(angle) * s * 10 * dt
      const r2 = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2)
      if (r2 > Math.max(w, h) * 0.6) { p.x = cx; p.y = cy }
      break
    }

    case "spark_trail": {
      p.x += p.vx * s * 200 * dt
      p.y += p.vy * s * 200 * dt
      p.vy += 50 * dt
      p.life += dt * 0.3
      if (p.life > 1 || p.y > h + 10) {
        p.x = Math.random() * w
        p.y = h * 0.3 + Math.random() * h * 0.4
        p.vx = (Math.random() - 0.5) * 0.8
        p.vy = -Math.random() * 1.2 - 0.3
        p.life = 0
      }
      break
    }

    case "confetti": {
      p.y += s * 100 * dt
      p.x += Math.sin(p.y * 0.05 + p.seed) * s * 30 * dt
      p.rotation += p.rotationSpeed * s * 2
      if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w }
      break
    }
  }
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  config: AnimationConfig,
  layer: ParticleLayer,
  currentTime: number,
): void {
  if (!config.particles.enabled || config.particles.type === "none") return

  const fps = config.timing.fps
  const opacity = getValueAtTime(layer.keyframes.opacity, currentTime, fps)

  if (opacity <= 0) return

  const size = getValueAtTime(layer.keyframes.size, currentTime, fps)
  const speed = getValueAtTime(layer.keyframes.speed, currentTime, fps)

  initParticles(config)

  const dt = 1 / fps
  const w = config.canvas.width
  const h = config.canvas.height
  const particleColor = config.particles.color

  ctx.save()
  ctx.globalAlpha = opacity

  for (const p of particles) {
    updateParticle(p, dt, config.particles.type, w, h, speed)

    const displaySize = size * (p.size / 3)

    if (config.particles.type === "spark_trail") {
      const trailAlpha = 1 - p.life
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x - p.vx * 15, p.y - p.vy * 15)
      ctx.strokeStyle = particleColor
      ctx.lineWidth = displaySize * trailAlpha * 0.8
      ctx.globalAlpha = opacity * trailAlpha
      ctx.stroke()
      ctx.globalAlpha = opacity
    } else if (config.particles.type === "confetti") {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = particleColor
      ctx.fillRect(-displaySize, -displaySize * 0.5, displaySize * 2, displaySize)
      ctx.restore()
    } else {
      ctx.beginPath()
      ctx.arc(p.x, p.y, displaySize * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = particleColor
      ctx.fill()
    }
  }

  ctx.restore()
}
