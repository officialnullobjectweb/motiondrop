"use client"

import { useEffect, useRef } from "react"
import { Play, Sparkles } from "lucide-react"

const EXAMPLES = [
  {
    name: "FitPro",
    tagline: "Transform Your Body",
    industry: "Fitness",
    gradient: "from-[#0A1628] via-[#1A1A3E] to-[#0A1628]",
    accent: "#3B82F6",
    primary: "#60A5FA",
    secondary: "#93C5FD",
    energy: "High Energy",
    colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB"],
    particleCount: 20,
  },
  {
    name: "PayFlow",
    tagline: "Smart Finance",
    industry: "Fintech",
    gradient: "from-[#0F0A1A] via-[#1A0F2E] to-[#0F0A1A]",
    accent: "#8B5CF6",
    primary: "#A78BFA",
    secondary: "#C4B5FD",
    energy: "Professional",
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED"],
    particleCount: 15,
  },
  {
    name: "Serenity",
    tagline: "Find Your Calm",
    industry: "Wellness",
    gradient: "from-[#0A1A14] via-[#0F2A1E] to-[#0A1A14]",
    accent: "#34D399",
    primary: "#6EE7B7",
    secondary: "#A7F3D0",
    energy: "Calm",
    colors: ["#34D399", "#6EE7B7", "#A7F3D0", "#10B981"],
    particleCount: 10,
  },
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  life: number
}

function CanvasAnimation({ example }: { example: typeof EXAMPLES[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const timeRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    mountedRef.current = true

    const w = canvas.width
    const h = canvas.height

    // Initialize particles
    particlesRef.current = Array.from({ length: example.particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.8 - 0.2,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.4,
      life: Math.random(),
    }))

    // Reset state on prop change
    timeRef.current = 0
    let ringAngle = 0
    let lastFrameTime = 0
    const FPS_INTERVAL = 1000 / 30 // 30fps throttle

    const animate = (timestamp: number) => {
      if (!mountedRef.current) return

      // Throttle to 30fps
      if (timestamp - lastFrameTime < FPS_INTERVAL) {
        animFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = timestamp

      timeRef.current += 0.033
      const t = timeRef.current
      ctx.clearRect(0, 0, w, h)

      // Draw gradient background
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, example.colors[0] + "25")
      grad.addColorStop(0.5, example.colors[1] + "15")
      grad.addColorStop(1, example.colors[0] + "25")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Animated rings
      ringAngle += 0.02
      for (let i = 0; i < 2; i++) {
        const ringR = 40 + i * 25 + Math.sin(t * 0.5 + i) * 8
        ctx.beginPath()
        ctx.arc(w / 2, h * 0.35, ringR, 0, Math.PI * 2)
        const alpha = Math.min(25, Math.max(5, 15 + Math.sin(t + i) * 10))
        ctx.strokeStyle = example.colors[i + 1] + Math.floor(alpha).toString(16).padStart(2, "0")
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Particles
      for (const p of particlesRef.current) {
        p.y += p.vy
        p.x += Math.sin(t + p.life * 10) * 0.3
        p.alpha = 0.2 + Math.sin(t * 0.5 + p.life * 5) * 0.15

        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        const a = Math.min(255, Math.floor(p.alpha * 80))
        ctx.fillStyle = example.colors[Math.floor(p.life * 3) % 3] + Math.floor(a).toString(16).padStart(2, "0")
        ctx.fill()
      }

      // Logo placeholder with glow
      const logoGlow = ctx.createRadialGradient(w / 2, h * 0.35, 0, w / 2, h * 0.35, 30)
      logoGlow.addColorStop(0, example.accent + "40")
      logoGlow.addColorStop(1, example.accent + "00")
      ctx.fillStyle = logoGlow
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.35, 30, 0, Math.PI * 2)
      ctx.fill()

      // Logo square (use fillRect as roundRect fallback)
      const logoSize = 18 + Math.sin(t * 2) * 1.5
      ctx.fillStyle = example.accent
      const lx = w / 2 - logoSize / 2
      const ly = h * 0.35 - logoSize / 2
      if (typeof CanvasRenderingContext2D.prototype.roundRect === "function") {
        ctx.beginPath()
        ;(ctx as any).roundRect(lx, ly, logoSize, logoSize, 5)
        ctx.fill()
      } else {
        ctx.fillRect(lx, ly, logoSize, logoSize)
      }

      // Text
      const textY = h * 0.52
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 14px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(example.name, w / 2, textY)

      ctx.fillStyle = example.secondary + "99"
      ctx.font = "10px Inter, sans-serif"
      ctx.fillText(example.tagline, w / 2, textY + 22)

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [example])

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={462}
      className="w-full h-full object-cover"
    />
  )
}

function DeviceFrame({ example, index }: { example: typeof EXAMPLES[0]; index: number }) {
  return (
    <div
      className="group relative"
      style={{
        animation: `device-enter 0.8s ease-out ${0.2 + index * 0.2}s both`,
      }}
    >
      <div className="relative mx-auto w-[240px] sm:w-[270px]">
        {/* Phone frame */}
        <div className="relative aspect-[9/16] rounded-[32px] border-2 border-[#222222] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-black/50 transition-all duration-500 group-hover:shadow-[#6366F1]/10 group-hover:border-[#333333] group-hover:-translate-y-1">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${example.gradient} transition-opacity duration-500`} />

          {/* Canvas animation */}
          <div className="absolute inset-0">
            <CanvasAnimation example={example} />
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

        {/* Label */}
        <div className="mt-4 text-center transition-all duration-300">
          <p className="text-white text-sm font-semibold tracking-tight">{example.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[#666666] text-xs">{example.energy}</span>
            <span className="text-[#333333] text-xs">·</span>
            <span className="text-[#666666] text-xs">{example.industry}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExampleAnimations() {
  return (
    <section id="examples" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366F1]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-medium text-[#6366F1] bg-[#6366F1]/10 rounded-full px-3 py-1 mb-4">
            <Sparkles className="w-3 h-3 inline mr-1" />
            See It In Action
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold">
            Made With MotionDrop
          </h2>
          <p className="text-[#888888] text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Three prompts, three completely different animation styles — generated in seconds
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {EXAMPLES.map((ex, i) => (
            <DeviceFrame key={ex.name} example={ex} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
