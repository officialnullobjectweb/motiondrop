"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"

const EXAMPLES = [
  {
    name: "FitPro",
    tagline: "Transform Your Body",
    industry: "fitness",
    gradient: "from-[#0A1628] via-[#1A1A3E] to-[#0A1628]",
    accent: "#3B82F6",
    primary: "#60A5FA",
    secondary: "#93C5FD",
    energy: "High Energy",
    colors: ["#3B82F6", "#60A5FA", "#93C5FD"],
    dots: "grid-cols-6",
  },
  {
    name: "PayFlow",
    tagline: "Smart Finance",
    industry: "fintech",
    gradient: "from-[#0F0A1A] via-[#1A0F2E] to-[#0F0A1A]",
    accent: "#8B5CF6",
    primary: "#A78BFA",
    secondary: "#C4B5FD",
    energy: "Professional",
    colors: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
    dots: "grid-cols-5",
  },
  {
    name: "Serenity",
    tagline: "Find Your Calm",
    industry: "wellness",
    gradient: "from-[#0A1A14] via-[#0F2A1E] to-[#0A1A14]",
    accent: "#34D399",
    primary: "#6EE7B7",
    secondary: "#A7F3D0",
    energy: "Calm",
    colors: ["#34D399", "#6EE7B7", "#A7F3D0"],
    dots: "grid-cols-4",
  },
]

function DeviceFrame({ example, index }: { example: typeof EXAMPLES[0]; index: number }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="group relative" style={{ animationDelay: `${index * 0.15}s` }}>
      <div className="relative mx-auto w-[220px] sm:w-[260px]">
        <div className="relative aspect-[9/16] rounded-[28px] border-2 border-[#222222] overflow-hidden bg-[#0A0A0A] shadow-2xl shadow-black/50">
          <div className={`absolute inset-0 bg-gradient-to-b ${example.gradient}`} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${example.accent} 0%, transparent 70%)` }} />
          <div className="relative h-full flex flex-col items-center justify-center px-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border"
              style={{ borderColor: `${example.accent}40`, backgroundColor: `${example.accent}15` }}
            >
              <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: example.accent }} />
            </div>
            <p className="text-white text-lg font-bold tracking-tight text-center">{example.name}</p>
            <p className="text-xs mt-1.5 text-center opacity-60" style={{ color: example.secondary }}>
              {example.tagline}
            </p>
            <div className={`mt-4 grid ${example.dots} gap-1.5 w-full px-2`}>
              {Array.from({ length: index === 0 ? 18 : index === 1 ? 15 : 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-full"
                  style={{
                    backgroundColor: example.colors[i % 3],
                    opacity: 0.15 + (i % 3) * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[80px] h-[5px] bg-black rounded-b-lg" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[60px] h-[4px] bg-black/60 rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="mt-4 text-center">
          <p className="text-white text-sm font-medium">{example.name}</p>
          <p className="text-[#666666] text-xs mt-0.5">{example.energy} &middot; {example.industry}</p>
        </div>
      </div>
    </div>
  )
}

export default function ExampleAnimations() {
  return (
    <section id="examples" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-white text-3xl sm:text-4xl font-bold">
            See It In Action
          </h2>
          <p className="text-[#888888] text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Three prompts, three completely different animation styles — generated in seconds
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {EXAMPLES.map((ex, i) => (
            <DeviceFrame key={ex.name} example={ex} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
