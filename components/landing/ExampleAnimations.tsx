"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Sparkles, RotateCcw } from "lucide-react"

// ── Brand Definitions ──
const BRANDS = [
  {
    id: "fitpro",
    name: "FitPro",
    tagline: "Transform Your Body",
    industry: "Fitness",
    energy: "High Energy",
    accent: "#3B82F6",
    primary: "#60A5FA",
    secondary: "#93C5FD",
    colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB", "#1D4ED8"],
    homeGradient: "from-[#0A1628] via-[#1A1A3E] to-[#0A1628]",
    splashGradient: ["#0A1628", "#1A1A3E", "#0F1F4A"],
    type: "fitness" as const,
  },
  {
    id: "payflow",
    name: "PayFlow",
    tagline: "Smart Finance",
    industry: "Fintech",
    energy: "Professional",
    accent: "#8B5CF6",
    primary: "#A78BFA",
    secondary: "#C4B5FD",
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED", "#6D28D9"],
    homeGradient: "from-[#0F0A1A] via-[#1A0F2E] to-[#0F0A1A]",
    splashGradient: ["#0F0A1A", "#1A0F2E", "#2D1B69"],
    type: "fintech" as const,
  },
  {
    id: "serenity",
    name: "Serenity",
    tagline: "Find Your Calm",
    industry: "Wellness",
    energy: "Calm",
    accent: "#34D399",
    primary: "#6EE7B7",
    secondary: "#A7F3D0",
    colors: ["#34D399", "#6EE7B7", "#A7F3D0", "#10B981", "#059669"],
    homeGradient: "from-[#0A1A14] via-[#0F2A1E] to-[#0A1A14]",
    splashGradient: ["#0A1A14", "#0F2A1E", "#0D3325"],
    type: "wellness" as const,
  },
]

type BrandType = "fitness" | "fintech" | "wellness"

/* ── Loading Skeleton ── */
function SplashSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl animate-skeleton" />
        <div className="w-20 h-2.5 rounded-full animate-skeleton" />
        <div className="w-14 h-2 rounded-full animate-skeleton" />
      </div>
    </div>
  )
}

/* ── Renderer: FitPro (Fitness) ── */
function renderFitHome(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0A1628")
  bg.addColorStop(0.5, "#1A1A3E")
  bg.addColorStop(1, "#0A1628")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // App grid icons
  const gridColors = ["#3B82F640", "#8B5CF640", "#34D39940", "#F59E0B40", "#EF444440", "#EC489940"]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const ix = 30 + col * 70
      const iy = 60 + row * 90
      ctx.fillStyle = gridColors[(row * 3 + col) % 6]
      ctx.beginPath()
      ctx.roundRect(ix, iy, 50, 50, 12)
      ctx.fill()
    }
  }

  // Bottom dock
  ctx.fillStyle = "#ffffff10"
  ctx.beginPath()
  ctx.roundRect(30, h - 70, w - 60, 55, 16)
  ctx.fill()

  // FitPro app icon in center of screen (row 2, col 1-ish)
  const iconX = w / 2 - 28
  const iconY = h * 0.4 - 28
  ctx.fillStyle = "#3B82F6"
  ctx.beginPath()
  ctx.roundRect(iconX, iconY, 56, 56, 14)
  ctx.fill()

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 22px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("FP", w / 2, h * 0.4 + 1)

  // Time
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("9:41", w / 2, 30)
}

function renderFitSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const dur = 3
  const prog = Math.min(t / dur, 1)
  const eased = 1 - Math.pow(1 - prog, 3)

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0A1628")
  bg.addColorStop(0.5, "#1A1A3E")
  bg.addColorStop(1, "#0F1F4A")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Particles
  for (let i = 0; i < 15; i++) {
    const px = (i * 37 + t * 30) % w
    const py = (i * 53 + t * 25) % h
    const s = 1.5 + Math.sin(t * 2 + i) * 1
    ctx.beginPath()
    ctx.arc(px, py, s, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(96, 165, 250, ${0.1 + Math.sin(t + i) * 0.05})`
    ctx.fill()
  }

  const cx = w / 2
  const cy = h * 0.3
  const scale = Math.min(1, eased * 1.5)

  // Rotating rings
  for (let i = 0; i < 3; i++) {
    const r = (35 + i * 22) * scale
    const rot = t * 0.6 + i * 1.3
    ctx.beginPath()
    ctx.arc(cx + Math.cos(rot) * 6, cy + Math.sin(rot) * 6, r, rot, rot + Math.PI * 1.5)
    ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 + i * 0.05})`
    ctx.lineWidth = 2 - i * 0.5
    ctx.stroke()
  }

  // Logo reveal
  const reveal = Math.min(1, Math.max(0, (t - 0.3) * 3))
  if (reveal > 0) {
    const ls = 28 * Math.min(1, reveal * 1.2)
    ctx.fillStyle = "#3B82F6"
    ctx.beginPath()
    ctx.roundRect(cx - ls / 2, cy - ls / 2, ls, ls, 7)
    ctx.fill()

    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${ls * 0.6}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("FP", cx, cy + 1)

    // Progress line
    const barW = 100 * Math.min(1, (t - 0.6) * 3)
    const barY = cy + 35
    ctx.fillStyle = "#222222"
    ctx.beginPath()
    ctx.roundRect(cx - 50, barY, 100, 3, 2)
    ctx.fill()
    ctx.fillStyle = "#3B82F6"
    ctx.beginPath()
    ctx.roundRect(cx - 50, barY, barW, 3, 2)
    ctx.fill()
  }

  // Tagline
  const textP = Math.min(1, Math.max(0, (t - 1.1) * 2.5))
  ctx.globalAlpha = textP
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("FITPRO", cx, h * 0.48 + (1 - textP) * 15)
  ctx.fillStyle = "#93C5FDCC"
  ctx.font = "10px Inter, sans-serif"
  ctx.fillText("Transform Your Body", cx, h * 0.48 + 24)
  ctx.globalAlpha = 1
}

/* ── Renderer: PayFlow (Fintech) ── */
function renderPayHome(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0F0A1A")
  bg.addColorStop(0.5, "#1A0F2E")
  bg.addColorStop(1, "#0F0A1A")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const gridColors = ["#8B5CF640", "#3B82F640", "#34D39940", "#F59E0B40", "#EC489940", "#6366F140"]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const ix = 30 + col * 70
      const iy = 60 + row * 90
      ctx.fillStyle = gridColors[(row * 3 + col) % 6]
      ctx.beginPath()
      ctx.roundRect(ix, iy, 50, 50, 12)
      ctx.fill()
    }
  }

  ctx.fillStyle = "#ffffff10"
  ctx.beginPath()
  ctx.roundRect(30, h - 70, w - 60, 55, 16)
  ctx.fill()

  const iconX = w / 2 - 28
  const iconY = h * 0.4 - 28
  ctx.fillStyle = "#8B5CF6"
  ctx.beginPath()
  ctx.roundRect(iconX, iconY, 56, 56, 14)
  ctx.fill()

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 24px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("$", w / 2, h * 0.4 + 2)

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("9:41", w / 2, 30)
}

function renderPaySplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const dur = 3
  const prog = Math.min(t / dur, 1)

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, "#0F0A1A")
  bg.addColorStop(0.5, "#1A0F2E")
  bg.addColorStop(1, "#2D1B69")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h * 0.28

  // Grid
  ctx.strokeStyle = "#8B5CF608"
  ctx.lineWidth = 0.5
  for (let i = 0; i < 8; i++) {
    const x = (i / 8) * w
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
  }
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * h
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
  }

  // Data nodes
  const n = 6
  const nodes: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + t * 0.08
    const r = 50 + Math.sin(t * 0.4 + i) * 10
    nodes.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      ctx.beginPath()
      ctx.moveTo(nodes[i][0], nodes[i][1])
      ctx.lineTo(nodes[j][0], nodes[j][1])
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 + Math.sin(t + i + j) * 0.04})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }
  }

  for (const [nx, ny] of nodes) {
    ctx.beginPath()
    ctx.arc(nx, ny, 2.5 + Math.sin(t * 2 + nx) * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = "#8B5CF688"
    ctx.fill()
  }

  // Logo
  const reveal = Math.min(1, Math.max(0, (t - 0.4) * 3))
  if (reveal > 0) {
    const ls = 26 * reveal
    ctx.fillStyle = "#8B5CF6"
    ctx.beginPath()
    ctx.roundRect(cx - ls / 2, cy - ls / 2, ls, ls, 6)
    ctx.fill()
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${ls * 0.6}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("$", cx, cy + 1)
  }

  // Center pulse
  const pulse = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
  pulse.addColorStop(0, "#8B5CF610")
  pulse.addColorStop(1, "#8B5CF600")
  ctx.fillStyle = pulse
  ctx.beginPath()
  ctx.arc(cx, cy, 40 + Math.sin(t * 2) * 8, 0, Math.PI * 2)
  ctx.fill()

  // Tagline
  const textP = Math.min(1, Math.max(0, (t - 1.2) * 2.5))
  ctx.globalAlpha = textP
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("PayFlow", cx, h * 0.45 + (1 - textP) * 15)
  ctx.fillStyle = "#C4B5FDCC"
  ctx.font = "10px Inter, sans-serif"
  ctx.fillText("Smart Finance", cx, h * 0.45 + 24)
  ctx.globalAlpha = 1
}

