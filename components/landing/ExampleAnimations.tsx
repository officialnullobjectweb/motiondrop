"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Play, RotateCcw } from "lucide-react"

// ── Splash Screen Definitions ──
const SPLASHES = [
  {
    id: "fitpro",
    name: "FitPro",
    tagline: "Transform Your Body",
    industry: "Fitness",
    gradient: "from-[#0A1628] via-[#1A1A3E] to-[#0A1628]",
    accent: "#3B82F6",
    primary: "#60A5FA",
    secondary: "#93C5FD",
    colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB", "#1D4ED8"],
    energy: "High Energy",
    type: "fitness" as const,
  },
  {
    id: "payflow",
    name: "PayFlow",
    tagline: "Smart Finance",
    industry: "Fintech",
    gradient: "from-[#0F0A1A] via-[#1A0F2E] to-[#0F0A1A]",
    accent: "#8B5CF6",
    primary: "#A78BFA",
    secondary: "#C4B5FD",
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED", "#6D28D9"],
    energy: "Professional",
    type: "fintech" as const,
  },
  {
    id: "serenity",
    name: "Serenity",
    tagline: "Find Your Calm",
    industry: "Wellness",
    gradient: "from-[#0A1A14] via-[#0F2A1E] to-[#0A1A14]",
    accent: "#34D399",
    primary: "#6EE7B7",
    secondary: "#A7F3D0",
    colors: ["#34D399", "#6EE7B7", "#A7F3D0", "#10B981", "#059669"],
    energy: "Calm",
    type: "wellness" as const,
  },
]

type SplashType = "fitness" | "fintech" | "wellness"

