"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Download, History, BookOpen, ExternalLink } from "lucide-react"
import { PROVIDERS } from "@/constants/providers"

const SITEMAP_ITEMS = [
  {
    href: "/app",
    label: "App",
    desc: "Generate animations",
    icon: Sparkles,
    color: "from-[#6366F1] to-[#8B5CF6]",
    subItems: [
      { text: "Add API key", via: "Connect any provider" },
      { text: "Type prompt", via: "Describe your brand" },
      { text: "Edit & export", via: "4 output formats" },
    ],
  },
  {
    href: "/history",
    label: "History",
    desc: "Browse past work",
    icon: History,
    color: "from-[#8B5CF6] to-[#A78BFA]",
    subItems: [
      { text: "Load prev animations", via: "One-click restore" },
      { text: "Re-download", via: "Any format" },
    ],
  },
  {
    href: "/docs",
    label: "Docs",
    desc: "Guides & API setup",
    icon: BookOpen,
    color: "from-[#A78BFA] to-[#6366F1]",
    subItems: [
      { text: "5 provider guides", via: "Gemini, Groq, OpenAI..." },
      { text: "Lottie integration", via: "React, iOS, Android" },
    ],
  },
]

export default function SitemapSection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="sitemap"
      className="py-20 sm:py-28 relative overflow-hidden"
      aria-label="Site navigation map"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6366F1]/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-medium text-[#6366F1] bg-[#6366F1]/10 rounded-full px-3 py-1 mb-4">
            Quick Start Map
          </span>
          <h2 className="text-white text-3xl sm:text-4xl font-bold">
            Your Journey in 3 Steps
          </h2>
          <p className="text-[#888888] text-base mt-4 max-w-2xl mx-auto">
            From your first API key to your exported animation — here&apos;s exactly how MotionDrop works
          </p>
        </div>

        {/* Provider badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PROVIDERS.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-[#666666] hover:text-white border border-[#222222] hover:border-[#333333] rounded-full px-3 py-1.5 transition-all"
              aria-label={`Get ${p.name} API key`}
            >
              <p.Icon className="w-3 h-3" />
              {p.name}
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </a>
          ))}
        </div>

        {/* Sitemap flow */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-4 lg:gap-8">
          {SITEMAP_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.href} className="flex items-center gap-4 md:gap-2 lg:gap-4">
                {/* Card */}
                <Link
                  href={item.href}
                  className={`group relative flex-1 md:flex-none w-full md:w-64 bg-[#111111] border border-[#222222] rounded-xl p-5 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${
                    visible ? "opacity-100" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    animation: visible ? `sitemap-item-in 0.6s ease-out ${index * 0.15}s both` : "none",
                    transition: "opacity 0.5s, transform 0.5s",
                  }}
                  aria-label={`Go to ${item.label} page`}
                >
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color}/20 flex items-center justify-center ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{item.label}</p>
                      <p className="text-[#666666] text-[10px]">{item.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {item.subItems.map((sub) => (
                      <div key={sub.text} className="flex items-center gap-2 text-[11px] text-[#555555] group-hover:text-[#888888] transition-colors">
                        <span className="w-1 h-1 rounded-full bg-[#6366F1]/40" />
                        <span>{sub.text}</span>
                        <span className="text-[9px] text-[#333333]">— {sub.via}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]" />
                  </div>
                </Link>

                {/* Arrow connector */}
                {index < SITEMAP_ITEMS.length - 1 && (
                  <ArrowRight className="hidden md:block w-5 h-5 text-[#333333] shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-12 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{
            animation: visible ? "sitemap-item-in 0.6s ease-out 0.6s both" : "none",
          }}
        >
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Start Creating
          </Link>
        </div>
      </div>
    </section>
  )
}