/* ── Renderer: Serenity (Wellness) ── */
function renderSereneHome(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
  bg.addColorStop(0, "#0F2A1E")
  bg.addColorStop(0.5, "#0A1A14")
  bg.addColorStop(1, "#050D0A")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const gridColors = ["#34D39940", "#6366F140", "#8B5CF640", "#F59E0B40", "#3B82F640", "#EC489940"]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const ix = 30 + col * 70
      const iy = 60 + row * 90
      ctx.fillStyle = gridColors[(row * 3 + col) % 6]
      ctx.beginPath()
      ctx.roundRect(ix, iy, 50, 50, 12)
      ctx.fill()
    }
  }

  ctx.fillStyle = "#ffffff10"
  ctx.beginPath()
  ctx.roundRect(30, h - 70, w - 60, 55, 16)
  ctx.fill()

  const iconX = w / 2 - 28
  const iconY = h * 0.4 - 28
  ctx.fillStyle = "#34D399"
  ctx.beginPath()
  ctx.roundRect(iconX, iconY, 56, 56, 14)
  ctx.fill()

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 22px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("S", w / 2, h * 0.4 + 1)

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("9:41", w / 2, 30)
}

function renderSereneSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const dur = 3
  const prog = Math.min(t / dur, 1)
  const eased = 1 - Math.pow(1 - prog, 3)

  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
  bg.addColorStop(0, "#0F2A1E")
  bg.addColorStop(0.5, "#0A1A14")
  bg.addColorStop(1, "#0D3325")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Floating bubbles
  for (let i = 0; i < 10; i++) {
    const px = (w * (0.1 + (i * 0.09) + Math.sin(t * 0.3 + i * 2.1) * 0.06)) % w
    const py = (h * (0.15 + (i * 0.08) + Math.sin(t * 0.4 + i * 1.7) * 0.05)) % h
    const s = 6 + Math.sin(t * 1.5 + i * 0.7) * 3 + 3
    ctx.beginPath()
    ctx.arc(px, py, s, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(52, 211, 153, ${0.05 + Math.sin(t * 0.5 + i) * 0.03})`
    ctx.fill()
  }

  const cx = w / 2
  const cy = h * 0.3
  const morphR = 24 + Math.sin(t * 1.5) * 5

  // Glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, morphR + 16)
  glow.addColorStop(0, "#34D39918")
  glow.addColorStop(1, "#34D39900")
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, morphR + 16, 0, Math.PI * 2)
  ctx.fill()

  // Leaf shape
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + t * 0.15
    const r = i % 2 === 0 ? morphR : morphR * 0.65
    i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fillStyle = "#34D39918"
  ctx.fill()
  ctx.strokeStyle = "#34D39935"
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Inner dot
  ctx.beginPath()
  ctx.arc(cx, cy, 4 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = "#6EE7B7"
  ctx.fill()

  // Tagline
  const textP = Math.min(1, Math.max(0, (t - 1.0) * 2.5))
  ctx.globalAlpha = textP
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 16px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("SERENITY", cx, h * 0.48 + (1 - textP) * 15)
  ctx.fillStyle = "#A7F3D0CC"
  ctx.font = "10px Inter, sans-serif"
  ctx.fillText("Find Your Calm", cx, h * 0.48 + 24)
  ctx.globalAlpha = 1
}

// ── Renderer Maps ──
const HOME_RENDERERS: Record<BrandType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  fitness: renderFitHome,
  fintech: renderPayHome,
  wellness: renderSereneHome,
}

const SPLASH_RENDERERS: Record<BrandType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  fitness: renderFitSplash,
  fintech: renderPaySplash,
  wellness: renderSereneSplash,
}

// ── Canvas Splash Component ──
function BrandCanvas({ brand }: { brand: (typeof BRANDS)[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const animRef = useRef(0)
  const mountedRef = useRef(true)
  const [loaded, setLoaded] = useState(false)
  const [phase, setPhase] = useState<"home" | "splash">("home")

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    mountedRef.current = true
    const w = canvas.width
    const h = canvas.height
    const homeDuration = 2
    const splashDuration = 3
    const total = homeDuration + splashDuration

    const animate = () => {
      if (!mountedRef.current) return
      timeRef.current += 1 / 30

      if (timeRef.current < homeDuration) {
        setPhase("home")
        const homeRender = HOME_RENDERERS[brand.type]
        if (homeRender) homeRender(ctx, w, h, timeRef.current)
      } else {
        setPhase("splash")
        const splashTime = timeRef.current - homeDuration
        const splashRender = SPLASH_RENDERERS[brand.type]
        if (splashRender) splashRender(ctx, w, h, splashTime)
      }

      if (timeRef.current >= total) timeRef.current = 0
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(animRef.current)
    }
  }, [brand])

  return (
    <div className="absolute inset-0">
      {!loaded && <SplashSkeleton />}
      <canvas
        ref={canvasRef}
        width={260}
        height={462}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {/* Phase indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            phase === "home" ? "bg-white/40 scale-100" : "bg-white/10 scale-75"
          }`}
        />
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            phase === "splash" ? "bg-white/40 scale-100" : "bg-white/10 scale-75"
          }`}
        />
      </div>
    </div>
  )
}

// ── Device Frame ──
function DeviceFrame({ brand, index }: { brand: (typeof BRANDS)[0]; index: number }) {
  return (
    <div
      className="group relative"
      style={{
        animation: `device-enter 0.8s ease-out ${0.2 + index * 0.2}s both`,
      }}
    >
      <div className="relative mx-auto w-[240px] sm:w-[270px]">
        <div className="relative aspect-[9/16] rounded-[32px] border-2 border-[#222222] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-black/50 transition-all duration-700 group-hover:shadow-[#6366F1]/15 group-hover:border-[#333333] group-hover:-translate-y-1.5">
          <div className={`absolute inset-0 bg-gradient-to-b ${brand.homeGradient} transition-opacity duration-500`} />

          {/* Canvas animation */}
          <BrandCanvas brand={brand} />

          {/* Top notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-2xl flex items-center justify-center z-10">
            <div className="w-2 h-2 rounded-full bg-[#222222]" />
          </div>

          {/* Hover overlay — icon tap effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:backdrop-brightness-110 z-20">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-[splash-icon-bounce_0.6s_ease-out] shadow-lg shadow-black/30">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none z-10" />
        </div>

        <div className="mt-4 text-center transition-all duration-300">
          <p className="text-white text-sm font-semibold tracking-tight">{brand.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[#666666] text-xs">{brand.energy}</span>
            <span className="text-[#333333] text-xs">·</span>
            <span className="text-[#666666] text-xs">{brand.industry}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Section ──
export default function ExampleAnimations() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Background ambient glow following mouse
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMouse = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      section.style.setProperty("--glow-x", `${x}%`)
      section.style.setProperty("--glow-y", `${y}%`)
    }

    section.addEventListener("mousemove", handleMouse)
    return () => section.removeEventListener("mousemove", handleMouse)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="examples"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Background ambient glow — follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(99, 102, 241, 0.04) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366F1]/[0.015] rounded-full blur-[120px] pointer-events-none" />

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
            Three prompts, three completely different splash screen styles — from icon tap to full brand launch
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <RotateCcw className="w-3 h-3 text-[#555555]" />
            <span className="text-[11px] text-[#555555]">
              Hover to tap the icon &middot; 2s homescreen + 3s splash &middot; loops
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {BRANDS.map((brand, i) => (
            <DeviceFrame key={brand.id} brand={brand} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
