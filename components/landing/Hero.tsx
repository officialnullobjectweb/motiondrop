"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const fluids = container.querySelectorAll<HTMLDivElement>(".hero-fluid")
      fluids.forEach((el, i) => {
        const speed = 15 + i * 8
        el.style.transform = `translate(${x * speed * -1}px, ${y * speed * -1}px)`
      })
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden min-h-[90vh] flex items-center"
    >
      {/* Aurora background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-fluid absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6366F1]/8 to-purple-500/5 rounded-full blur-[100px] animate-[hero-fluid-drift_20s_ease-in-out_infinite]" />
        <div className="hero-fluid absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#8B5CF6]/6 to-[#6366F1]/4 rounded-full blur-[120px] animate-[hero-fluid-pulse_25s_ease-in-out_infinite]" />
        <div className="hero-fluid absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-[#A78BFA]/5 to-[#6366F1]/3 rounded-full blur-[80px] animate-[hero-fluid-drift_18s_ease-in-out_infinite_2s]" />

        {/* Smoke particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-[#6366F1]/10 to-transparent"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              opacity: 0,
              animation: `hero-smoke-float ${12 + i * 4}s ease-in-out infinite`,
              animationDelay: `${i * 3}s`,
              filter: "blur(40px)",
            }}
          />
        ))}

        {/* Aurora sweep */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#6366F1]/4 via-transparent to-transparent animate-[hero-aurora_12s_ease-in-out_infinite]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full">
        {/* Badge */}
        <span
          className="inline-block text-xs font-medium text-[#888888] border border-[#222222] rounded-full px-4 py-1.5 mb-8 hover:border-[#6366F1]/40 transition-colors"
          style={{ animation: "hero-subtitle-reveal 0.8s ease-out forwards" }}
        >
          <span className="inline-block animate-[icon-ring-pulse_3s_ease-in-out_infinite] rounded-full mr-1.5">✦</span>
          Free & Open Source
        </span>

        {/* Headline */}
        <h1
          className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl"
          style={{ animation: "hero-title-reveal 1.2s ease-out 0.2s both" }}
        >
          Turn Words Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A78BFA]">
            Premium Animations
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#888888] text-lg sm:text-xl mt-6 max-w-2xl leading-relaxed"
          style={{ animation: "hero-subtitle-reveal 0.8s ease-out 0.6s both" }}
        >
          Describe your brand. Get a production-ready Lottie animation in seconds.{" "}
          <span className="text-white/60">No design skills needed.</span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          style={{ animation: "hero-subtitle-reveal 0.8s ease-out 0.8s both" }}
        >
          <Link
            href="/app"
            className="group bg-[#6366F1] hover:bg-[#4F46E5] text-white text-base font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-[#6366F1]/20 active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Start Creating Free
          </Link>
          <Link
            href="https://github.com/officialnullobjectweb/motiondrop"
            target="_blank"
            className="group text-white border border-white/20 hover:border-white/40 text-base font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:rotate-[-8deg] transition-transform" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>

        {/* Demo phone mockup */}
        <div
          className="mt-16 w-full max-w-sm mx-auto"
          style={{ animation: "demo-screen-enter 1s ease-out 1s both" }}
        >
          <div className="relative aspect-[9/16] max-h-[480px] mx-auto rounded-[28px] border border-[#222222] overflow-hidden bg-[#0A0A0A] animate-[demo-glow-pulse_4s_ease-in-out_infinite]">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/30 via-[#8B5CF6]/20 to-[#A78BFA]/30 animate-gradient-shift" />

            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-[#6366F1]/10 animate-[glow-ring_3s_ease-in-out_infinite]" />
              <div className="w-28 h-28 rounded-full border border-[#8B5CF6]/15 animate-[glow-ring_3s_ease-in-out_infinite_0.5s]" />
              <div className="w-16 h-16 rounded-full border border-[#A78BFA]/20 animate-[glow-ring_3s_ease-in-out_infinite_1s]" />
            </div>

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#6366F1]/30"
                style={{
                  left: `${15 + (i * 12) % 70}%`,
                  top: `${20 + (i * 8) % 60}%`,
                  animation: `particle-drift ${4 + (i % 3) * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                  "--drift-x": `${(i % 3 - 1) * 30}px`,
                  "--drift-y": `${(i % 2 === 0 ? -1 : 1) * 40}px`,
                } as React.CSSProperties}
              />
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center mb-6 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] animate-pulse-ring" />
              </div>

              {/* Animated text bars */}
              <div className="w-3/4 h-3 rounded-full bg-white/10 mb-3 animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="w-1/2 h-2 rounded-full bg-white/5 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-white/20" />

            {/* Glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
