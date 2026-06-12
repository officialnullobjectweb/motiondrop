"use client"

import { useState, useRef } from "react"
import { Key, Sparkles, Download, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Key,
    number: "01",
    title: "Add Your API Key",
    description:
      "Paste your free Gemini or Groq API key. Stored only in your browser, never on our servers.",
    gradient: "from-[#6366F1]/20 via-[#6366F1]/5 to-transparent",
    borderGlow: "group-hover:border-[#6366F1]/40",
    iconBg: "bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20",
    iconBorder: "border-[#6366F1]/20 group-hover:border-[#6366F1]/40",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Describe Your Brand",
    description:
      "Type your app name, colors, and feeling. Our AI understands even vague descriptions.",
    gradient: "from-[#8B5CF6]/20 via-[#8B5CF6]/5 to-transparent",
    borderGlow: "group-hover:border-[#8B5CF6]/40",
    iconBg: "bg-[#8B5CF6]/10 group-hover:bg-[#8B5CF6]/20",
    iconBorder: "border-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/40",
  },
  {
    icon: Download,
    number: "03",
    title: "Download & Use",
    description:
      "Get Lottie JSON, GIF, MP4, or CSS. Ready to use in any project immediately.",
    gradient: "from-[#A78BFA]/20 via-[#A78BFA]/5 to-transparent",
    borderGlow: "group-hover:border-[#A78BFA]/40",
    iconBg: "bg-[#A78BFA]/10 group-hover:bg-[#A78BFA]/20",
    iconBorder: "border-[#A78BFA]/20 group-hover:border-[#A78BFA]/40",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6366F1]/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium text-[#6366F1] bg-[#6366F1]/10 rounded-full px-3 py-1 mb-4">
            How it Works
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold">
            Three Steps to Premium Animation
          </h2>
          <p className="text-[#888888] text-base mt-4 max-w-lg mx-auto">
            From idea to animation in under a minute. No design skills, no complex tools.
          </p>
        </div>

        {/* Step cards with connecting line */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#222222] to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="group relative bg-[#111111] border border-[#222222] rounded-xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Arrow connector (mobile) */}
                  {index < steps.length - 1 && (
                    <ArrowRight className="md:hidden w-5 h-5 text-[#333333] mb-2 rotate-90" />
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 w-16 h-16 rounded-full ${step.iconBg} ${step.iconBorder} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#6366F1]/10`}>
                    <Icon className="w-7 h-7 text-white transition-transform duration-500 group-hover:rotate-[-8deg]" />
                  </div>

                  {/* Step number */}
                  <span className="relative z-10 text-[#444444] text-sm font-mono mb-2 transition-colors duration-500 group-hover:text-[#6366F1]/60">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="relative z-10 text-white text-lg font-semibold mb-3 transition-all duration-500 group-hover:tracking-wide">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-[#888888] text-sm leading-relaxed transition-colors duration-500 group-hover:text-[#999999]">
                    {step.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#6366F1]/0 to-transparent transition-all duration-500 group-hover:via-[#6366F1]/30 group-hover:left-[10%] group-hover:right-[10%]" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="/app"
            className="inline-flex items-center gap-2 text-sm text-[#6366F1] hover:text-[#818CF8] transition-colors group"
          >
            <span>Ready to try it?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