/* ── FitPro: Tech/fitness splash with logo reveal, rotating rings, pulsing progress ── */
function renderFitSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const duration = 3 // seconds
  const progress = Math.min(t / duration, 1)
  const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0A1628")
  bg.addColorStop(0.5, "#1A1A3E")
  bg.addColorStop(1, "#0A1628")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Background particles
  for (let i = 0; i < 12; i++) {
    const px = (i * 37 + 13 * t) % w
    const py = (i * 53 + t * 20) % h
    const size = 1.5 + Math.sin(t * 3 + i) * 0.8
    const alpha = 0.15 + Math.sin(t * 2 + i * 1.3) * 0.1
    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`
    ctx.fill()
  }

  // Rotating rings
  const cx = w / 2
  const cy = h * 0.3
  const ringScale = Math.min(1, eased * 1.5)
  for (let i = 0; i < 3; i++) {
    const r = (40 + i * 25) * ringScale
    const rot = t * 0.5 + i * 1.2
    ctx.beginPath()
    ctx.arc(cx + Math.cos(rot) * 8, cy + Math.sin(rot) * 8, r, rot, rot + Math.PI * 1.5)
    ctx.strokeStyle = SPLASHES[0].colors[i + 1] + "40"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Logo box with reveal
  const logoReveal = Math.min(1, Math.max(0, (t - 0.2) * 3))
  const logoSize = 24 * logoReveal
  if (logoReveal > 0) {
    ctx.fillStyle = "#3B82F6"
    const lx = cx - logoSize / 2
    const ly = cy - logoSize / 2
    ctx.beginPath()
    ctx.roundRect(lx, ly, logoSize, logoSize, 6)
    ctx.fill()

    // Checkmark inside
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(lx + 6, ly + 13)
    ctx.lineTo(lx + 10, ly + 17)
    ctx.lineTo(lx + 18, ly + 7)
    ctx.stroke()
  }

  // Progress bar animation
  if (t > 0.8) {
    const barW = 120
    const barH = 3
    const barX = cx - barW / 2
    const barY = h * 0.32 + 40
    const fillProgress = Math.min(1, (t - 0.8) * 1.5)

    ctx.fillStyle = "#222222"
    ctx.beginPath()
    ctx.roundRect(barX, barY, barW, barH, 2)
    ctx.fill()

    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
    grad.addColorStop(0, "#3B82F6")
    grad.addColorStop(1, "#60A5FA")
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(barX, barY, barW * fillProgress, barH, 2)
    ctx.fill()
  }

  // Title with slide-up
  const textP = Math.min(1, Math.max(0, (t - 1.0) * 2.5))
  const textY = h * 0.48 + (1 - textP) * 20
  ctx.globalAlpha = textP
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 18px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("FITPRO", cx, textY)

  // Subtitle
  ctx.fillStyle = "#93C5FDCC"
  ctx.font = "10px Inter, sans-serif"
  ctx.fillText("Transform Your Body", cx, textY + 24)

  ctx.globalAlpha = 1
}

/* ── PayFlow: Fintech splash with flowing data lines, nodes, numbers ── */
function renderFintechSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const duration = 3
  const progress = Math.min(t / duration, 1)
  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0F0A1A")
  bg.addColorStop(0.5, "#1A0F2E")
  bg.addColorStop(1, "#0F0A1A")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Grid lines
  ctx.strokeStyle = "#8B5CF610"
  ctx.lineWidth = 0.5
  for (let i = 0; i < 8; i++) {
    const x = (i / 8) * w
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * h
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  const cx = w / 2
  const cy = h * 0.32

  // Data nodes
  const nodeCount = 6
  const nodes: [number, number][] = []
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + t * 0.1
    const radius = 60 + Math.sin(t * 0.5 + i) * 5
    nodes.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius])
  }

  // Connecting lines
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const alpha = 0.1 + Math.sin(t * 0.8 + i + j) * 0.05
      ctx.beginPath()
      ctx.moveTo(nodes[i][0], nodes[i][1])
      ctx.lineTo(nodes[j][0], nodes[j][1])
      ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
  }

  // Node dots
  for (const [nx, ny] of nodes) {
    ctx.beginPath()
    ctx.arc(nx, ny, 3 + Math.sin(t * 2 + nx) * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = "#8B5CF6AA"
    ctx.fill()
    ctx.beginPath()
    ctx.arc(nx, ny, 6, 0, Math.PI * 2)
    ctx.fillStyle = "#8B5CF620"
    ctx.fill()
  }

  // Center logo
  const logoP = Math.min(1, Math.max(0, (t - 0.5) * 3))
  if (logoP > 0) {
    ctx.fillStyle = "#8B5CF6"
    const ls = 22 * logoP
    ctx.beginPath()
    ctx.roundRect(cx - ls / 2, cy - ls / 2, ls, ls, 5)
    ctx.fill()

    // Dollar sign
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${14 * logoP}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("$", cx, cy + 1)
  }

  // Numbers flow
  const numP = Math.min(1, Math.max(0, (t - 1.3) * 2))
  if (numP > 0) {
    ctx.globalAlpha = numP
    ctx.fillStyle = "#A78BFACC"
    ctx.font = "bold 20px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("PayFlow", cx, h * 0.5)

    ctx.fillStyle = "#C4B5FD99"
    ctx.font = "10px Inter, sans-serif"
    ctx.fillText("Smart Finance", cx, h * 0.5 + 22)
    ctx.globalAlpha = 1
  }

  // Glowing center pulse
  const pulse = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
  pulse.addColorStop(0, "#8B5CF615")
  pulse.addColorStop(1, "#8B5CF600")
  ctx.fillStyle = pulse
  ctx.beginPath()
  ctx.arc(cx, cy, 50 + Math.sin(t * 2) * 10, 0, Math.PI * 2)
  ctx.fill()
}

/* ── Serenity: Wellness splash with floating particles, morphing circles, gentle glow ── */
function renderWellnessSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const duration = 3
  const progress = Math.min(t / duration, 1)
  const eased = 1 - Math.pow(1 - progress, 3)

  // Background
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
  bg.addColorStop(0, "#0F2A1E")
  bg.addColorStop(0.5, "#0A1A14")
  bg.addColorStop(1, "#050D0A")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Floating circles / bubbles
  for (let i = 0; i < 8; i++) {
    const px = (w * (0.15 + (i * 0.1) + Math.sin(t * 0.3 + i * 2.1) * 0.08)) % w
    const py = (h * (0.2 + (i * 0.08) + Math.sin(t * 0.4 + i * 1.7) * 0.08)) % h
    const size = 8 + Math.sin(t * 1.5 + i * 0.7) * 4 + 4
    const alpha = 0.08 + Math.sin(t * 0.5 + i) * 0.04

    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`
    ctx.fill()

    ctx.beginPath()
    ctx.arc(px, py, size * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(110, 231, 183, ${alpha * 0.5})`
    ctx.fill()
  }

  // Central morphing shape
  const cx = w / 2
  const cy = h * 0.3
  const morphR = 28 + Math.sin(t * 1.5) * 6
  const morphR2 = 18 + Math.sin(t * 1.8 + 1) * 4

  // Outer ring glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, morphR + 20)
  glow.addColorStop(0, "#34D39920")
  glow.addColorStop(1, "#34D39900")
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, morphR + 20, 0, Math.PI * 2)
  ctx.fill()

  // Leaf-like shape
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + t * 0.2
    const r = i % 2 === 0 ? morphR : morphR * 0.7
    const px = cx + Math.cos(angle) * r
    const py = cy + Math.sin(angle) * r
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fillStyle = "#34D39925"
  ctx.fill()
  ctx.strokeStyle = "#34D39940"
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Inner dot
  ctx.beginPath()
  ctx.arc(cx, cy, 5 + Math.sin(t * 2) * 2, 0, Math.PI * 2)
  ctx.fillStyle = "#6EE7B7"
  ctx.fill()

  // Title
  const textP = Math.min(1, Math.max(0, (t - 1.0) * 2.5))
  const textY = h * 0.48 + (1 - textP) * 15
  ctx.globalAlpha = textP
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 18px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("SERENITY", cx, textY)

  ctx.fillStyle = "#A7F3D0CC"
  ctx.font = "10px Inter, sans-serif"
  ctx.fillText("Find Your Calm", cx, textY + 22)
  ctx.globalAlpha = 1
}

// ── Renderer map ──
const RENDERERS: Record<SplashType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  fitness: renderFitSplash,
  fintech: renderFintechSplash,
  wellness: renderWellnessSplash,
}

// ── Canvas Splash Component ──
function SplashCanvas({ splash }: { splash: (typeof SPLASHES)[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    mountedRef.current = true
    const w = canvas.width
    const h = canvas.height
    const loopDuration = 3 // seconds

    const animate = (timestamp: number) => {
      if (!mountedRef.current) return
      const dt = 1 / 30
      timeRef.current += dt
      if (timeRef.current > loopDuration) timeRef.current = 0

      const render = RENDERERS[splash.type]
      if (render) render(ctx, w, h, timeRef.current)

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(animRef.current)
    }
  }, [splash])

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={462}
      className="w-full h-full object-cover"
    />
  )
}

// ── Device Frame ──
function DeviceFrame({ splash, index }: { splash: (typeof SPLASHES)[0]; index: number }) {
  return (
    <div
      className="group relative"
      style={{
        animation: `device-enter 0.8s ease-out ${0.2 + index * 0.2}s both`,
      }}
    >
      <div className="relative mx-auto w-[240px] sm:w-[270px]">
        <div className="relative aspect-[9/16] rounded-[32px] border-2 border-[#222222] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-black/50 transition-all duration-500 group-hover:shadow-[#6366F1]/10 group-hover:border-[#333333] group-hover:-translate-y-1">
          <div className={`absolute inset-0 bg-gradient-to-b ${splash.gradient} transition-opacity duration-500`} />

          {/* Canvas animation */}
          <div className="absolute inset-0">
            <SplashCanvas splash={splash} />
          </div>

          {/* Top notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-2xl flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#222222]" />
          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[50px] h-[4px] rounded-full bg-white/10" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-12">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        </div>

        <div className="mt-4 text-center transition-all duration-300">
          <p className="text-white text-sm font-semibold tracking-tight">{splash.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[#666666] text-xs">{splash.energy}</span>
            <span className="text-[#333333] text-xs">·</span>
            <span className="text-[#666666] text-xs">{splash.industry}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Section ──
export default function ExampleAnimations() {
  return (
    <section id="examples" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366F1]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-medium text-[#6366F1] bg-[#6366F1]/10 rounded-full px-3 py-1 mb-4">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Made With MotionDrop
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold">
            Splash Screens in Action
          </h2>
          <p className="text-[#888888] text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Three prompts, three completely different splash screen styles — generated in seconds
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <RotateCcw className="w-3 h-3 text-[#555555]" />
            <span className="text-[11px] text-[#555555]">Animations loop every 3 seconds</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {SPLASHES.map((splash, i) => (
            <DeviceFrame key={splash.id} splash={splash} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
