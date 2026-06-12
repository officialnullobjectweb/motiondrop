"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  BookOpen, Key, Smartphone, Code2, Download, Lightbulb,
  ExternalLink, Sparkles, Shield, Zap, Palette, ArrowUpRight,
  Check, ChevronLeft,
} from "lucide-react"
import { toast } from "sonner"
import { PROVIDERS } from "@/constants/providers"

// ── Sidebar Section Links ──
const SECTIONS = [
  { id: "getting-your-free-api-key", label: "API Keys", icon: "🔑" },
  { id: "how-to-use-your-lottie-file", label: "Lottie Usage", icon: "📱" },
  { id: "understanding-the-output-formats", label: "Formats", icon: "📦" },
  { id: "tips-for-better-results", label: "Tips", icon: "💡" },
  { id: "keyboard-shortcuts", label: "Shortcuts", icon: "⌨️" },
]

// ── Sub-components ──

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
  id,
}: {
  icon: any
  title: string
  subtitle?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <section className="space-y-5 scroll-mt-24" id={id}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/10 flex items-center justify-center ring-1 ring-[#6366F1]/20 shrink-0">
          <Icon className="w-5 h-5 text-[#6366F1]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-[#888888] mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code copied to clipboard", { duration: 2000 })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      {language && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 border-b border-[#222222] bg-[#0D0D0D] rounded-t-lg z-10">
          <span className="text-[10px] font-medium text-[#555555] uppercase tracking-wider">{language}</span>
          <button
            ref={btnRef}
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-[10px] font-medium border rounded-full px-3 py-1 transition-all ${
              copied
                ? "text-green-400 border-green-500/30 bg-green-500/10"
                : "text-[#555555] border-[#333333] hover:text-white hover:border-[#555555]"
            }`}
            aria-label={`Copy ${language} code`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              "Copy"
            )}
          </button>
        </div>
      )}
      <pre
        className={`bg-[#0A0A0A] border border-[#222222] rounded-lg overflow-x-auto text-xs text-[#BBBBBB] font-mono leading-relaxed ${
          language ? "pt-12" : "p-4"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ProviderCard({
  name,
  icon,
  gradient,
  url,
  steps,
  note,
}: {
  name: string
  icon: string
  gradient: string
  url: string
  steps: string[]
  note?: string
}) {
  return (
    <div className="group relative bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-all hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 flex items-center justify-center text-lg`}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{name}</h4>
          {note && <p className="text-[10px] text-[#555555] mt-0.5">{note}</p>}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[#6366F1] hover:text-[#818CF8] transition-colors"
          aria-label={`Get ${name} API key`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-[#888888] leading-relaxed">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center text-[10px] font-medium mt-0.5">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function FormatCard({
  icon: Icon,
  title,
  badge,
  children,
  color,
}: {
  icon: any
  title: string
  badge?: string
  children: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {badge && (
          <span className="text-[10px] bg-[#6366F1]/20 text-[#6366F1] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ml-auto">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-[#888888] leading-relaxed">{children}</p>
    </div>
  )
}

function Shortcut({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#0A0A0A] border border-[#222222]">
      <kbd className="font-mono text-[11px] text-[#6366F1] bg-[#6366F1]/10 px-2.5 py-1 rounded-md min-w-[60px] text-center font-medium">
        {keys}
      </kbd>
      <span className="text-xs text-[#888888]">{desc}</span>
    </div>
  )
}

// ── Provider Data ──
const PROVIDER_CONFIGS: Record<
  string,
  {
    icon: string
    gradient: string
    url: string
    note?: string
    steps: string[]
  }
> = {
  gemini: {
    icon: "✦",
    gradient: "from-[#4285F4]/20 to-[#34A853]/10",
    url: "https://aistudio.google.com/apikey",
    note: "Recommended — Free tier",
    steps: [
      "Visit Google AI Studio and sign in with your Google account",
      "Click 'Get API Key' in the left sidebar",
      "Click 'Create API Key', select your Google Cloud project",
      "Copy your key (starts with AIzaSy)",
      "Open MotionDrop, click Connect API Key, select Gemini, paste your key",
      "Click 'Test Connection' to verify your key works",
    ],
  },
  groq: {
    icon: "⚡",
    gradient: "from-[#F97316]/20 to-[#FDBA74]/10",
    url: "https://console.groq.com/keys",
    note: "Free tier available",
    steps: [
      "Go to the Groq console and create a free account",
      "Navigate to API Keys in the sidebar menu",
      "Click 'Create API Key', give it a name",
      "Copy your key (starts with gsk_)",
      "In MotionDrop, select Groq as your provider and paste the key",
      "Verify with 'Test Connection'",
    ],
  },
  openrouter: {
    icon: "◎",
    gradient: "from-[#8B5CF6]/20 to-[#A78BFA]/10",
    url: "https://openrouter.ai/keys",
    note: "Access 200+ models with one key",
    steps: [
      "Visit OpenRouter and sign in with Google or GitHub",
      "Go to the Keys page from the sidebar",
      "Click 'Create Key' and copy it (starts with sk-or-v1-)",
      "Paste into MotionDrop and select OpenRouter",
    ],
  },
  openai: {
    icon: "◆",
    gradient: "from-[#10A37F]/20 to-[#2EC4B6]/10",
    url: "https://platform.openai.com/api-keys",
    note: "Paid account required",
    steps: [
      "Go to platform.openai.com and sign in",
      "Navigate to API Keys in settings",
      "Click 'Create new secret key'",
      "Copy your key (starts with sk-proj- or sk-)",
      "Note: OpenAI requires a paid account with pre-loaded credits",
    ],
  },
  anthropic: {
    icon: "▲",
    gradient: "from-[#D97706]/20 to-[#F59E0B]/10",
    url: "https://console.anthropic.com/settings/keys",
    note: "Excellent for creative tasks",
    steps: [
      "Visit the Anthropic console and sign in",
      "Go to Settings > API Keys",
      "Click 'Create Key' and copy it (starts with sk-ant-)",
      "Paste into MotionDrop with Anthropic selected",
    ],
  },
}

// ── Main Page ──
export default function DocsPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>("all")

  const provider = PROVIDER_CONFIGS[selectedProvider]
  const showProvider = selectedProvider !== "all"

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-[#222222] pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/10 flex items-center justify-center ring-1 ring-[#6366F1]/20">
              <BookOpen className="w-6 h-6 text-[#6366F1]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Documentation</h1>
              <p className="text-sm text-[#888888]">Everything you need to get started with MotionDrop</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 lg:gap-12">
          {/* ── Sidebar ── */}
          <aside
            className="hidden lg:block w-56 shrink-0"
            aria-label="Documentation navigation"
          >
            <div className="sticky top-24 space-y-6">
              {/* Provider filter dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-[#555555] uppercase tracking-wider">
                  Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full text-xs bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white focus:border-[#6366F1]/50 focus:outline-none focus:ring-1 focus:ring-[#6366F1]/20 transition-colors appearance-none cursor-pointer"
                  aria-label="Filter documentation by provider"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    paddingRight: "32px",
                  }}
                >
                  <option value="all">All Providers</option>
                  {PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section links */}
              <nav className="space-y-1">
                <p className="text-[10px] font-medium text-[#555555] uppercase tracking-wider mb-2">
                  On this page
                </p>
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-xs text-[#666666] hover:text-white transition-colors py-1.5 px-2 rounded-md hover:bg-[#111111]"
                    aria-label={`Jump to ${section.label} section`}
                  >
                    <span className="text-[10px]">{section.icon}</span>
                    <span>{section.label}</span>
                  </a>
                ))}
              </nav>

              {/* Quick CTA */}
              <div className="pt-4 border-t border-[#222222]">
                <Link
                  href="/app"
                  className="flex items-center gap-2 text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open App
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Mobile provider filter ── */}
          <div className="lg:hidden w-full mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-medium text-[#555555] uppercase tracking-wider mb-1.5 block">
                  Filter by provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full text-xs bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 text-white focus:border-[#6366F1]/50 focus:outline-none focus:ring-1 focus:ring-[#6366F1]/20 transition-colors appearance-none cursor-pointer"
                  aria-label="Filter documentation by provider"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    paddingRight: "32px",
                  }}
                >
                  <option value="all">All Providers</option>
                  {PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0" role="main">
            <div className="max-w-3xl space-y-20">
              {/* ── API Keys Section ── */}
              {(!showProvider || selectedProvider === "gemini" || selectedProvider === "groq" || selectedProvider === "all") && (
                <Section
                  icon={Key}
                  title="Getting Your Free API Key"
                  subtitle="MotionDrop uses your own AI provider API key to generate animations. Your key stays in your browser — we never store it on any server."
                  id="getting-your-free-api-key"
                >
                  <div className="bg-gradient-to-r from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent border border-[#6366F1]/20 rounded-xl p-5 flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium mb-1">Quick start recommendation</p>
                      <p className="text-xs text-[#888888] leading-relaxed">
                        Gemini and Groq offer <strong className="text-white">completely free</strong> API keys with generous rate limits.
                        Start with one of these to test the tool, then add more providers later.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Show only the selected provider, or all */}
                    {(showProvider
                      ? [selectedProvider]
                      : ["gemini", "groq"]
                    ).map((id) => {
                      const cfg = PROVIDER_CONFIGS[id]
                      if (!cfg) return null
                      return (
                        <ProviderCard
                          key={id}
                          name={id === "gemini" ? "Gemini" : id === "groq" ? "Groq" : id}
                          icon={cfg.icon}
                          gradient={cfg.gradient}
                          url={cfg.url}
                          note={cfg.note}
                          steps={cfg.steps}
                        />
                      )
                    })}

                    {/* Other providers (collapsible) when showing all */}
                    {!showProvider && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-[#6366F1] hover:text-[#818CF8] transition-colors font-medium py-2">
                          Other providers (OpenRouter, OpenAI, Anthropic)
                          <span className="ml-1 text-xs opacity-60 group-open:hidden">▼</span>
                          <span className="ml-1 text-xs opacity-60 hidden group-open:inline">▲</span>
                        </summary>
                        <div className="mt-4 space-y-4">
                          {["openrouter", "openai", "anthropic"].map((id) => {
                            const cfg = PROVIDER_CONFIGS[id]
                            if (!cfg) return null
                            return (
                              <ProviderCard
                                key={id}
                                name={id === "openrouter" ? "OpenRouter" : id === "openai" ? "OpenAI" : "Anthropic"}
                                icon={cfg.icon}
                                gradient={cfg.gradient}
                                url={cfg.url}
                                note={cfg.note}
                                steps={cfg.steps}
                              />
                            )
                          })}
                        </div>
                      </details>
                    )}

                    {/* Show full other providers when a specific non-free provider is selected */}
                    {showProvider && selectedProvider !== "gemini" && selectedProvider !== "groq" && (
                      <ProviderCard
                        name={
                          selectedProvider === "openrouter"
                            ? "OpenRouter"
                            : selectedProvider === "openai"
                              ? "OpenAI"
                              : "Anthropic"
                        }
                        icon={PROVIDER_CONFIGS[selectedProvider]?.icon || "✦"}
                        gradient={PROVIDER_CONFIGS[selectedProvider]?.gradient || "from-[#6366F1]/20 to-[#8B5CF6]/10"}
                        url={PROVIDER_CONFIGS[selectedProvider]?.url || "#"}
                        note={PROVIDER_CONFIGS[selectedProvider]?.note}
                        steps={PROVIDER_CONFIGS[selectedProvider]?.steps || []}
                      />
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/5 to-transparent border border-yellow-500/15 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-400/80 leading-relaxed">
                      <strong className="text-yellow-400">Security:</strong> Your API key stays in your browser&apos;s localStorage.
                      It is never sent to any server except the AI provider you choose. We recommend generating a dedicated
                      key for MotionDrop that you can revoke when not in use.
                    </p>
                  </div>
                </Section>
              )}

              {/* ── Lottie Usage Section ── */}
              <Section
                icon={Smartphone}
                title="How to Use Your Lottie File"
                subtitle="Lottie is a lightweight, scalable animation format that works beautifully across all platforms. Here is how to integrate your exported .json file."
                id="how-to-use-your-lottie-file"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#6366F1]" />
                      React / Next.js
                    </h3>
                    <CodeBlock
                      language="tsx"
                      code={`npm install lottie-web

import { useEffect, useRef } from "react"

export default function SplashScreen() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/splash.json", // ← your exported Lottie file
    })
    return () => anim.destroy()
  }, [])

  return <div ref={container} className="w-full h-full" />
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#6366F1]" />
                      React Native
                    </h3>
                    <CodeBlock
                      language="tsx"
                      code={`npm install lottie-react-native

import LottieView from "lottie-react-native"
import { useRef } from "react"

export default function SplashScreen() {
  const animation = useRef<LottieView>(null)

  return (
    <LottieView
      ref={animation}
      source={require("./splash.json")}
      autoPlay
      loop
      style={{ width: "100%", height: "100%" }}
    />
  )
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      iOS (Swift)
                    </h3>
                    <CodeBlock
                      language="swift"
                      code={`import Lottie

class SplashViewController: UIViewController {
  private var animationView: LottieAnimationView?

  override func viewDidLoad() {
    super.viewDidLoad()

    animationView = .init(name: "splash")
    animationView?.frame = view.bounds
    animationView?.contentMode = .scaleAspectFit
    animationView?.loopMode = .loop
    animationView?.animationSpeed = 1.0

    view.addSubview(animationView!)
    animationView?.play()
  }
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      Android (Kotlin / Jetpack Compose)
                    </h3>
                    <CodeBlock
                      language="kotlin"
                      code={`// build.gradle.kts
dependencies {
  implementation("com.airbnb.android:lottie:6.6.0")
}

// XML Layout
<com.airbnb.lottie.LottieAnimationView
  android:id="@+id/animationView"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:lottie_rawRes="@raw/splash"
  app:lottie_loop="true"
  app:lottie_autoPlay="true" />

// Or Jetpack Compose:
@Composable
fun SplashAnimation() {
  val composition by rememberLottieComposition(
    LottieCompositionSpec.RawRes(R.raw.splash)
  )
  LottieAnimation(
    composition = composition,
    iterations = LottieConstants.IterateForever
  )
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      Plain HTML (Works everywhere)
                    </h3>
                    <CodeBlock
                      language="html"
                      code={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
</head>
<body style="margin:0">
  <div id="animation" style="width:100vw;height:100vh"></div>
  <script>
    lottie.loadAnimation({
      container: document.getElementById("animation"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "./splash.json"
    })
  </script>
</body>
</html>`}
                    />
                  </div>
                </div>
              </Section>

              {/* ── Formats Section ── */}
              <Section
                icon={Download}
                title="Understanding the Output Formats"
                subtitle="Each export format serves a different purpose. Here is when to use which one."
                id="understanding-the-output-formats"
              >
                <div className="grid gap-3">
                  <FormatCard icon={Code2} title="Lottie JSON" badge="Recommended" color="bg-[#6366F1]/10 text-[#6366F1]">
                    Best for production apps. Vector-based — scales perfectly to any screen size. Extremely small file size.
                    Can be edited in After Effects via Bodymovin. <strong className="text-white">Use this for mobile apps, web apps, and production.</strong>
                  </FormatCard>

                  <FormatCard icon={() => <span className="text-emerald-500 text-sm font-bold">GIF</span>} title="Animated GIF" color="bg-emerald-500/10 text-emerald-500">
                    Works everywhere with zero setup — no libraries, no code needed. Best for social media, presentations,
                    and platforms that only accept images. <strong className="text-white">Larger file size, lower quality — use for sharing, not production.</strong>
                  </FormatCard>

                  <FormatCard icon={() => <span className="text-rose-500 text-sm font-bold">MP4</span>} title="MP4 Video" color="bg-rose-500/10 text-rose-500">
                    Standard video format compatible with every video player and editor. Best for video editing pipelines
                    (Premiere Pro, Final Cut, CapCut), demo reels, and social media ads.
                    <strong className="text-white"> Use for video content and presentations.</strong>
                  </FormatCard>

                  <FormatCard icon={() => <span className="text-amber-500 text-sm font-bold">CSS</span>} title="CSS Animation" color="bg-amber-500/10 text-amber-500">
                    Self-contained CSS file with @keyframes. Drop it into any HTML page for a working animation with
                    zero JavaScript. <strong className="text-white">Best for simple web embeds and landing pages.</strong>
                  </FormatCard>
                </div>
              </Section>

              {/* ── Tips Section ── */}
              <Section
                icon={Lightbulb}
                title="Tips for Better Results"
                subtitle="The more context you give, the better the animation. Here is how to write prompts that shine."
                id="tips-for-better-results"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-gradient-to-br from-[#6366F1]/5 to-transparent border border-[#222222] rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#6366F1]" />
                      What to include
                    </h4>
                    <ul className="space-y-2.5">
                      {[
                        { label: "Brand name", tip: "Make it clear: 'FitPro', 'PayFlow', 'Serenity'" },
                        { label: "Industry", tip: "Sets the mood: 'fitness app', 'fintech', 'meditation'" },
                        { label: "Colors", tip: "Let AI choose or specify: 'blue and white', 'neon green'" },
                        { label: "Energy", tip: "Drives motion: 'energetic', 'calm', 'professional'" },
                        { label: "Reference", tip: "Style cues: 'Apple-style', 'minimal', 'bold'" },
                      ].map((item) => (
                        <li key={item.label} className="flex items-start gap-2 text-xs text-[#888888]">
                          <span className="text-[#6366F1] font-medium shrink-0 w-20">{item.label}</span>
                          <span className="text-[#666666]">— {item.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-transparent border border-[#222222] rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#8B5CF6]" />
                      Example prompts
                    </h4>
                    <div className="space-y-2.5">
                      {[
                        { prompt: "Fitness app called FitPro, blue and white, energetic", result: "Bold type + dynamic particles" },
                        { prompt: "Meditation app Serenity, purple gold, calm", result: "Soft gradient + floating dots" },
                        { prompt: "Fintech PayFlow, dark blue, professional", result: "Clean grid + sharp transitions" },
                        { prompt: "Gaming app, neon green black, explosive", result: "Fast motion + confetti burst" },
                        { prompt: "Luxury brand, gold on black, elegant", result: "Minimal + sharp + subtle glow" },
                      ].map((ex) => (
                        <div key={ex.prompt} className="text-xs leading-relaxed">
                          <span className="text-white">&ldquo;{ex.prompt}&rdquo;</span>
                          <span className="text-[#555555]"> → </span>
                          <span className="text-[#888888]">{ex.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/15 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Pro tips
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Upload a logo (PNG/SVG) — MotionDrop centers and animates it automatically",
                      "Use Gemini or Groq (both free) for testing, then add paid providers later",
                      "Tweak Speed and Energy sliders after generation — small changes have big impact",
                      "Click Regenerate for a completely new take — each run is unique",
                      "Export Lottie for apps, GIF for sharing, MP4 for video, CSS for web",
                      "Use the Test Connection button to verify your API key before generating",
                    ].map((tip) => (
                      <div key={tip} className="flex items-start gap-2 text-xs text-[#888888] leading-relaxed">
                        <span className="text-blue-400 mt-0.5 shrink-0">✦</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* ── Shortcuts Section ── */}
              <Section
                icon={Code2}
                title="Keyboard Shortcuts"
                subtitle="Speed up your workflow with these shortcuts. Works when no input field is focused."
                id="keyboard-shortcuts"
              >
                <div className="space-y-1.5">
                  <Shortcut keys="Space" desc="Play / Pause animation" />
                  <Shortcut keys="R" desc="Restart animation from the beginning" />
                  <Shortcut keys="L" desc="Toggle looping on / off" />
                  <Shortcut keys="1" desc="Switch canvas to Portrait (9:16)" />
                  <Shortcut keys="2" desc="Switch canvas to Square (1:1)" />
                  <Shortcut keys="3" desc="Switch canvas to Desktop (16:9)" />
                  <Shortcut keys="G" desc="Generate animation (when prompt is filled)" />
                  <Shortcut keys="Esc" desc="Close modals and color picker" />
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-[#222222] text-center">
              <p className="text-xs text-[#555555]">
                Need more help?{" "}
                <a
                  href="https://github.com/officialnullobjectweb/motiondrop/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366F1] hover:text-[#818CF8] transition-colors"
                >
                  Open a GitHub issue
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
